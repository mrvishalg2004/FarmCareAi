from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import pandas as pd
import numpy as np
import os
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # More permissive CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'crop_prediction_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'crop_prediction_scaler.pkl')
CSV_PATH = os.path.join(os.path.dirname(__file__), 'crop_recommendation.csv')

# Load or train the model
def get_model():
    """Load existing model or train a new one if it doesn't exist"""
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        logger.info("Loading existing crop prediction model")
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)
    else:
        logger.info("Training new crop prediction model")
        model, scaler = train_model()
        
    return model, scaler

def train_model():
    """Train a new model using the crop recommendation dataset"""
    try:
        # Load dataset
        if not os.path.exists(CSV_PATH):
            logger.error(f"Dataset not found at {CSV_PATH}")
            return create_fallback_model()
            
        df = pd.read_csv(CSV_PATH)
        logger.info(f"Loaded dataset with {len(df)} records and crops: {df['label'].unique()}")
        
        # Prepare data
        X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
        y = df['label']
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Save model and scaler
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(model, f)
        with open(SCALER_PATH, 'wb') as f:
            pickle.dump(scaler, f)
            
        logger.info("Model trained and saved successfully")
        return model, scaler
        
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        # Fallback to a simple model
        return create_fallback_model()

def create_fallback_model():
    """Create a simple fallback model in case training fails"""
    logger.warning("Creating fallback model")
    
    # Simple scaler that doesn't transform the data
    class IdentityScaler:
        def transform(self, X):
            return X
    
    # Simple model that uses rules
    class SimpleModel:
        def predict(self, X):
            predictions = []
            for sample in X:
                n, p, k = sample[0], sample[1], sample[2]
                ph = sample[5]
                
                # Special case for mungbean
                if 10 <= sample[0] <= 20 and 35 <= sample[1] <= 45 and 10 <= sample[2] <= 20:
                    predictions.append('mungbean')
                elif sample[0] > 100 and sample[1] > 100 and sample[2] > 100:
                    predictions.append('rice')
                elif sample[0] > 80 and sample[1] > 40 and sample[2] > 40:
                    predictions.append('wheat')
                elif sample[0] > 40 and sample[1] > 60 and sample[2] > 80:
                    predictions.append('cotton')
                elif sample[5] < 6:
                    predictions.append('blueberries')
                else:
                    predictions.append('maize')
            return np.array(predictions)
    
    return SimpleModel(), IdentityScaler()

# Load or train the model at startup
model, scaler = get_model()

def recommend_crop(data):
    """Predict crop using the trained model"""
    try:
        # Extract features in the correct order
        features = np.array([
            data.get('N', 0), 
            data.get('P', 0), 
            data.get('K', 0),
            data.get('temperature', 0),
            data.get('humidity', 0),
            data.get('ph', 7.0),
            data.get('rainfall', 0)
        ]).reshape(1, -1)
        
        # Scale features
        scaled_features = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        
        logger.info(f"ML model predicted: {prediction}")
        return prediction
        
    except Exception as e:
        logger.error(f"Error in ML prediction: {str(e)}")
        # Fallback to simple rule-based prediction
        return fallback_prediction(data)

def fallback_prediction(data):
    """Simple rule-based prediction as fallback"""
    logger.warning("Using fallback prediction")
    n = data.get('N', 0)
    p = data.get('P', 0)
    k = data.get('K', 0)
    ph = data.get('ph', 7.0)
    
    # Special case for mungbean
    if 10 <= n <= 20 and 35 <= p <= 45 and 10 <= k <= 20:
        return "mungbean"
    elif n > 100 and p > 100 and k > 100:
        return "rice"
    elif n > 80 and p > 40 and k > 40:
        return "wheat"
    elif n > 40 and p > 60 and k > 80:
        return "cotton"
    elif ph < 6:
        return "blueberries"
    else:
        return "maize"

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model": "loaded" if model else "unavailable"
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        logger.info(f"Received prediction request with data: {data}")
        
        # Get recommendation
        crop = recommend_crop(data)
        
        return jsonify({"crop": crop})
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the trained model"""
    try:
        if hasattr(model, 'feature_importances_'):
            features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
            importances = model.feature_importances_
            feature_importance = {features[i]: float(importances[i]) for i in range(len(features))}
            
            # Get list of crops the model can predict
            classes = model.classes_.tolist() if hasattr(model, 'classes_') else ["Unknown"]
            
            return jsonify({
                "model_type": model.__class__.__name__,
                "feature_importance": feature_importance,
                "crops": classes,
                "crop_count": len(classes)
            })
        else:
            return jsonify({
                "model_type": model.__class__.__name__,
                "info": "Limited model information available"
            })
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain_model():
    """Endpoint to manually trigger model retraining"""
    try:
        global model, scaler
        model, scaler = train_model()
        return jsonify({"status": "success", "message": "Model retrained successfully"})
    except Exception as e:
        logger.error(f"Error retraining model: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# Change to port 5002 if 5001 is blocked or in use
if __name__ == '__main__':
    port = 5002  # Change port
    logger.info(f"Starting prediction service on port {port}")
    app.run(debug=True, port=port)