import React, { useState, useEffect } from 'react';
import { ref, push, onValue, query, orderByChild } from 'firebase/database';
import { db, auth, dbRefs } from '../../lib/firebase';
import { SoilTest } from '../../types/database';
import { Calendar, MapPin, Plus } from 'lucide-react';

function SoilTesting() {
  const [tests, setTests] = useState<SoilTest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [location, setLocation] = useState('');
  const [testDate, setTestDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const testsRef = ref(db, dbRefs.soilTests);
    const testsQuery = query(testsRef, orderByChild('created_at'));

    const unsubscribe = onValue(testsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const testsArray = Object.entries(data).map(([id, test]) => ({
          id,
          ...(test as Omit<SoilTest, 'id'>)
        }));
        setTests(testsArray.reverse());
      } else {
        setTests([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const testsRef = ref(db, dbRefs.soilTests);
      await push(testsRef, {
        user_id: auth.currentUser?.uid,
        location,
        test_date: new Date(testDate).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      setLocation('');
      setTestDate('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating soil test:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Soil Testing</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule Test
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Schedule Soil Test</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Test Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                >
                  {loading ? 'Scheduling...' : 'Schedule Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tests.map((test) => (
            <li key={test.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-sm font-medium text-gray-900">{test.location}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        test.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {test.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {new Date(test.test_date).toLocaleDateString()}
                    </p>
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

export default SoilTesting;