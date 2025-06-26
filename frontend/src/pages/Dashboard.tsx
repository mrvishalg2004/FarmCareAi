import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import SoilTesting from './soil-testing';
import CropRecommendations from './crop-recommendations';
import logo from '../pages/logo.svg';
import { GiFarmTractor, GiGrain, GiPlantRoots, GiSprout, GiChemicalTank, GiChart } from 'react-icons/gi';
import { IoLogOutOutline } from 'react-icons/io5';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);

  // Handle logout with Supabase
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log('User signed out successfully');
      // Redirect to sign-in page
      navigate('/SignIn', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      navigate('/SignIn', { replace: true });
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-white shadow-xl h-screen sticky top-0 border-r border-gray-200"
        >
          {/* Logo Section */}
          <div className="p-6 bg-gradient-to-r from-green-600 to-blue-600">
            <div className="flex items-center">
              <img src={logo} alt="FarmCare AI" className="h-8 w-8 mr-3" />
              <h1 className="text-white text-xl font-bold">FarmCare AI</h1>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-8">
            <div className="px-6 pb-4">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                Main Menu
              </h3>
            </div>
            
            <Link
              to="/dashboard"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-r-3 transition-all duration-200 ${
                isHomePage ? 'bg-green-50 text-green-700 border-green-500' : 'border-transparent'
              }`}
            >
              <GiChart className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.comingSoon ? '#' : item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-r-3 transition-all duration-200 relative ${
                  location.pathname === item.path ? 'bg-green-50 text-green-700 border-green-500' : 'border-transparent'
                } ${item.comingSoon ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <div className="flex items-center">
                  {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
                  {item.label}
                  {item.comingSoon && (
                    <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 w-full p-6">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <IoLogOutOutline className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardHome menuItems={menuItems} />} />
            <Route path="/soil-testing/*" element={<SoilTesting />} />
            <Route path="/crop-recommendations/*" element={<CropRecommendations />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// DashboardHome component - the main dashboard content
function DashboardHome({ menuItems }: { menuItems: Array<{
  icon: React.ReactElement;
  label: string;
  path: string;
  comingSoon?: boolean;
}> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to FarmCare AI
        </h1>
        <p className="text-xl text-gray-600">
          Your intelligent farming companion for better crop management
        </p>
      </div>

      {/* Features Grid - Clickable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 cursor-pointer ${
              item.comingSoon ? 'opacity-75' : ''
            }`}
          >
            <Link 
              to={item.comingSoon ? '#' : item.path} 
              className={`block ${item.comingSoon ? 'pointer-events-none' : ''}`}
            >
              <div className="text-center">
                <div className="mb-4">
                  {React.cloneElement(item.icon, { 
                    className: `w-16 h-16 mx-auto ${
                      item.comingSoon ? 'text-gray-400' : 'text-green-600'
                    }` 
                  })}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  item.comingSoon ? 'text-gray-600' : 'text-gray-800'
                }`}>
                  {item.label}
                </h3>
                <p className={`mb-4 ${
                  item.comingSoon ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {item.comingSoon 
                    ? 'Coming soon to enhance your farming experience'
                    : `Explore ${item.label.toLowerCase()} features`
                  }
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  item.comingSoon 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.comingSoon ? 'Coming Soon' : 'Available'}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Dashboard;


