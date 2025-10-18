/**
 * Mock API Service Wrapper
 * 
 * Provides fallbacks for API endpoints when running in demo mode or when API calls fail
 */

// Helper function to determine if we're in demo mode
const isDemoMode = () => {
  return import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') || 
         !import.meta.env.VITE_SUPABASE_URL;
};

// Helper function to handle API fetch with fallbacks
export const fetchWithFallback = async (url: string, options?: RequestInit) => {
  try {
    // If in demo mode, don't even attempt to make the real API call
    if (isDemoMode()) {
      console.log(`Demo mode detected - using mock data for ${url}`);
      return getMockResponse(url, options);
    }
    
    // Try the real API call
    const response = await fetch(url, options);
    
    // If successful, return the response
    if (response.ok) {
      return response;
    }
    
    // If API call fails, fall back to mock data
    console.warn(`API call to ${url} failed with status ${response.status}, using fallback data`);
    return getMockResponse(url, options);
  } catch (error) {
    // Network errors (can't reach API)
    console.error(`Failed to fetch ${url}:`, error);
    return getMockResponse(url, options);
  }
};

// Function to generate mock responses for different endpoints
const getMockResponse = (url: string, options?: RequestInit) => {
  // Parse the URL to determine what endpoint was called
  const endpoint = new URL(url).pathname;
  
  // Get the mock data based on the endpoint
  const mockData = getMockDataForEndpoint(endpoint, options);
  
  // Create a mock Response object
  return new Response(JSON.stringify(mockData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Get mock data for different endpoints
const getMockDataForEndpoint = (endpoint: string, options?: RequestInit) => {
  // Health check endpoint
  if (endpoint.includes('/health')) {
    return { 
      status: 'ok', 
      message: 'Mock API is healthy',
      version: '1.0.0-demo'
    };
  }
  
  // Predict endpoint for crop recommendations
  if (endpoint.includes('/predict')) {
    return {
      success: true,
      recommendations: [
        {
          crop: 'rice',
          suitability: 0.92,
          details: {
            growth_period: '120 days',
            water_requirement: 'High',
            temperature_range: '20-30°C',
            soil_type: 'Clay or loamy soil'
          },
          market_data: {
            price_per_kg: 20,
            demand: 'High',
            profit_potential: 'Moderate'
          }
        },
        {
          crop: 'maize',
          suitability: 0.85,
          details: {
            growth_period: '90-120 days',
            water_requirement: 'Medium',
            temperature_range: '18-32°C',
            soil_type: 'Well-drained loamy soil'
          },
          market_data: {
            price_per_kg: 15,
            demand: 'Medium',
            profit_potential: 'Good'
          }
        },
        {
          crop: 'wheat',
          suitability: 0.78,
          details: {
            growth_period: '100-130 days',
            water_requirement: 'Low to medium',
            temperature_range: '15-24°C',
            soil_type: 'Loamy soil'
          },
          market_data: {
            price_per_kg: 18,
            demand: 'High',
            profit_potential: 'Moderate'
          }
        }
      ],
      input_data: options?.body ? JSON.parse(options.body as string) : {},
      message: 'Mock data from demo mode'
    };
  }
  
  // Default response for unknown endpoints
  return {
    success: false,
    message: 'Endpoint not found in mock API',
    endpoint
  };
};

// Export a mock API client with the same interface as the real API
export const mockApiClient = {
  async fetch(url: string, options?: RequestInit) {
    return fetchWithFallback(url, options);
  },
  
  async post(url: string, data: any) {
    return fetchWithFallback(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  
  async get(url: string) {
    return fetchWithFallback(url);
  }
};

export default mockApiClient;