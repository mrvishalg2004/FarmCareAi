from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load trained model (use RandomForest/XGBoost saved with joblib)
model = joblib.load("crop_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    try:
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
        return jsonify({'crop': 'Error predicting crop.'}), 500


if __name__ == '__main__':
    app.run(debug=True)
