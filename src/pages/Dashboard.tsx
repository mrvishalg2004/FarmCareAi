import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plane as Plant, Sprout, CloudSun, Database, TrendingUp, LineChart, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import SoilTesting from './soil-testing';
import CropRecommendations from './crop-recommendations';

function Dashboard() {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);

  const menuItems = [
    { icon: <Plant className="w-6 h-6" />, label: 'Soil Testing', path: '/dashboard/soil-testing' },
    { icon: <Sprout className="w-6 h-6" />, label: 'Crop Recommendations', path: '/dashboard/crop-recommendations' },
    { icon: <CloudSun className="w-6 h-6" />, label: 'Disease Detection', path: '/dashboard/disease-detection' },
    { icon: <Database className="w-6 h-6" />, label: 'Treatment Plans', path: '/dashboard/treatment-plans' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Yield Prediction', path: '/dashboard/yield-prediction' },
    { icon: <LineChart className="w-6 h-6" />, label: 'Market Insights', path: '/dashboard/market-insights' },
  ];

  const isHomePage = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-xl font-bold text-green-600">
                  SmartFarm AI
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isHomePage ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                          {item.icon}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{item.label}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Click to access {item.label.toLowerCase()} features
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Routes>
              <Route path="soil-testing" element={<SoilTesting />} />
              <Route path="crop-recommendations" element={<CropRecommendations />} />
              {/* Other routes will be implemented similarly */}
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;