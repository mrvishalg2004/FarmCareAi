
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

  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/predict', formData);
      setPrediction(res.data.crop);
    } catch (err) {
      console.error(err);
      setPrediction('Error predicting crop.');
    }
    setLoading(false);
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
