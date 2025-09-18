#!/bin/bash

# Model Setup Script for Plant Disease Detection
# This script helps set up the PyTorch model file

echo "🌱 Plant Disease Detection Model Setup"
echo "======================================"

MODEL_FILE="plant_disease_model_final.pth"
BACKEND_DIR="/Users/abhijeetgolhar/Documents/Project/New for dum/FarmCareAi/backend"
MODELS_DIR="$BACKEND_DIR/models"

echo "Looking for model file: $MODEL_FILE"

# Create models directory if it doesn't exist
if [ ! -d "$MODELS_DIR" ]; then
    echo "Creating models directory..."
    mkdir -p "$MODELS_DIR"
fi

# Check if model file exists in current directory
if [ -f "$MODEL_FILE" ]; then
    echo "✅ Found $MODEL_FILE in current directory"
    echo "Moving to $MODELS_DIR/"
    mv "$MODEL_FILE" "$MODELS_DIR/"
    echo "✅ Model file moved successfully!"
elif [ -f "$BACKEND_DIR/$MODEL_FILE" ]; then
    echo "✅ Model file already in backend directory"
elif [ -f "$MODELS_DIR/$MODEL_FILE" ]; then
    echo "✅ Model file already in models directory"
else
    echo "❌ Model file '$MODEL_FILE' not found!"
    echo ""
    echo "Please do one of the following:"
    echo "1. Copy your '$MODEL_FILE' to: $BACKEND_DIR/"
    echo "2. Copy your '$MODEL_FILE' to: $MODELS_DIR/"
    echo "3. Place the file in the same directory as this script and run again"
    echo ""
    echo "The model file should be a PyTorch .pth file trained for plant disease detection."
    exit 1
fi

echo ""
echo "🔧 Model file location confirmed!"
echo "📍 Expected path: $MODELS_DIR/$MODEL_FILE"
echo ""
echo "✅ Setup complete! Your plant disease detection model is ready to use."
echo ""
echo "Next steps:"
echo "1. Start the backend server: cd backend && python app.py"
echo "2. The model will be automatically loaded when disease detection is used"
echo "3. Upload plant images through the frontend to test the model"
