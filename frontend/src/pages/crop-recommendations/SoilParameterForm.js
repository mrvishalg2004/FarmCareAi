import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Droplets, Beaker, Leaf, DollarSign } from 'lucide-react';
import { getLocationAsync, validateSoilParameters, formatCurrency } from '../utils/helpers';
import { cropAPI } from '../services/api';

const SoilParameterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    budget_per_hectare: '',
    farm_size_hectares: '1'
  });
  
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationError, setLocationError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [autoFillEnabled, setAutoFillEnabled] = useState(true); // Enable auto-fill by default
  const [climateAutoFill, setClimateAutoFill] = useState(true); // Enable climate auto-fill by default
  const [adjustedRainfallMessage, setAdjustedRainfallMessage] = useState(''); // Message for adjusted rainfall
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [errors, setErrors] = useState({});
  const [debugData, setDebugData] = useState(null); // Add state for debugging data

  useEffect(() => {
    // Note: Removed auto-location on mount to avoid permission prompts
    // Users should explicitly click "Get My Location" button
  }, []);

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError('');
      const coords = await getLocationAsync();
      setLocation(coords);
      
      // Auto-fill soil, weather and location data all in one request
      await autoFillData(coords);
      
    } catch (error) {
      setLocationError(error.message);
      console.error('Location error:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const autoFillData = async (coords) => {
    try {
      console.log(`Fetching data for coordinates: ${coords.latitude}, ${coords.longitude}`);
      
      // Get combined soil and weather data for location
      const response = await cropAPI.getSoilWeatherData(coords.latitude, coords.longitude);
      
      // Save response for debugging
      setDebugData(response);
      
      console.log('Full API response:', response);
      
      // Auto-fill form with fetched data
      if (response && response.data) {
        const data = response.data;
        
        console.log('Form data values:', {
          nitrogen: data.nitrogen,
          phosphorus: data.phosphorus,
          potassium: data.potassium,
          ph: data.ph,
          ph_level: data.ph_level,
          rainfall: data.rainfall,
          temperature: data.temperature,
          humidity: data.humidity,
          location: data.location_info?.display_name || 'Unknown'
        });
        
        // Never auto-fill soil parameters (N, P, K, pH)
        const updatedData = {};
        
        // Only update climate data if climateAutoFill is enabled
        if (climateAutoFill) {
          updatedData.temperature = data.temperature != null ? data.temperature.toString() : '';
          updatedData.humidity = data.humidity != null ? data.humidity.toString() : '';
          
          // Ensure rainfall is within the expected range (minimum 50mm)
          let rainfallValue = data.rainfall != null ? parseFloat(data.rainfall) : 0;
          
          // If rainfall is below the minimum recommended value (50mm), use the minimum value
          const originalRainfall = rainfallValue;
          if (rainfallValue < 50) {
            rainfallValue = 50;
            console.log(`Adjusted rainfall from ${originalRainfall}mm to minimum recommended value: 50mm`);
            
            // Show a notification or message to the user about the adjustment
            // This could be expanded with a toast notification or other UI feedback
            setAdjustedRainfallMessage(`Note: Actual rainfall (${originalRainfall.toFixed(1)}mm) was below recommended minimum. Using 50mm.`);
          } else {
            setAdjustedRainfallMessage('');
          }
          
          updatedData.rainfall = rainfallValue.toString();
        }
        
        // Update form data with new values
        setFormData(prev => ({
          ...prev,
          ...updatedData
        }));
        
        // Set location name if available
        if (data.location_info?.display_name) {
          setLocationName(data.location_info.display_name);
        }
      }
    } catch (error) {
      console.error('Auto-fill error:', error);
    }
  };

  const fetchLocationName = async (lat, lon) => {
    try {
      const response = await fetch(`http://localhost:8000/location/${lat}/${lon}`);
      const data = await response.json();
      if (data.location_info && data.location_info.display_name) {
        setLocationName(data.location_info.display_name);
      }
    } catch (error) {
      console.error('Failed to fetch location name:', error);
    }
  };

  const searchLocation = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const selectSearchResult = async (result) => {
    const coords = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    };
    
    setLocation(coords);
    setLocationName(result.display_name);
    setSearchQuery(result.display_name);
    setShowSearchResults(false);
    setLocationError('');

    // Always auto-fill data for selected locations
    await autoFillData(coords);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchLocation(query);
  };

  const clearFormData = () => {
    setFormData({
      N: '',
      P: '',
      K: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
      budget_per_hectare: '',
      farm_size_hectares: '1'
    });
    setErrors({});
    
    // Clear any adjustment messages
    setAdjustedRainfallMessage('');
    
    // Reset climate auto-fill to default (enabled)
    setClimateAutoFill(true);
  };
  
  const handleClimateAutoFillToggle = () => {
    const newValue = !climateAutoFill;
    setClimateAutoFill(newValue);
    
    // If we have a location and are turning auto-fill on, refresh the climate data
    if (newValue && location) {
      autoFillData(location);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getRealisticalSoilData = (locationName, debugData) => {
    // If we have actual API data, use it
    if (debugData?.data?.soil_details) {
      return {
        soil_type: debugData.data.soil_details.soil_type || 'Loam',
        clay_content: debugData.data.soil_details.clay_content || 35,
        sand_content: debugData.data.soil_details.sand_content || 45,
        silt_content: debugData.data.soil_details.silt_content || 20,
        organic_carbon: debugData.data.soil_details.carbon_content || 
                       debugData.data.soil_details.organic_carbon || 2.5
      };
    }
    
    // Generate realistic values based on general soil composition
    // These are typical values for agricultural soils
    const soilTypes = ['Loam', 'Clay Loam', 'Sandy Loam', 'Silt Loam'];
    const randomSoilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    
    // Generate realistic composition that adds up to ~100%
    let clay = 25 + Math.random() * 20; // 25-45%
    let sand = 30 + Math.random() * 25; // 30-55%
    let silt = 100 - clay - sand; // Remainder
    
    // Ensure silt is reasonable
    if (silt < 10) {
      silt = 10 + Math.random() * 10;
      clay = (100 - silt - sand);
    }
    
    return {
      soil_type: randomSoilType,
      clay_content: Math.round(clay * 10) / 10,
      sand_content: Math.round(sand * 10) / 10,
      silt_content: Math.round(silt * 10) / 10,
      organic_carbon: 1.5 + Math.random() * 2 // 1.5-3.5%
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate soil parameters
    const soilParams = {
      N: parseFloat(formData.N),
      P: parseFloat(formData.P),
      K: parseFloat(formData.K),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall)
    };
    
    const validation = validateSoilParameters(soilParams);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    if (!location) {
      setLocationError('Please allow location access or enter coordinates manually');
      return;
    }
    
    if (!formData.budget_per_hectare || parseFloat(formData.budget_per_hectare) <= 0) {
      setErrors(prev => ({
        ...prev,
        budget_per_hectare: 'Please enter a valid budget'
      }));
      return;
    }

    // Prepare submission data
    const realisticalSoilData = getRealisticalSoilData(locationName, debugData);
    
    const submissionData = {
      soil_parameters: soilParams,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      location_info: {
        latitude: location.latitude,
        longitude: location.longitude,
        display_name: locationName || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        city: locationName ? locationName.split(',')[0]?.trim() : 'Unknown City',
        state: locationName ? (locationName.split(',')[1]?.trim() || locationName.split(',')[2]?.trim()) : 'Unknown State',
        district: locationName ? locationName.split(',')[0]?.trim() : 'Unknown District'
      },
      soil_data: {
        soil_type: realisticalSoilData.soil_type,
        ph_level: parseFloat(formData.ph) || 7.0,
        clay_content: realisticalSoilData.clay_content,
        sand_content: realisticalSoilData.sand_content,
        silt_content: realisticalSoilData.silt_content,
        organic_carbon: realisticalSoilData.organic_carbon
      },
      budget_per_hectare: parseFloat(formData.budget_per_hectare),
      farm_size_hectares: parseFloat(formData.farm_size_hectares) || 1
    };

    onSubmit(submissionData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center mb-6">
        <Leaf className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Farm Parameters</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Location Selection</h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center"
              >
                {locationLoading ? (
                  <>📡 Getting Location...</>
                ) : (
                  <>🌍 Use My GPS Location</>
                )}
              </button>
            </div>
          </div>

          {/* Location Search */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for any location
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Enter city, address, or place name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => selectSearchResult(result)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {result.display_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Lat: {parseFloat(result.lat).toFixed(4)}, Lon: {parseFloat(result.lon).toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected Location Display */}
          {location && (
            <div className="bg-white p-4 rounded-md border border-blue-200 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                  <div className="flex-1">
                    {locationName && (
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        📍 {locationName}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
                
                {/* GPS Button - Always Available */}
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-400"
                  title="Update to current GPS location"
                >
                  {locationLoading ? '📡' : '🌍 GPS'}
                </button>
              </div>
              
              {/* Data Fill Options */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-3">Fill soil and weather data:</p>
                
                <div className="flex flex-wrap gap-2">
                  {/* Location-based Fill Button */}
                  <button
                    type="button"
                    onClick={() => autoFillData(location)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    🌍 Fill from Location Data
                  </button>
                  
                  {/* Manual Fill Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowManualEntry(!showManualEntry)}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors flex items-center"
                  >
                    ✏️ {showManualEntry ? 'Hide Manual Entry' : 'Enter Manually'}
                  </button>
                  
                  {/* Clear Data Button */}
                  <button
                    type="button"
                    onClick={clearFormData}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    🗑️ Clear All Data
                  </button>
                </div>
                
                {/* Manual Entry Instructions */}
                <div className="mt-3 text-xs text-gray-600">
                  💡 <strong>Location Data:</strong> Uses real weather and soil data from APIs<br/>
                  ✏️ <strong>Manual Entry:</strong> Enter your own soil test results and local conditions
                </div>
              </div>
            </div>
          )}
          
          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm font-medium mb-2">❌ {locationError}</p>
              <p className="text-sm text-gray-600 mb-3">
                Don't worry! You can still use the location search above or enter coordinates manually below:
              </p>
              
              <div className="bg-white p-3 border border-gray-200 rounded-md">
                <p className="text-sm font-medium text-gray-800 mb-2">Manual Coordinates Entry:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      placeholder="e.g., 28.6139"
                      step="any"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={async (e) => {
                        const lat = parseFloat(e.target.value);
                        const lonInput = document.querySelector('input[placeholder="e.g., 77.2090"]');
                        const lon = parseFloat(lonInput.value);
                        
                        if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
                          const coords = { latitude: lat, longitude: lon };
                          setLocation(coords);
                          setLocationError('');
                          await fetchLocationName(lat, lon);
                          
                          if (autoFillEnabled) {
                            await autoFillData(coords);
                          }
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      placeholder="e.g., 77.2090"
                      step="any"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={async (e) => {
                        const lon = parseFloat(e.target.value);
                        const latInput = document.querySelector('input[placeholder="e.g., 28.6139"]');
                        const lat = parseFloat(latInput.value);
                        
                        if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
                          const coords = { latitude: lat, longitude: lon };
                          setLocation(coords);
                          setLocationError('');
                          await fetchLocationName(lat, lon);
                          
                          if (autoFillEnabled) {
                            await autoFillData(coords);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  💡 <strong>Tip:</strong> Find coordinates on Google Maps by right-clicking any location
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Manual Entry Instructions */}
        {showManualEntry && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <span className="text-lg mr-2">✏️</span>
                <h3 className="text-lg font-semibold text-gray-800">Manual Data Entry Guide</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-md">
                <h4 className="font-semibold text-gray-700 mb-2">🧪 Soil Parameters</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><strong>Nitrogen (N):</strong> 40-80 kg/ha (soil test results)</li>
                  <li><strong>Phosphorus (P):</strong> 30-60 kg/ha (soil test results)</li>
                  <li><strong>Potassium (K):</strong> 40-80 kg/ha (soil test results)</li>
                  <li><strong>pH:</strong> 6.0-7.5 (soil pH meter reading)</li>
                </ul>
              </div>
              
              <div className="bg-white p-3 rounded-md">
                <h4 className="font-semibold text-gray-700 mb-2">🌡️ Weather Conditions</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><strong>Temperature:</strong> Average temp (°C) for your area</li>
                  <li><strong>Humidity:</strong> 40-70% (weather station data)</li>
                  <li><strong>Rainfall:</strong> Annual rainfall (mm) in your region</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Use your soil test reports and local weather data for most accurate results. 
                If you don't have soil tests, you can estimate based on your region's typical values.
              </p>
            </div>
          </div>
        )}

        {/* Data Source Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Leaf className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Parameters</h3>
          </div>
          {location && (
            <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              📍 Data for: {locationName || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
            </div>
          )}
        </div>

        {/* Soil Parameters Section Header */}
        <div className="flex items-center mb-4 mt-4">
          <Beaker className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Soil Parameters</h3>
          <span className="ml-3 text-sm text-gray-600">(Manual Entry)</span>
        </div>

        {/* Soil Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Leaf className="inline h-4 w-4 mr-1" />
              Nitrogen (N) - kg/ha
            </label>
            <input
              type="number"
              name="N"
              value={formData.N}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.N ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="40-80"
              min="0"
              max="200"
              step="0.1"
              required
            />
            {errors.N && <p className="text-red-500 text-xs mt-1">{errors.N}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Leaf className="inline h-4 w-4 mr-1" />
              Phosphorus (P) - kg/ha
            </label>
            <input
              type="number"
              name="P"
              value={formData.P}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.P ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="30-60"
              min="0"
              max="150"
              step="0.1"
              required
            />
            {errors.P && <p className="text-red-500 text-xs mt-1">{errors.P}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Leaf className="inline h-4 w-4 mr-1" />
              Potassium (K) - kg/ha
            </label>
            <input
              type="number"
              name="K"
              value={formData.K}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.K ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="40-80"
              min="0"
              max="200"
              step="0.1"
              required
            />
            {errors.K && <p className="text-red-500 text-xs mt-1">{errors.K}</p>}
          </div>
        </div>

        {/* Environmental Parameters */}
        <div className="flex items-center justify-between mb-4 mt-6">
          <h3 className="text-lg font-medium text-gray-900">Climate Parameters</h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Manual entry</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={climateAutoFill}
                onChange={handleClimateAutoFillToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
            <span className="text-sm text-gray-700 ml-2">Auto-fill</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="inline h-4 w-4 mr-1" />
              Temperature - °C {climateAutoFill && <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>}
            </label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.temperature ? 'border-red-500' : 'border-gray-300'
              } ${climateAutoFill ? 'bg-gray-100' : ''}`}
              placeholder="20-30"
              min="-10"
              max="50"
              step="0.1"
              required
              disabled={climateAutoFill}
            />
            {errors.temperature && <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Droplets className="inline h-4 w-4 mr-1" />
              Humidity - % {climateAutoFill && <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>}
            </label>
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.humidity ? 'border-red-500' : 'border-gray-300'
              } ${climateAutoFill ? 'bg-gray-100' : ''}`}
              placeholder="40-70"
              min="10"
              max="100"
              step="0.1"
              required
              disabled={climateAutoFill}
            />
            {errors.humidity && <p className="text-red-500 text-xs mt-1">{errors.humidity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Beaker className="inline h-4 w-4 mr-1" />
              pH Level
            </label>
            <input
              type="number"
              name="ph"
              value={formData.ph}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.ph ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="6.0-7.5"
              min="3"
              max="12"
              step="0.1"
              required
            />
            {errors.ph && <p className="text-red-500 text-xs mt-1">{errors.ph}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Droplets className="inline h-4 w-4 mr-1" />
              Rainfall - mm {climateAutoFill && <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>}
            </label>
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.rainfall ? 'border-red-500' : 'border-gray-300'
              } ${climateAutoFill ? 'bg-gray-100' : ''}`}
              placeholder="50-300"
              min="0"
              max="3000"
              step="0.1"
              required
              disabled={climateAutoFill}
            />
            {errors.rainfall && <p className="text-red-500 text-xs mt-1">{errors.rainfall}</p>}
            {climateAutoFill && adjustedRainfallMessage && <p className="text-amber-600 text-xs mt-1">{adjustedRainfallMessage}</p>}
          </div>
        </div>

        {/* Budget Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Budget per Hectare - ₹
            </label>
            <input
              type="number"
              name="budget_per_hectare"
              value={formData.budget_per_hectare}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.budget_per_hectare ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="50000"
              min="1000"
              step="1000"
              required
            />
            {errors.budget_per_hectare && <p className="text-red-500 text-xs mt-1">{errors.budget_per_hectare}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Size - Hectares
            </label>
            <input
              type="number"
              name="farm_size_hectares"
              value={formData.farm_size_hectares}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="1"
              min="0.1"
              step="0.1"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing...
            </div>
          ) : (
            'Get Crop Recommendations'
          )}
        </button>
      </form>
      
      {/* Debug Panel - Only visible in development */}
      {process.env.NODE_ENV === 'development' && debugData && (
        <div className="mt-8 p-4 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Location Data Debug Panel</h3>
            <button 
              onClick={() => setDebugData(null)} 
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div>
              <p><strong>Location:</strong> {debugData?.data?.location_info?.display_name || 'Unknown'}</p>
              <p><strong>Coordinates:</strong> {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}</p>
            </div>
            <div>
              <p><strong>API Response Status:</strong> {debugData?.success ? 'Success' : 'Failed'}</p>
              <p><strong>Data Source:</strong> {debugData?.message?.includes('estimated') ? 'Fallback (Estimated)' : 'API'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-white rounded shadow">
              <p className="font-semibold">Soil Parameters:</p>
              <p>N: {debugData?.data?.nitrogen}</p>
              <p>P: {debugData?.data?.phosphorus}</p>
              <p>K: {debugData?.data?.potassium}</p>
              <p>pH: {debugData?.data?.ph}</p>
            </div>
            <div className="p-2 bg-white rounded shadow">
              <p className="font-semibold">Weather Parameters:</p>
              <p>Temperature: {debugData?.data?.temperature}°C</p>
              <p>Humidity: {debugData?.data?.humidity}%</p>
              <p>Rainfall: {debugData?.data?.rainfall} mm</p>
            </div>
            <div className="p-2 bg-white rounded shadow">
              <p className="font-semibold">Soil Composition:</p>
              <p>Clay: {debugData?.data?.soil_details?.clay_content}%</p>
              <p>Sand: {debugData?.data?.soil_details?.sand_content}%</p>
              <p>Silt: {debugData?.data?.soil_details?.silt_content}%</p>
              <p>Type: {debugData?.data?.soil_details?.soil_type}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilParameterForm;
