import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CropRecommendations = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      // Convert string values to numbers for the API
      const apiData = {
        N: parseInt(formData.N) || 0,
        P: parseInt(formData.P) || 0,
        K: parseInt(formData.K) || 0,
        temperature: parseFloat(formData.temperature) || 0,
        humidity: parseFloat(formData.humidity) || 0,
        ph: parseFloat(formData.ph) || 0,
        rainfall: parseFloat(formData.rainfall) || 0,
      };
      
      console.log("Connecting to API...");
      // Try connecting to the Flask app first
      const healthCheck = await axios.get('http://localhost:5001/health');
      console.log("Health check response:", healthCheck.data);
      
      console.log("Sending data to API:", apiData);
      const res = await axios.post('http://localhost:5001/predict', apiData);
      console.log("Response received:", res.data);
      
      if (res.data.error) {
        setPrediction(`Error: ${res.data.error}`);
      } else {
        setPrediction(res.data.recommended_crop || "No prediction returned");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      // Show more detailed error info
      if (err.response) {
        // The request was made and the server responded with a non-2xx status
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        setPrediction(`Server error: ${err.response.status}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received");
        setPrediction("Network error: Service unavailable");
      } else {
        // Something happened in setting up the request
        setPrediction(`Error: ${err.message}`);
      }
    }
    setLoading(false);
  };

  const handleImageSubmit = async () => {
    if (!image) return alert("Please select an image first.");
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image', image);

      const res = await axios.post('http://localhost:5001/upload-form', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPrediction(res.data.recommended_crop || 'No crop predicted');
      setFormData(res.data.form_data); // update fields if needed
    } catch (err) {
      console.error(err);
      setPrediction('Error reading image.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2">Crop Recommendation System</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter soil parameters and environmental conditions to get AI-powered crop recommendations
            for optimal yield and sustainability.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Enter Soil Parameters
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'N', label: 'Nitrogen (N)', unit: 'kg/ha', tip: 'Soil nitrogen content' },
                  { name: 'P', label: 'Phosphorus (P)', unit: 'kg/ha', tip: 'Soil phosphorus content' },
                  { name: 'K', label: 'Potassium (K)', unit: 'kg/ha', tip: 'Soil potassium content' },
                  { name: 'temperature', label: 'Temperature', unit: '°C', tip: 'Average temperature' },
                  { name: 'humidity', label: 'Humidity', unit: '%', tip: 'Average humidity' },
                  { name: 'ph', label: 'pH Level', unit: 'pH', tip: 'Soil pH level (0-14)' },
                  { name: 'rainfall', label: 'Rainfall', unit: 'mm', tip: 'Annual rainfall' }
                ].map((field) => (
                  <div key={field.name} className="mb-3 group">
                    <label className="block text-sm text-gray-700 font-medium mb-1 flex justify-between">
                      {field.label}
                      <span className="text-xs text-gray-500">{field.unit}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder={`Enter ${field.label}`}
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-0 bg-gray-800 text-white text-xs rounded p-2 transition-opacity duration-200 pointer-events-none">
                        {field.tip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleFormSubmit}
                disabled={loading}
                className={`w-full mt-6 py-3 rounded-lg text-white font-medium flex items-center justify-center transition-all ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get Crop Recommendation
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Form Image
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {imagePreview ? (
                  <div className="w-full">
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                    <p className="text-sm text-gray-500 text-center mt-2">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-700 font-medium">Drag & Drop an image here or click to browse</p>
                    <p className="text-sm text-gray-500 mt-1">Upload a filled form image for automatic analysis</p>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleImageSubmit}
                disabled={!image || loading}
                className={`w-full mt-6 py-3 rounded-lg text-white font-medium flex items-center justify-center transition-all ${
                  !image || loading
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze Image
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-700 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recommendation Results
              </h2>
            </div>
            
            <div className="p-8 flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mr-6 mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 22v-7.5M3 14.5v-4M3 10.5v-5M3 5.5v-3M8.5 5h-3M8.5 3v4M14.5 3v4M14.5 5h-3M20.5 3v16h-16v2h18V3h-2z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Recommended Crop</h3>
                <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                  {prediction}
                </div>
                
                <p className="text-gray-600 mt-3">
                  Based on the soil parameters and environmental conditions you provided, our AI model 
                  recommends this crop for optimal growth and yield.
                </p>
                
                <div className="mt-4 text-sm text-gray-500">
                  Note: Always consult with local agricultural experts for additional guidance specific to your region.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendations;
