from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load trained model (use RandomForest/XGBoost saved with joblib)
try:
    model_path = "crop_model.pkl"
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print("✅ Model loaded successfully!")
    else:
        print("❌ Model file not found!")
        model = None
except Exception as e:
    print(f"❌ Error loading model: {str(e)}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
            
        data = request.json
        print("✅ Received Data:", data)

        features = [[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall']),
        ]]
        print("📊 Features:", features)

        crop = model.predict(features)[0]
        print("🌾 Predicted Crop:", crop)

        return jsonify({'crop': crop})
    
    except Exception as e:
        print("❌ Error in /predict:", str(e))
        return jsonify({'error': 'Error predicting crop.'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    app.run(debug=True, port=5001)
