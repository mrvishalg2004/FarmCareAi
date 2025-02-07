import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CropRecommendation, SoilTest } from '../../types/database';
import { Plane as Plant, Sprout, Droplets } from 'lucide-react';

function CropRecommendations() {
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSoilTests();
    fetchRecommendations();
  }, []);

  const fetchSoilTests = async () => {
    try {
      const { data, error } = await supabase!
        .from('soil_tests')
        .select('*')
        .eq('status', 'completed');

      if (error) throw error;
      setSoilTests(data || []);
    } catch (error) {
      console.error('Error fetching soil tests:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase!
        .from('crop_recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const getRecommendation = async () => {
    setLoading(true);
    try {
      // Simulate AI recommendation based on soil test
      const mockRecommendation = {
        soil_test_id: selectedTest,
        crop_name: ['Wheat', 'Rice', 'Corn', 'Soybeans'][Math.floor(Math.random() * 4)],
        confidence_score: Math.random() * (0.99 - 0.7) + 0.7,
        expected_yield: Math.floor(Math.random() * (100 - 50) + 50),
        water_requirements: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        season: ['Spring', 'Summer', 'Fall', 'Winter'][Math.floor(Math.random() * 4)],
      };

      const { error } = await supabase!
        .from('crop_recommendations')
        .insert([mockRecommendation]);

      if (error) throw error;

      fetchRecommendations();
      setSelectedTest('');
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Crop Recommendations</h1>

      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Get New Recommendation
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Select a completed soil test to get AI-powered crop recommendations.</p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="">Select a soil test</option>
                {soilTests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.location} - {new Date(test.test_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={getRecommendation}
              disabled={!selectedTest || loading}
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {loading ? 'Analyzing...' : 'Get Recommendation'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {recommendations.map((rec) => (
            <li key={rec.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Plant className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm font-medium text-gray-900">{rec.crop_name}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {Math.round(rec.confidence_score * 100)}% Confidence
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 mr-6">
                      <Sprout className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      Expected Yield: {rec.expected_yield} tons/acre
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Droplets className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      Water Requirements: {rec.water_requirements}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Best Season: {rec.season}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CropRecommendations;