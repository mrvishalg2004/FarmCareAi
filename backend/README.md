# Backend - FarmCare AI

This directory contains all server-side code and backend functionality for the FarmCare AI application.

## Structure

- `app.py` - Main Flask application server
- `crop_model.pkl` - Pre-trained machine learning model for crop recommendations
- `train.py` - Script for training/retraining the ML model
- `Crop_recommendation.csv` - Dataset used for training the crop recommendation model
- `requirements.txt` - Python dependencies
- `__pycache__/` - Python compiled bytecode files

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   python app.py
   ```

The backend server will start on `http://127.0.0.1:5000`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /predict` - Crop recommendation prediction

## Files Description

### Core Files
- **app.py**: Main Flask application containing API routes and server configuration
- **crop_model.pkl**: Serialized machine learning model for crop predictions
- **requirements.txt**: List of Python package dependencies

### Data & Training
- **Crop_recommendation.csv**: Training dataset with soil and weather parameters
- **train.py**: Script to train and save the crop recommendation model

### Cache
- **__pycache__/**: Automatically generated Python bytecode cache files
