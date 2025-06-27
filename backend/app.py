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

# Helper to extract values using regex
def extract_param(text, name, patterns, default=0, cast_type=float):
    """Extract parameters using multiple pattern options"""
    # Try each pattern until we find a match
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                value = match.group(1).strip()
                # Remove any non-numeric characters except decimal point
                value = re.sub(r'[^\d.]', '', value)
                result = cast_type(value)
                logger.info(f"Extracting {name}: matched with pattern='{pattern}', value={result}")
                return result
            except (ValueError, IndexError) as e:
                logger.warning(f"Found match for {name} but couldn't convert: {e}")
    
    logger.warning(f"No match found for {name} using any patterns")
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
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.5)
    
    # Increase brightness slightly
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.2)
    
    # Increase sharpness
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(2.0)
    
    # Optional: You can add thresholding here if needed
    # threshold = 200
    # img = img.point(lambda p: p > threshold and 255)
    
    return img

@app.route('/upload-form', methods=['POST'])
def upload_form():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    
    # Validate file type
    if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
        return jsonify({'error': 'Unsupported file format'}), 400
    
    try:
        img = Image.open(image)
        img = preprocess_image(img)
        
        # Try different OCR configurations
        config = '--psm 6'  # Assume a single uniform block of text
        text = pytesseract.image_to_string(img, config=config)
        logger.info(f"Extracted text from image: {text}")
        
        # Define multiple patterns for each parameter
        n_patterns = [
            r'N\s*[:=\-]?\s*(\d+)',
            r'Nitrogen\s*[:=\-]?\s*(\d+)',
            r'N\s*content\s*[:=\-]?\s*(\d+)',
            r'N\D*(\d+)'
        ]
        
        p_patterns = [
            r'P\s*[:=\-]?\s*(\d+)',
            r'Phosphorus\s*[:=\-]?\s*(\d+)',
            r'P\s*content\s*[:=\-]?\s*(\d+)',
            r'P\D*(\d+)'
        ]
        
        k_patterns = [
            r'K\s*[:=\-]?\s*(\d+)',
            r'Potassium\s*[:=\-]?\s*(\d+)',
            r'K\s*content\s*[:=\-]?\s*(\d+)',
            r'K\D*(\d+)'
        ]
        
        temp_patterns = [
            r'[Tt]emp(?:erature)?\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'[Tt]emp(?:erature)?\D*(\d+(?:\.\d+)?)',
            r'Temperature \(°C\)\s*[:=\-]?\s*(\d+(?:\.\d+)?)'
        ]
        
        humidity_patterns = [
            r'[Hh]umidity\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'[Hh]umidity\D*(\d+(?:\.\d+)?)',
            r'Humidity \(%\)\s*[:=\-]?\s*(\d+(?:\.\d+)?)'
        ]
        
        ph_patterns = [
            r'[pP][hH]\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'[pP][hH]\D*(\d+(?:\.\d+)?)',
            r'pH value\s*[:=\-]?\s*(\d+(?:\.\d+)?)'
        ]
        
        rainfall_patterns = [
            r'[Rr]ainfall\s*[:=\-]?\s*(\d+(?:\.\d+)?)',
            r'[Rr]ainfall\D*(\d+(?:\.\d+)?)',
            r'Rainfall \(mm\)\s*[:=\-]?\s*(\d+(?:\.\d+)?)'
        ]
        
        # Extract values using multiple patterns
        data = {
            'N': extract_param(text, 'N', n_patterns, 0, int),
            'P': extract_param(text, 'P', p_patterns, 0, int),
            'K': extract_param(text, 'K', k_patterns, 0, int),
            'temperature': extract_param(text, 'Temperature', temp_patterns, 0),
            'humidity': extract_param(text, 'Humidity', humidity_patterns, 0),
            'ph': extract_param(text, 'pH', ph_patterns, 0),
            'rainfall': extract_param(text, 'Rainfall', rainfall_patterns, 0),
        }
        
        # Check if all values are 0, which might indicate OCR failure
        all_zeros = all(value == 0 for value in data.values())
        if all_zeros:
            logger.warning("All extracted values are 0. OCR may have failed to extract data.")
            return jsonify({
                'error': 'Could not extract values from image. Please check image quality or enter values manually.',
                'form_data': data,
                'recommended_crop': 'Unable to predict'
            }), 400
        
        # Get crop prediction
        crop, error = predict_crop(data)
        
        response = {
            'form_data': data,
        }
        
        if error:
            response['error'] = error
            response['recommended_crop'] = "Unable to predict crop"
            return jsonify(response), 200
        else:
            response['recommended_crop'] = crop
            
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Endpoint to directly predict crop without OCR"""
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return '', 204
        
    # For actual POST requests
    try:
        # Get data from JSON request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Validate required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Get crop prediction
        crop, error = predict_crop(data)
        
        if error:
            return jsonify({
                'error': error,
                'recommended_crop': "Unable to predict crop"
            }), 200
        else:
            return jsonify({
                'recommended_crop': crop
            })
            
    except Exception as e:
        logger.error(f"Error predicting crop: {str(e)}")
        return jsonify({'error': f'Error predicting crop: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
