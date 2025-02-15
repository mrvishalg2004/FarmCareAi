// import React from 'react';
// import { Routes, Route, Link, useLocation } from 'react-router-dom';
// import { Plane as Plant, Sprout, CloudSun, Database, TrendingUp, LineChart, LogOut } from 'lucide-react';
// import { useAuthStore } from '../store/authStore';
// import SoilTesting from './soil-testing';
// import CropRecommendations from './crop-recommendations';

// function Dashboard() {
//   const location = useLocation();
//   const signOut = useAuthStore((state) => state.signOut);

//   const menuItems = [
//     { icon: <Plant className="w-6 h-6" />, label: 'Soil Testing', path: '/dashboard/soil-testing' },
//     { icon: <Sprout className="w-6 h-6" />, label: 'Crop Recommendations', path: '/dashboard/crop-recommendations' },
//     { icon: <CloudSun className="w-6 h-6" />, label: 'Disease Detection', path: '/dashboard/disease-detection' },
//     { icon: <Database className="w-6 h-6" />, label: 'Treatment Plans', path: '/dashboard/treatment-plans' },
//     { icon: <TrendingUp className="w-6 h-6" />, label: 'Yield Prediction', path: '/dashboard/yield-prediction' },
//     { icon: <LineChart className="w-6 h-6" />, label: 'Market Insights', path: '/dashboard/market-insights' },
//   ];

//   const isHomePage = location.pathname === '/dashboard';

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <Link to="/dashboard" className="text-xl font-bold text-green-600">
//                   SmartFarm AI
//                 </Link>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <button
//                 onClick={() => signOut()}
//                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition"
//               >
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="py-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {isHomePage ? (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {menuItems.map((item, index) => (
//                 <Link
//                   key={index}
//                   to={item.path}
//                   className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
//                 >
//                   <div className="p-6">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0">
//                         <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
//                           {item.icon}
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-lg font-medium text-gray-900">{item.label}</h3>
//                         <p className="mt-1 text-sm text-gray-500">
//                           Click to access {item.label.toLowerCase()} features
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <Routes>
//               <Route path="soil-testing" element={<SoilTesting />} />
//               <Route path="crop-recommendations" element={<CropRecommendations />} />
//               {/* Other routes will be implemented similarly */}
//             </Routes>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import SoilTesting from './soil-testing';
import CropRecommendations from './crop-recommendations';
import logo from '../pages/logo.svg';
import { GiFarmTractor, GiGrain, GiPlantRoots, GiSprout, GiChemicalTank, GiChart } from 'react-icons/gi';
import { IoLogOutOutline } from 'react-icons/io5';

function Dashboard() {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);

  const menuItems = [
    { icon: <GiPlantRoots className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Soil Testing', path: '/dashboard/soil-testing' },
    { icon: <GiSprout className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Crop Recommendations', path: '/dashboard/crop-recommendations' },
    { icon: <GiGrain className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Disease Detection', path: '/dashboard/disease-detection', comingSoon: true },
    { icon: <GiChemicalTank className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Treatment Plans', path: '/dashboard/treatment-plans', comingSoon: true },
    { icon: <GiFarmTractor className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Yield Prediction', path: '/dashboard/yield-prediction', comingSoon: true },
    { icon: <GiChart className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Market Insights', path: '/dashboard/market-insights', comingSoon: true },
  ];

  const isHomePage = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white">
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-green-300"
      >
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="SmartFarm AI Logo" className="h-20 w-50 " />
        </Link>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={signOut}
          className="flex items-center gap-2 px-5 py-2 text-gray-700 hover:text-red-600 transition font-semibold border border-gray-300 rounded-full shadow-md hover:shadow-lg"
        >
          <IoLogOutOutline className="w-6 h-6" /> Sign Out
        </motion.button>
      </motion.nav>

      {/* Dashboard Grid */}
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {isHomePage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className={`block p-8 bg-white shadow-2xl rounded-3xl transition hover:shadow-3xl border border-gray-300 hover:border-green-500 transform hover:-translate-y-2 hover:scale-105 ${item.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-5">
                    <motion.div 
                      className="p-5 bg-green-200 text-green-700 rounded-3xl"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.label}</h3>
                      <p className="text-md text-gray-600">{item.comingSoon ? 'Coming Soon' : `Explore ${item.label}`}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Routes>
            <Route path="soil-testing" element={<SoilTesting />} />
            <Route path="crop-recommendations" element={<CropRecommendations />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
