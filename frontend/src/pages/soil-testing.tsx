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
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <GiPlantRoots className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Soil Testing</h1>
              <p className="text-lg text-gray-600 mt-1">
                Get detailed analysis and recommendations for your soil
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule Test Form - Takes up 1/3 of the space */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-green-50 to-green-100">
                <h2 className="text-xl font-semibold text-gray-800">Schedule New Test</h2>
                <p className="text-sm text-gray-600 mt-1">Fill in the details to schedule your soil test</p>
              </div>
              
              <div className="p-6">
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <p className="text-sm text-green-700">Test scheduled successfully!</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Farm Location
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter your farm location"
                      required
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter field size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Type
                      <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
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
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors
                      ${submitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-700'} 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scheduling...
                      </span>
                    ) : 'Schedule Test'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Test History & Tracking - Takes up 2/3 of the space */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Test History & Tracking</h2>
                <p className="text-sm text-gray-600 mt-1">View and track your soil test progress</p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                  </div>
                ) : userTests.length > 0 ? (
                  <div className="space-y-8">
                    {userTests.map((test) => (
                      <div 
                        key={test.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        {/* Test Header */}
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-lg ${
                                test.status === 'completed' ? 'bg-green-100' :
                                test.status === 'analyzing' ? 'bg-blue-100' :
                                test.status === 'sample_collection' ? 'bg-yellow-100' :
                                'bg-gray-100'
                              }`}>
                                {getStatusIcon(test.status)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">{test.location}</h3>
                                <p className="text-sm text-gray-600">{test.test_type}</p>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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
                        </div>

                        {/* Timeline */}
                        <div className="p-6">
                          <div className="relative">
                            <div className="absolute left-8 top-0 h-full w-px bg-gray-200"></div>
                            
                            {/* Timeline steps */}
                            <div className="space-y-6">
                              {/* Scheduled Step */}
                              <div className="relative flex items-center">
                                <div className={`absolute left-8 w-8 h-8 -translate-x-1/2 rounded-full flex items-center justify-center
                                  ${test.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                                  <Clock className="w-4 h-4 text-white" />
                                </div>
                                <div className="ml-12">
                                  <p className="font-medium text-gray-800">Test Scheduled</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(test.created_at).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Sample Collection Step */}
                              {test.status !== 'pending' && (
                                <div className="relative flex items-center">
                                  <div className={`absolute left-8 w-8 h-8 -translate-x-1/2 rounded-full flex items-center justify-center
                                    ${test.status === 'sample_collection' || test.status === 'analyzing' || test.status === 'completed'
                                      ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <MapPin className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="ml-12">
                                    <p className="font-medium text-gray-800">Sample Collection</p>
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

                              {/* Analysis Step */}
                              {(test.status === 'analyzing' || test.status === 'completed') && (
                                <div className="relative flex items-center">
                                  <div className={`absolute left-8 w-8 h-8 -translate-x-1/2 rounded-full flex items-center justify-center
                                    ${test.status === 'analyzing' || test.status === 'completed'
                                      ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <Beaker className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="ml-12">
                                    <p className="font-medium text-gray-800">Analysis In Progress</p>
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

                              {/* Completed Step */}
                              {test.status === 'completed' && (
                                <div className="relative flex items-center">
                                  <div className="absolute left-8 w-8 h-8 -translate-x-1/2 rounded-full bg-green-500 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="ml-12">
                                    <p className="font-medium text-gray-800">Results Ready</p>
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
                          </div>

                          {/* Test Results Section */}
                          {test.status === 'completed' && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4">Soil Analysis Results</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* pH Level Card */}
                                {test.ph_level && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-sm font-medium text-gray-600">pH Level</p>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        test.ph_level < 6 ? 'bg-red-100 text-red-800' :
                                        test.ph_level > 7.5 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {test.ph_level < 6 ? 'Acidic' :
                                         test.ph_level > 7.5 ? 'Alkaline' :
                                         'Optimal'}
                                      </span>
                                    </div>
                                    <p className="text-2xl font-semibold text-gray-800">{test.ph_level}</p>
                                  </div>
                                )}

                                {/* Nitrogen Level Card */}
                                {test.nitrogen_level && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-sm font-medium text-gray-600">Nitrogen Level</p>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        test.nitrogen_level < 40 ? 'bg-red-100 text-red-800' :
                                        test.nitrogen_level < 80 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {test.nitrogen_level < 40 ? 'Low' :
                                         test.nitrogen_level < 80 ? 'Medium' :
                                         'High'}
                                      </span>
                                    </div>
                                    <p className="text-2xl font-semibold text-gray-800">{test.nitrogen_level} ppm</p>
                                  </div>
                                )}

                                {/* Phosphorus Level Card */}
                                {test.phosphorus_level && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-sm font-medium text-gray-600">Phosphorus Level</p>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        test.phosphorus_level < 20 ? 'bg-red-100 text-red-800' :
                                        test.phosphorus_level < 40 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {test.phosphorus_level < 20 ? 'Low' :
                                         test.phosphorus_level < 40 ? 'Medium' :
                                         'High'}
                                      </span>
                                    </div>
                                    <p className="text-2xl font-semibold text-gray-800">{test.phosphorus_level} ppm</p>
                                  </div>
                                )}

                                {/* Potassium Level Card */}
                                {test.potassium_level && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-sm font-medium text-gray-600">Potassium Level</p>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        test.potassium_level < 150 ? 'bg-red-100 text-red-800' :
                                        test.potassium_level < 250 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {test.potassium_level < 150 ? 'Low' :
                                         test.potassium_level < 250 ? 'Medium' :
                                         'High'}
                                      </span>
                                    </div>
                                    <p className="text-2xl font-semibold text-gray-800">{test.potassium_level} ppm</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-lg p-6 inline-block">
                      <GiPlantRoots className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No soil tests scheduled yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Schedule your first test to get started.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200"
        >
          <div className="p-6 border-b border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">AI Recommendations</h2>
            </div>
          </div>

          <div className="p-6">
            {userTests.length > 0 && userTests.some(test => test.status === 'completed') ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userTests
                  .filter(test => test.status === 'completed')
                  .map((test, index) => (
                    <div 
                      key={test.id}
                      className="bg-white rounded-xl p-6 border border-green-100 shadow-sm"
                    >
                      <h3 className={`text-lg font-semibold mb-4 ${
                        index === 0 ? 'text-green-800' : 'text-green-700'
                      }`}>
                        Recommendations for {test.location}
                      </h3>
                      <ul className="space-y-3">
                        {test.ph_level && test.ph_level < 6 && (
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                            <span className="text-gray-700">Apply lime to reduce acidity</span>
                          </li>
                        )}
                        {test.ph_level && test.ph_level > 7.5 && (
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                            <span className="text-gray-700">Apply sulfur to reduce alkalinity</span>
                          </li>
                        )}
                        {test.nitrogen_level && test.nitrogen_level < 40 && (
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                            <span className="text-gray-700">Increase nitrogen levels with compost or fertilizer</span>
                          </li>
                        )}
                        {test.phosphorus_level && test.phosphorus_level < 20 && (
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                            <span className="text-gray-700">Add phosphate fertilizer before planting</span>
                          </li>
                        )}
                        {test.potassium_level && test.potassium_level < 150 && (
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                            <span className="text-gray-700">Add potassium fertilizer before planting</span>
                          </li>
                        )}
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                          <span className="text-gray-700">Consider crop rotation to improve soil health</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                          <span className="text-gray-700">Monitor soil moisture levels regularly</span>
                        </li>
                      </ul>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">General Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                      <span className="text-gray-700">Schedule regular soil tests for best results</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                      <span className="text-gray-700">Consider crop rotation to improve soil health</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                      <span className="text-gray-700">Add organic matter to improve soil structure</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Season Recommendations</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                      <span className="text-gray-700">Prepare soil thoroughly before planting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                      <span className="text-gray-700">Check pH levels before adding amendments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                      <span className="text-gray-700">Consider cover crops during off-season</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SoilTesting;
