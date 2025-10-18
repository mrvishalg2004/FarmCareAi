/**
 * API Service for Crop Recommendations and Soil Analysis
 */
import { fetchWithFallback } from '../../lib/mockApi';

// Set the correct backend URL based on the environment
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001';

/**
 * API client for crop recommendations
 */
export const cropAPI = {
  /**
   * Check if the backend API is healthy
   */
  async healthCheck() {
    try {
      const response = await fetchWithFallback(`${API_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  /**
   * Get crop recommendations based on soil parameters
   */
  async getRecommendations(data) {
    try {
      const response = await fetchWithFallback(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      throw error;
    }
  },

  /**
   * Get soil and weather data for a specific location
   */
  async getSoilWeatherData(latitude, longitude) {
    try {
      // Currently using mock data since the actual backend endpoint
      // isn't available. Replace with actual API call when ready.
      return {
        soil: {
          nitrogen: 40,
          phosphorus: 30,
          potassium: 20,
          ph: 6.5,
          temperature: 25,
          humidity: 60,
          rainfall: 120,
        },
        weather: {
          current: {
            temp: 28,
            humidity: 65,
            description: 'Partly cloudy',
            icon: '04d',
          },
          forecast: [
            { day: 'Today', high: 28, low: 20, icon: '04d' },
            { day: 'Tomorrow', high: 30, low: 22, icon: '01d' },
            { day: 'Day 3', high: 29, low: 21, icon: '02d' },
          ]
        }
      };
    } catch (error) {
      console.error('Failed to get soil and weather data:', error);
      throw error;
    }
  }
};