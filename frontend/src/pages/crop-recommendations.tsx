import React, { useState } from 'react';
import axios from 'axios';

interface CropFormData {
  N: string;
  P: string;
  K: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
}

const CropRecommendations = () => {
  const [formData, setFormData] = useState<CropFormData>({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate inputs
      const values = Object.values(formData);
      if (values.some(val => val === '')) {
        setPrediction('Please fill in all fields');
        return;
      }

      console.log('Sending data:', formData);
      const res = await axios.post('http://localhost:5001/predict', formData);
      console.log('Received response:', res.data);
      
      if (res.data.error) {
        setPrediction(`Error: ${res.data.error}`);
      } else if (res.data.crop) {
        setPrediction(res.data.crop);
      } else {
        setPrediction('Received invalid response from server');
      }
    } catch (error) {
      console.error('Error details:', error);
      const err = error as Error & { response?: { data?: { error?: string } } };
      setPrediction(
        err.response?.data?.error || 
        err.message || 
        'Error connecting to prediction server. Please ensure the server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crop Recommendation System</h2>
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
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Analyzing...' : 'Get Recommendation'}
      </button>

      {prediction && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          Recommended Crop: <strong>{prediction}</strong>
        </div>
      )}
    </div>
  );
};

export default CropRecommendations;