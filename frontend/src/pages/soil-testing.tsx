import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiPlantRoots } from 'react-icons/gi';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { SoilTest } from '../types/database';
import { MapPin, Beaker, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

function SoilTesting() {
  const [location, setLocation] = useState('');
  const [fieldSize, setFieldSize] = useState('');
  const [testType, setTestType] = useState('Basic Soil Analysis');
  const [testDate, setTestDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Tomorrow's date
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userTests, setUserTests] = useState<SoilTest[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(state => state.user);

  // Fetch user's scheduled tests
  useEffect(() => {
    if (!user) return;
    
    const fetchTests = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('soil_tests')
          .select('*')
          .eq('user_id', user.id)
          .order('test_date', { ascending: false })
          .limit(2); // Only get the 2 most recent tests
        
        if (error) {
          console.error('Error fetching tests:', error);
          return;
        }
        
        if (data) {
          setUserTests(data);
        }
      } catch (err) {
        console.error('Failed to fetch soil tests:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTests();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('soil_tests_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'soil_tests',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchTests();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to schedule a test');
      return;
    }

    // Form validation
    if (!location.trim()) {
      setError('Farm location is required');
      return;
    }
    
    if (fieldSize && (isNaN(parseFloat(fieldSize)) || parseFloat(fieldSize) <= 0)) {
      setError('Field size must be a positive number');
      return;
    }
    
    if (!testDate) {
      setError('Test date is required');
      return;
    }
    
    const selectedDate = new Date(testDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Test date cannot be in the past');
      return;
    }

    setError(null);
    setSubmitting(true);
    
    try {
      // First check if table exists and debug the response
      const { data: tableCheck, error: tableCheckError } = await supabase
        .from('soil_tests')
        .select('id')
        .limit(1);

      console.log('Table check response:', { data: tableCheck, error: tableCheckError });

      if (tableCheckError) {
        console.error('Table check error:', tableCheckError);
        // Try to create the table if it doesn't exist
        const { error: setupError } = await supabase.rpc('setup_soil_tests_table');
        
        if (setupError) {
          console.error('Setup error:', setupError);
          setError('Unable to setup database. Please contact support.');
          return;
        }
      }

      const newTest = {
        user_id: user.id,
        location: location.trim(),
        field_size: fieldSize ? parseFloat(fieldSize) : null,
        test_type: testType,
        test_date: new Date(testDate).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('soil_tests')
        .insert([newTest]);

      if (dbError) {
        console.error('Database error:', dbError);
        if (dbError.code === '23503') { // Foreign key violation
          setError('Authentication error. Please try logging in again.');
        } else if (dbError.code === '23502') { // Not null violation
          setError('Missing required fields. Please fill in all required information.');
        } else {
          throw dbError;
        }
        return;
      }

      // Show success message
      setSuccess(true);
      // Reset form
      setLocation('');
      setFieldSize('');
      setTestType('Basic Soil Analysis');
      setTestDate(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error scheduling soil test:', err);
      setError('Failed to schedule test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'sample_collection':
        return <MapPin className="w-5 h-5" />;
      case 'analyzing':
        return <Beaker className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getTimelineColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-500';
      case 'analyzing':
        return 'bg-blue-500';
      case 'sample_collection':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-8"
    >
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="text-green-600 hover:text-green-800 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <GiPlantRoots className="w-10 h-10 text-green-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-800">Soil Testing</h1>
        </div>
        <p className="text-xl text-gray-600">
          Analyze your soil composition and get recommendations for optimal crop growth
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Soil Test Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Schedule Soil Test</h2>
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-sm text-green-700">Test scheduled successfully!</p>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter farm location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Size (acres)
              </label>
              <input
                type="number"
                value={fieldSize}
                onChange={(e) => setFieldSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter field size"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
              >
                <option value="Basic Soil Analysis">Basic Soil Analysis</option>
                <option value="Complete Nutrient Analysis">Complete Nutrient Analysis</option>
                <option value="Organic Matter Test">Organic Matter Test</option>
                <option value="pH and Salinity Test">pH and Salinity Test</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Date
              </label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors ${
                submitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Scheduling...' : 'Schedule Test'}
            </button>
          </form>
        </motion.div>

        {/* Test History and Tracking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Test History & Tracking</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
            </div>
          ) : userTests.length > 0 ? (
            <div className="space-y-8">
              {userTests.map((test) => (
                <div 
                  key={test.id}
                  className="relative bg-white rounded-lg p-6 border border-gray-100 shadow-sm"
                >
                  {/* Timeline track */}
                  <div className="absolute left-0 ml-8 h-full w-0.5 -translate-x-1/2 bg-gray-200"></div>

                  {/* Test header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{test.location}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.status === 'completed' ? 'bg-green-100 text-green-800' :
                      test.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                      test.status === 'sample_collection' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {test.status === 'pending' ? 'Scheduled' :
                       test.status === 'sample_collection' ? 'Sample Collection' :
                       test.status === 'analyzing' ? 'Analyzing' :
                       'Completed'}
                    </span>
                  </div>

                  {/* Test details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">
                        Test Type: <span className="font-medium">{test.test_type}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Field Size: <span className="font-medium">{test.field_size} acres</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Scheduled Date:{' '}
                        <span className="font-medium">
                          {new Date(test.test_date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Timeline steps */}
                  <div className="relative ml-8">
                    {/* Scheduled */}
                    <div className="mb-8 flex items-center">
                      <div className={`absolute -left-4 h-8 w-8 flex items-center justify-center rounded-full bg-green-500 text-white`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="ml-6">
                        <p className="font-medium">Test Scheduled</p>
                        <p className="text-sm text-gray-600">
                          {new Date(test.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Sample Collection */}
                    {test.status !== 'pending' && (
                      <div className="mb-8 flex items-center">
                        <div className={`absolute -left-4 h-8 w-8 flex items-center justify-center rounded-full ${
                          test.status === 'sample_collection' || test.status === 'analyzing' || test.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-500'
                        }`}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="ml-6">
                          <p className="font-medium">Sample Collection</p>
                          {test.sample_collection_date && (
                            <p className="text-sm text-gray-600">
                              {new Date(test.sample_collection_date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Analysis */}
                    {(test.status === 'analyzing' || test.status === 'completed') && (
                      <div className="mb-8 flex items-center">
                        <div className={`absolute -left-4 h-8 w-8 flex items-center justify-center rounded-full ${
                          test.status === 'analyzing' || test.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-500'
                        }`}>
                          <Beaker className="w-5 h-5" />
                        </div>
                        <div className="ml-6">
                          <p className="font-medium">Analysis In Progress</p>
                          {test.analysis_started_date && (
                            <p className="text-sm text-gray-600">
                              {new Date(test.analysis_started_date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Completed */}
                    {test.status === 'completed' && (
                      <div className="mb-8 flex items-center">
                        <div className="absolute -left-4 h-8 w-8 flex items-center justify-center rounded-full bg-green-500 text-white">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="ml-6">
                          <p className="font-medium">Results Ready</p>
                          {test.completed_date && (
                            <p className="text-sm text-gray-600">
                              {new Date(test.completed_date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Test Results Section */}
                  {test.status === 'completed' && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h4>
                      <div className="grid grid-cols-2 gap-6">
                        {test.ph_level && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">pH Level</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold">{test.ph_level}</span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                test.ph_level < 6 ? 'bg-red-100 text-red-800' :
                                test.ph_level > 7.5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {test.ph_level < 6 ? 'Acidic' :
                                 test.ph_level > 7.5 ? 'Alkaline' :
                                 'Optimal'}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {test.nitrogen_level && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">Nitrogen Level</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold">{test.nitrogen_level} ppm</span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                test.nitrogen_level < 40 ? 'bg-red-100 text-red-800' :
                                test.nitrogen_level < 80 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {test.nitrogen_level < 40 ? 'Low' :
                                 test.nitrogen_level < 80 ? 'Medium' :
                                 'High'}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {test.phosphorus_level && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">Phosphorus Level</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold">{test.phosphorus_level} ppm</span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                test.phosphorus_level < 20 ? 'bg-red-100 text-red-800' :
                                test.phosphorus_level < 40 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {test.phosphorus_level < 20 ? 'Low' :
                                 test.phosphorus_level < 40 ? 'Medium' :
                                 'High'}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {test.potassium_level && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600 mb-2">Potassium Level</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold">{test.potassium_level} ppm</span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                test.potassium_level < 150 ? 'bg-red-100 text-red-800' :
                                test.potassium_level < 250 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {test.potassium_level < 150 ? 'Low' :
                                 test.potassium_level < 250 ? 'Medium' :
                                 'High'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No soil tests scheduled yet.</p>
              <p className="mt-2">Schedule your first test to get started.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-green-50 p-6 rounded-xl border border-green-200"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">AI Recommendations</h2>
        {userTests.length > 0 && userTests.some(test => test.status === 'completed') ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTests
              .filter(test => test.status === 'completed')
              .map((test, index) => (
                <div key={test.id} className="bg-white p-4 rounded-lg">
                  <h3 className={`font-semibold ${index === 0 ? 'text-green-800' : 'text-yellow-800'} mb-2`}>
                    For {test.location}
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {test.ph_level && test.ph_level < 6 && (
                      <li>• Apply lime to reduce acidity</li>
                    )}
                    {test.ph_level && test.ph_level > 7.5 && (
                      <li>• Apply sulfur to reduce alkalinity</li>
                    )}
                    {test.nitrogen_level && test.nitrogen_level < 40 && (
                      <li>• Increase nitrogen levels with compost or fertilizer</li>
                    )}
                    {test.phosphorus_level && test.phosphorus_level < 20 && (
                      <li>• Add phosphate fertilizer before planting</li>
                    )}
                    {test.potassium_level && test.potassium_level < 150 && (
                      <li>• Add potassium fertilizer before planting</li>
                    )}
                    <li>• Consider crop rotation to improve soil health</li>
                    <li>• Monitor soil moisture levels regularly</li>
                  </ul>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">General Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Schedule regular soil tests for best results</li>
                <li>• Consider crop rotation to improve soil health</li>
                <li>• Add organic matter to improve soil structure</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Season Recommendations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Prepare soil thoroughly before planting</li>
                <li>• Check pH levels before adding amendments</li>
                <li>• Consider cover crops during off-season</li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default SoilTesting;
