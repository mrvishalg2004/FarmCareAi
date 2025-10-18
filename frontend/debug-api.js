// This file can help you debug fetch and API issues
// Copy this into your browser console at http://localhost:5173

// Track all fetch requests
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
  console.log('🌐 Fetch request:', { url, options });
  try {
    const response = await originalFetch(url, options);
    console.log(`✅ Fetch response for ${url}:`, response.status, response.statusText);
    return response;
  } catch (error) {
    console.error(`❌ Fetch error for ${url}:`, error);
    throw error;
  }
};

// Test the API connectivity
async function testBackendApi() {
  try {
    console.log('Testing backend API connection...');
    const response = await fetch('http://127.0.0.1:5001/health');
    const data = await response.json();
    console.log('Backend API health check result:', data);
    return data;
  } catch (error) {
    console.error('Backend API connectivity test failed:', error);
    return { error: error.message };
  }
}

// Test CORS configuration
async function testCorsConfig() {
  const urls = [
    'http://127.0.0.1:5001/health',
    'http://localhost:5001/health'
  ];
  
  console.log('Testing CORS configuration with different URLs...');
  
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173'
        }
      });
      
      console.log(`CORS test for ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        corsHeaders: {
          'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
          'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
          'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Response data for ${url}:`, data);
      }
    } catch (error) {
      console.error(`CORS test failed for ${url}:`, error);
    }
  }
}

// Test the prediction endpoint with sample data
async function testPredictionEndpoint() {
  const sampleData = {
    "nitrogen": 40,
    "phosphorus": 30,
    "potassium": 35,
    "temperature": 25,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
  };
  
  try {
    console.log('Testing prediction endpoint with sample data...');
    const response = await fetch('http://127.0.0.1:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Prediction result:', data);
      return data;
    } else {
      console.error('Prediction request failed:', response.status, response.statusText);
      return { error: `${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    console.error('Prediction test failed:', error);
    return { error: error.message };
  }
}

// Run the tests
console.log('🔍 Starting API connectivity tests...');
testBackendApi()
  .then(() => testCorsConfig())
  .then(() => testPredictionEndpoint())
  .then(() => console.log('✅ All tests completed'));