import React, { useState } from 'react';
import axios from 'axios';

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crop Recommendation System</h2>

      {/* 🔢 Input Fields */}
      {['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].map((field) => (
        <div key={field} className="mb-3">
          <label className="block text-sm text-gray-600 capitalize">{field}</label>
          <input
            type="number"
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}

      <button
        onClick={handleFormSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-3"
      >
        {loading ? 'Analyzing...' : 'Get Recommendation from Form'}
      </button>

      {/* 🖼️ Image Upload Section */}
      <div className="my-4 border-t pt-4">
        <label className="block text-sm text-gray-600 mb-1">Or Upload Filled Form Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 border rounded" />
        )}
        <button
          onClick={handleImageSubmit}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Processing...' : 'Upload Image & Predict'}
        </button>
      </div>

      {/* 📦 Result */}
      {prediction && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          Recommended Crop: <strong>{prediction}</strong>
        </div>
      )}
    </div>
  );
};

export default CropRecommendations;
