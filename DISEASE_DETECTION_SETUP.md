# Plant Disease Detection Setup Guide

## 🌱 Overview
This guide helps you integrate your trained PyTorch model (`plant_disease_model_final.pth`) into the FarmCare AI disease detection system for accurate plant disease identification.

## 📋 Prerequisites
- Python 3.8 or higher
- Your trained model file: `plant_disease_model_final.pth`
- PyTorch and related dependencies

## 🚀 Quick Setup

### Step 1: Place Your Model File
Copy your `plant_disease_model_final.pth` file to one of these locations:
```
backend/plant_disease_model_final.pth
backend/models/plant_disease_model_final.pth
```

### Step 2: Install Dependencies
```bash
cd backend
pip install torch torchvision
pip install -r requirements.txt
```

### Step 3: Test the Model
```bash
cd backend
python test_model.py
```

### Step 4: Start the Backend Server
```bash
cd backend
python app.py
```

## 🏗️ Model Architecture
The system expects a PyTorch model with the following characteristics:
- **Architecture**: ResNet-18 based
- **Input Size**: 224x224 RGB images
- **Output**: 38 classes (plant disease categories)
- **Format**: PyTorch state dict (.pth file)

## 📊 Supported Disease Classes
The system recognizes 38 plant disease categories including:
- Apple diseases (scab, black rot, cedar rust, healthy)
- Tomato diseases (early blight, late blight, leaf mold, etc.)
- Corn, potato, grape, and other crop diseases

## 🔧 Model Loading Details
The system can handle different checkpoint formats:
```python
# Format 1: Direct state dict
torch.save(model.state_dict(), 'model.pth')

# Format 2: Checkpoint with state dict
torch.save({'model_state_dict': model.state_dict()}, 'model.pth')

# Format 3: Full checkpoint
torch.save({
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'epoch': epoch,
    'loss': loss
}, 'model.pth')
```

## 🖼️ Image Preprocessing
Images are automatically preprocessed with:
- Resize to 224x224 pixels
- Convert to RGB format
- Normalize with ImageNet statistics
- Convert to PyTorch tensor

## 🌐 API Endpoints

### Analyze Disease
```http
POST /api/disease-detection/analyze
Content-Type: multipart/form-data

Form data:
- image: Plant leaf image file (JPG, PNG, etc.)
```

Response:
```json
{
  "disease": "Tomato___Late_blight",
  "confidence": 0.87,
  "severity": "High",
  "treatment": [
    "Remove affected leaves immediately",
    "Apply copper-based fungicide",
    "Improve air circulation around plants"
  ],
  "prevention": [
    "Plant resistant varieties",
    "Ensure proper spacing between plants",
    "Water at soil level, not on leaves"
  ]
}
```

### Health Check
```http
GET /api/disease-detection/health
```

### Get Supported Diseases
```http
GET /api/disease-detection/diseases
```

## 🧪 Testing Your Model

### Test with Sample Image
```python
from disease_detection_module import DiseaseDetector
from PIL import Image

# Initialize detector
detector = DiseaseDetector()

# Load and predict
image = Image.open('leaf_image.jpg')
result = detector.predict(image)

print(f"Disease: {result['disease']}")
print(f"Confidence: {result['confidence']:.3f}")
```

### Verify Model Loading
```bash
cd backend
python test_model.py
```

Expected output:
```
✅ Model loaded successfully!
📍 Model path: /path/to/plant_disease_model_final.pth
🖥️  Device: cpu (or cuda if available)
📊 Number of classes: 38
```

## 🔍 Troubleshooting

### Model Not Found
```
❌ Model file 'plant_disease_model_final.pth' not found
```
**Solution**: Place the model file in `backend/` or `backend/models/` directory

### Import Error
```
❌ Import "torch" could not be resolved
```
**Solution**: Install PyTorch
```bash
pip install torch torchvision
```

### Wrong Model Format
```
❌ Failed to load PyTorch model: ...
```
**Solutions**:
1. Ensure the file is a valid PyTorch model (.pth)
2. Check that the model has 38 output classes
3. Verify the model was saved properly

### CUDA Issues
```
❌ CUDA error or GPU not available
```
**Solution**: The system automatically falls back to CPU if CUDA is not available

## 📈 Performance Tips

### For Better Accuracy
1. Ensure input images are clear and well-lit
2. Focus on the affected leaf areas
3. Use images with proper resolution (at least 224x224)
4. Avoid blurry or low-quality images

### For Better Speed
1. Use GPU if available (CUDA)
2. Process images in batches for multiple predictions
3. Optimize image preprocessing

## 🔄 Model Updates
To update your model:
1. Replace the `.pth` file with your new model
2. Restart the backend server
3. Test with `python test_model.py`

## 📝 Frontend Integration
The disease detection is integrated into the dashboard at:
```
http://localhost:5173/dashboard/disease-detection
```

Features:
- Drag & drop image upload
- Real-time prediction results
- Treatment recommendations
- Prevention tips
- Confidence scores

## 🆘 Support
If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure the model file is in the correct location
4. Test with the provided test script

## 📚 Technical Details
- **Framework**: PyTorch
- **Backend**: Flask
- **Frontend**: React + TypeScript
- **Image Processing**: PIL, torchvision transforms
- **Model Architecture**: ResNet-18 based classifier
