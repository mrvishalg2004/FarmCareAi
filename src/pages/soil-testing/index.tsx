// import React, { useState, useEffect } from 'react';
// import { ref, push, onValue, query, orderByChild } from 'firebase/database';
// import { db, auth, dbRefs } from '../../lib/firebase';
// import { SoilTest } from '../../types/database';
// import { Calendar, MapPin, Plus } from 'lucide-react';

// function SoilTesting() {
//   const [tests, setTests] = useState<SoilTest[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [location, setLocation] = useState('');
//   const [testDate, setTestDate] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const testsRef = ref(db, dbRefs.soilTests);
//     const testsQuery = query(testsRef, orderByChild('created_at'));

//     const unsubscribe = onValue(testsQuery, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const testsArray = Object.entries(data).map(([id, test]) => ({
//           id,
//           ...(test as Omit<SoilTest, 'id'>)
//         }));
//         setTests(testsArray.reverse());
//       } else {
//         setTests([]);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const testsRef = ref(db, dbRefs.soilTests);
//       await push(testsRef, {
//         user_id: auth.currentUser?.uid,
//         location,
//         test_date: new Date(testDate).toISOString(),
//         status: 'pending',
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       });

//       setLocation('');
//       setTestDate('');
//       setShowForm(false);
//     } catch (error) {
//       console.error('Error creating soil test:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Soil Testing</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Schedule Test
//         </button>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Schedule Soil Test</h3>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MapPin className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                     placeholder="Enter location"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Test Date
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Calendar className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="date"
//                     value={testDate}
//                     onChange={(e) => setTestDate(e.target.value)}
//                     className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="mt-5 sm:mt-6">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
//                 >
//                   {loading ? 'Scheduling...' : 'Schedule Test'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="bg-white shadow overflow-hidden sm:rounded-md">
//         <ul className="divide-y divide-gray-200">
//           {tests.map((test) => (
//             <li key={test.id}>
//               <div className="px-4 py-4 sm:px-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <MapPin className="h-5 w-5 text-gray-400 mr-2" />
//                     <p className="text-sm font-medium text-gray-900">{test.location}</p>
//                   </div>
//                   <div className="ml-2 flex-shrink-0 flex">
//                     <p
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         test.status === 'completed'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}
//                     >
//                       {test.status}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="mt-2 sm:flex sm:justify-between">
//                   <div className="sm:flex">
//                     <p className="flex items-center text-sm text-gray-500">
//                       <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
//                       {new Date(test.test_date).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default SoilTesting;

import React, { useState, useEffect } from 'react';
import { ref, push, onValue, query, orderByChild, child } from 'firebase/database';
import { db, auth, dbRefs } from '../../lib/firebase';
import { SoilTest } from '../../types/database';
import { Calendar, MapPin, Plus, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SoilTesting() {
  const [tests, setTests] = useState<SoilTest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [location, setLocation] = useState('');
  const [testDate, setTestDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 useEffect(() => {
  if (!auth.currentUser) {
    setError('You must be signed in to load soil tests.');
    return;
  }

  const userTestsRef = ref(db, `${dbRefs.soilTests}/${auth.currentUser.uid}`);
  const testsQuery = query(userTestsRef, orderByChild('created_at'));

  const unsubscribe = onValue(
    testsQuery,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const testsArray = Object.entries(data)
          .map(([id, test]) => ({
            id,
            ...(test as Omit<SoilTest, 'id'>)
          }))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setTests(testsArray);
        setError(''); // Clear any previous errors
      } else {
        setTests([]);
      }
    },
    (error) => {
      console.error('Error fetching tests:', error);
      setError('Failed to load soil tests. Please try again later.');
    }
  );

  return () => unsubscribe();
}, [auth.currentUser]);


  const validateForm = () => {
    if (!auth.currentUser) {
      setError('You must be signed in to schedule a test');
      return false;
    }
    if (!location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!testDate) {
      setError('Test date is required');
      return false;
    }
    if (new Date(testDate) < new Date()) {
      setError('Test date cannot be in the past');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userId = auth.currentUser!.uid;
      const userTestsRef = ref(db, `${dbRefs.soilTests}/${userId}`);
      const newTest = {
        user_id: userId,
        location: location.trim(),
        test_date: new Date(testDate).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await push(userTestsRef, newTest);
      setLocation('');
      setTestDate('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating soil test:', error);
      setError('Failed to schedule test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Soil Testing</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule Test
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Schedule Soil Test</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-red-50 border-l-4 border-red-400 p-4"
                >
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Enter field location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Date
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Test'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow overflow-hidden sm:rounded-lg"
      >
        {tests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tests scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by scheduling your first soil test.</p>
          </motion.div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tests.map((test) => (
              <motion.li
                key={test.id}
                variants={itemVariants}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{test.location}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(test.test_date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      test.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {test.status}
                  </motion.div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
}

export default SoilTesting;