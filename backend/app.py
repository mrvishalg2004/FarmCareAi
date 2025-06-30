from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageEnhance
import pytesseract
import re
import shutil
import requests
import os
import logging
import time
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
PREDICTION_SERVICE_URL = 'http://localhost:5002/predict'  # Prediction service URL
PREDICTION_TIMEOUT = 10  # seconds

# Set Tesseract path - prioritize environment variable, then default Windows path
tesseract_path = os.environ.get('TESSERACT_PATH') or shutil.which("tesseract") or r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(tesseract_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_path
    logger.info(f"Using Tesseract at: {tesseract_path}")
else:
    logger.warning(f"Tesseract not found at {tesseract_path}. OCR may not work.")

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Helper to extract values using regex
def extract_param(text, name, patterns, default=0, cast_type=float):
    """Extract parameters using multiple pattern options with improved handling"""
    # Try each pattern until we find a match
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            try:
                # Use the first match
                value = matches[0].strip() if isinstance(matches[0], str) else matches[0][0].strip()
                
                # Remove any non-numeric characters except decimal point
                value = re.sub(r'[^\d.]', '', value)
                
                # Skip empty values
                if not value:
                    logger.warning(f"Empty value found for {name} with pattern='{pattern}'")
                    continue
                    
                result = cast_type(value)
                
                # Basic sanity check for reasonable values
                if name == 'N' and (result < 0 or result > 300):
                    logger.warning(f"Suspicious N value: {result}, using default")
                    continue
                elif name == 'P' and (result < 0 or result > 300):
                    logger.warning(f"Suspicious P value: {result}, using default")
                    continue
                elif name == 'K' and (result < 0 or result > 300):
                    logger.warning(f"Suspicious K value: {result}, using default")
                    continue
                elif name == 'temperature' and (result < -20 or result > 60):
                    logger.warning(f"Suspicious temperature value: {result}, using default")
                    continue
                elif name == 'humidity' and (result < 0 or result > 100):
                    logger.warning(f"Suspicious humidity value: {result}, using default")
                    continue
                elif name == 'ph' and (result < 0 or result > 14):
                    logger.warning(f"Suspicious pH value: {result}, using default")
                    continue
                elif name == 'rainfall' and (result < 0 or result > 5000):
                    logger.warning(f"Suspicious rainfall value: {result}, using default")
                    continue
                
                logger.info(f"Extracting {name}: matched with pattern='{pattern}', value={result}")
                return result
            except (ValueError, IndexError) as e:
                logger.warning(f"Found match for {name} but couldn't convert: {e}")
    
    logger.warning(f"No valid match found for {name} using any patterns, using default={default}")
    return default

def predict_crop(data):
    """Send data to prediction service and return crop recommendation"""
    try:
        response = requests.post(PREDICTION_SERVICE_URL, json=data, timeout=PREDICTION_TIMEOUT)
        response.raise_for_status()
        result = response.json()
        return result.get('crop', 'Unknown'), None
    except requests.exceptions.ConnectionError:
        error_msg = "Failed to connect to prediction service"
        logger.error(error_msg)
        return None, error_msg
    except requests.exceptions.Timeout:
        error_msg = "Prediction service timed out"
        logger.error(error_msg)
        return None, error_msg
    except requests.exceptions.HTTPError as e:
        error_msg = f"Prediction service HTTP error: {e}"
        logger.error(error_msg)
        return None, error_msg
    except Exception as e:
        error_msg = f"Prediction error: {str(e)}"
        logger.error(error_msg)
        return None, error_msg

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for the application and prediction service"""
    status = {
        'app': 'healthy',
        'prediction_service': 'unknown'
    }
    
    # Check prediction service
    try:
        response = requests.get(PREDICTION_SERVICE_URL.replace('/predict', '/health'), timeout=2)
        if response.status_code == 200:
            status['prediction_service'] = 'healthy'
        else:
            status['prediction_service'] = f'unhealthy (status code: {response.status_code})'
    except requests.exceptions.RequestException:
        status['prediction_service'] = 'unavailable'
    
    return jsonify(status)

def preprocess_image(img):
    """Enhanced preprocessing for better OCR results"""
    # Convert to grayscale
    img = img.convert('L')
    
    # Increase contrast significantly
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(3.0)  # Increased contrast for better text detection
    
    # Increase brightness slightly
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.3)  # Slightly brighter
    
    # Increase sharpness
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(2.5)  # More sharpness for clearer text
    
    # Apply thresholding to make text stand out more
    threshold = 150
    img = img.point(lambda p: p > threshold and 255)
    
    return img

@app.route('/upload-form', methods=['POST'])
def upload_form():
    """Handle form image upload and perform OCR to extract parameters"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    
    # Validate file type
    if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
        return jsonify({'error': 'Unsupported file format'}), 400
    
    try:
        # Save the uploaded image temporarily
        filename = secure_filename(image.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(filepath)
        
        # Open the image for processing
        img = Image.open(filepath)
        img = preprocess_image(img)
        
        # Try different OCR configurations to get the best result
        text = ""
        configs = [
            '--psm 6',  # Assume a single uniform block of text
            '--psm 4',  # Assume a single column of text of variable sizes
            '--psm 11 --oem 3'  # Sparse text. Find as much text as possible in no particular order
        ]
        
        for config in configs:
            temp_text = pytesseract.image_to_string(img, config=config)
            if len(temp_text) > len(text):
                text = temp_text
        
        logger.info(f"Extracted text from image: {text}")
        
        # Define patterns for each parameter
        n_patterns = [
            r'N\s*[:=\-]?\s*(\d+)', 
            r'Nitrogen\s*[:=\-]?\s*(\d+)',
            r'N\s*content\s*[:=\-]?\s*(\d+)',
            r'N\D*(\d+)',
            r'[Nn]\s*(\d+)'
        ]
        p_patterns = [
            r'P\s*[:=\-]?\s*(\d+)', 
            r'Phosphorus\s*[:=\-]?\s*(\d+)',
            r'P\s*content\s*[:=\-]?\s*(\d+)',
            r'P\D*(\d+)',
            r'[Pp]\s*(\d+)'
        ]
        k_patterns = [
            r'K\s*[:=\-]?\s*(\d+)', 
            r'Potassium\s*[:=\-]?\s*(\d+)',
            r'K\s*content\s*[:=\-]?\s*(\d+)',
            r'K\D*(\d+)',
            r'[Kk]\s*(\d+)'
        ]
        temp_patterns = [
            r'[Tt]emp(?:erature)?\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'[Tt]emp(?:erature)?\D*(\d+(?:\.\d+)?)',
            r'Temperature \(°C\)\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'T\s*[:=\-]?\s*(\d+(?:\.\d+)?)'
        ]
        humidity_patterns = [
            r'[Hh]umidity\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'[Hh]umidity\D*(\d+(?:\.\d+)?)',
            r'[Hh]\s*[:=\-]?\s*(\d+(?:\.\d+)?)'
        ]
        ph_patterns = [
            r'[Pp][Hh]\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'pH\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'pH\D*(\d+(?:\.\d+)?)'
        ]
        rainfall_patterns = [
            r'[Rr]ainfall\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'[Rr]ainfall\D*(\d+(?:\.\d+)?)',
            r'[Rr]ain\s*[:=\-]?\s*(\d+(?:\.\d+)?)'
        ]
        
        # Extract data from text
        form_data = {
            'N': extract_param(text, 'N', n_patterns, default=50, cast_type=int),
            'P': extract_param(text, 'P', p_patterns, default=50, cast_type=int),
            'K': extract_param(text, 'K', k_patterns, default=50, cast_type=int),
            'temperature': extract_param(text, 'temperature', temp_patterns, default=25.0),
            'humidity': extract_param(text, 'humidity', humidity_patterns, default=71.0),
            'ph': extract_param(text, 'ph', ph_patterns, default=6.5),
            'rainfall': extract_param(text, 'rainfall', rainfall_patterns, default=103.0),
        }
        
        logger.info(f"Extracted form data: {form_data}")
        
        # Get crop recommendation based on extracted data
        crop, error = predict_crop(form_data)
        
        # Clean up temporary file
        try:
            os.remove(filepath)
        except Exception as e:
            logger.warning(f"Could not remove temporary file {filepath}: {e}")
        
        if error:
            return jsonify({
                'error': error,
                'form_data': form_data
            }), 500
            
        return jsonify({
            'recommended_crop': crop,
            'form_data': form_data
        })
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Predict crop based on soil and environmental parameters"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    try:
        # Validate required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
            
        # Format data for prediction
        formatted_data = {
            'N': float(data['N']),
            'P': float(data['P']),
            'K': float(data['K']),
            'temperature': float(data['temperature']),
            'humidity': float(data['humidity']),
            'ph': float(data['ph']),
            'rainfall': float(data['rainfall'])
        }
        
        # Get prediction
        crop, error = predict_crop(formatted_data)
        
        if error:
            return jsonify({'error': error}), 500
            
        return jsonify({'recommended_crop': crop})
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Define crop ideal parameters
crop_parameters = {
    'Rice': {'ph_min': 5.5, 'ph_max': 6.5, 'moisture_min': 60, 'moisture_max': 100},
    'Wheat': {'ph_min': 6.0, 'ph_max': 7.5, 'moisture_min': 15, 'moisture_max': 45},
    'Corn': {'ph_min': 5.8, 'ph_max': 7.0, 'nitrogen_min': 20, 'nitrogen_max': 100},
    'Potatoes': {'ph_min': 4.8, 'ph_max': 6.5, 'potassium_min': 20, 'potassium_max': 100},
    'Tomatoes': {'ph_min': 6.0, 'ph_max': 6.8, 'phosphorus_min': 20, 'phosphorus_max': 100},
    'Lettuce': {'ph_min': 6.0, 'ph_max': 7.0, 'nitrogen_min': 15, 'nitrogen_max': 80},
    'Carrots': {'ph_min': 5.5, 'ph_max': 7.0, 'phosphorus_min': 15, 'phosphorus_max': 80},
    'Soybeans': {'ph_min': 6.0, 'ph_max': 7.0, 'potassium_min': 15, 'potassium_max': 90},
    'Cotton': {'ph_min': 5.8, 'ph_max': 8.0, 'phosphorus_min': 20, 'phosphorus_max': 90},
    'Sugarcane': {'ph_min': 5.0, 'ph_max': 8.5, 'potassium_min': 25, 'potassium_max': 100},
}

# Helper functions for recommendations
def get_sowing_time(crop):
    sowing_times = {
        "Rice": "Early spring or late summer depending on your region",
        "Wheat": "Fall for winter wheat, early spring for spring wheat",
        "Corn": "2-3 weeks after the last spring frost when soil is warm",
        "Potatoes": "Early spring, 2 weeks before the last frost date",
        "Tomatoes": "After all danger of frost has passed",
        "Lettuce": "Early spring or fall in cooler temperatures",
        "Carrots": "3 weeks before the last frost date",
        "Soybeans": "Late spring when soil temperatures reach 55-60°F",
        "Cotton": "When soil temperature is consistently above 65°F",
        "Sugarcane": "Spring planting when temperatures are consistently warm"
    }
    return sowing_times.get(crop, "Spring or early summer depending on your climate")

def get_irrigation_tips(crop, moisture):
    if crop == "Rice":
        return "Maintain flooded conditions during most growth stages"
    if crop in ["Corn", "Potatoes"]:
        return "Regular irrigation, especially during tasseling/tuber formation"
    if moisture < 30:
        return "Implement frequent irrigation scheduling with moisture sensors"
    return "Water regularly, ensuring soil stays moist but not waterlogged"

def get_pest_control_tips(crop):
    pest_tips = {
        "Rice": "Monitor for rice water weevil and rice stink bugs",
        "Wheat": "Watch for aphids, Hessian fly, and wheat stem sawfly",
        "Corn": "Scout for corn earworm, European corn borer, and rootworm",
        "Potatoes": "Prevent Colorado potato beetle and potato blight",
        "Tomatoes": "Watch for hornworms, whiteflies, and early blight",
    }
    return pest_tips.get(crop, "Implement IPM practices: regular scouting, beneficial insects, and targeted treatments only when necessary")

def get_fertilizer_tips(soil_data, crop):
    if soil_data.get('nitrogen', 0) < 20:
        return f"Apply nitrogen-rich fertilizer ({'minimal amounts' if crop == 'Legumes' else 'higher amounts'})"
    if soil_data.get('phosphorus', 0) < 20:
        return "Add phosphorus to promote root development and flowering"
    if soil_data.get('potassium', 0) < 20:
        return "Supplement with potassium for improved crop quality and disease resistance"
    return "Apply balanced fertilizer according to crop growth stage, focusing on organic options when possible"

def get_soil_treatment_suggestions(soil_data, crop):
    suggestions = []
    
    if soil_data.get('ph', 7) < 5.5:
        suggestions.append("Increase soil pH by adding agricultural lime")
    if soil_data.get('ph', 7) > 7.5:
        suggestions.append("Lower soil pH by adding sulfur or sulfur-containing amendments")
    
    if soil_data.get('organicMatter', 0) < 3:
        suggestions.append("Add compost or well-rotted manure to improve organic matter content")
    
    if soil_data.get('moisture', 0) < 20:
        suggestions.append("Improve soil structure with organic matter to increase water retention")
    if soil_data.get('moisture', 0) > 80:
        suggestions.append("Improve drainage through raised beds or drainage systems")
    
    if soil_data.get('nitrogen', 0) < 20:
        suggestions.append("Apply nitrogen fertilizer or plant leguminous cover crops")
    if soil_data.get('phosphorus', 0) < 15:
        suggestions.append("Add phosphate fertilizers or bone meal")
    if soil_data.get('potassium', 0) < 15:
        suggestions.append("Add potassium-rich amendments like wood ash or greensand")

    if not suggestions:
        suggestions = ["Conduct a comprehensive soil test for detailed treatment recommendations"]
    
    return suggestions

def analyze_soil(soil_data, crop):
    # Check if crop exists in our database
    if crop not in crop_parameters:
        return {
            "success": False,
            "message": f"Unknown crop: {crop}. Please select a supported crop."
        }
    
    # Get ideal parameters for the crop
    ideal = crop_parameters[crop]
    
    # Check soil suitability
    is_suitable = True
    
    # Check pH if available
    if 'ph' in soil_data:
        if soil_data['ph'] < ideal.get('ph_min', 0) or soil_data['ph'] > ideal.get('ph_max', 14):
            is_suitable = False
    
    # Check moisture if available
    if 'moisture' in soil_data:
        if soil_data['moisture'] < ideal.get('moisture_min', 0) or soil_data['moisture'] > ideal.get('moisture_max', 100):
            is_suitable = False
            
    # Check nitrogen if available and required
    if 'nitrogen' in soil_data and 'nitrogen_min' in ideal:
        if soil_data['nitrogen'] < ideal['nitrogen_min']:
            is_suitable = False
            
    # Check phosphorus if available and required
    if 'phosphorus' in soil_data and 'phosphorus_min' in ideal:
        if soil_data['phosphorus'] < ideal['phosphorus_min']:
            is_suitable = False
            
    # Check potassium if available and required
    if 'potassium' in soil_data and 'potassium_min' in ideal:
        if soil_data['potassium'] < ideal['potassium_min']:
            is_suitable = False
            
    # Prepare response
    if is_suitable:
        return {
            "success": True,
            "message": f"Good news! Your soil is suitable for growing {crop}.",
            "tips": {
                "sowingTime": get_sowing_time(crop),
                "irrigation": get_irrigation_tips(crop, soil_data.get('moisture', 50)),
                "pestControl": get_pest_control_tips(crop),
                "fertilizer": get_fertilizer_tips(soil_data, crop)
            }
        }
    else:
        return {
            "success": False,
            "message": f"Warning: Your soil needs treatment before planting {crop}.",
            "treatmentSuggestions": get_soil_treatment_suggestions(soil_data, crop)
        }

@app.route('/api/analyze-soil', methods=['POST'])
def analyze_soil_data():
    if request.content_type == 'application/json':
        # Handle JSON data (manual entry)
        data = request.json
        soil_data = {
            'nitrogen': float(data.get('nitrogen', 0)),
            'phosphorus': float(data.get('phosphorus', 0)),
            'potassium': float(data.get('potassium', 0)),
            'ph': float(data.get('ph', 7)),
            'moisture': float(data.get('moisture', 0)),
            'organicMatter': float(data.get('organicMatter', 0))
        }
        crop = data.get('crop', '')
        
        result = analyze_soil(soil_data, crop)
        return jsonify(result)
    
    else:
        # Handle file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        crop = request.form.get('crop', '')
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Here you would add code to process the file (OCR, image analysis, etc.)
            # For demo purposes, we'll use default values
            soil_data = {
                'nitrogen': 40,
                'phosphorus': 30,
                'potassium': 25,
                'ph': 6.5,
                'moisture': 50,
                'organicMatter': 5
            }
            
            result = analyze_soil(soil_data, crop)
            # Add file processing note
            result['note'] = f"File {filename} processed. In a production environment, we would extract soil data from your document."
            return jsonify(result)
        
        return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
