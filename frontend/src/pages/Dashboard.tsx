import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SoilTesting from './soil-testing';
// Use URL import for public assets
import { GiGrain, GiPlantRoots, GiSprout, GiChart } from 'react-icons/gi';
import { IoLogOutOutline } from 'react-icons/io5';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle scroll event to make navbar solid on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavSolid(window.scrollY > 50); // Make navbar solid after scrolling 50px
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { icon: <GiSprout className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Crop Recommendations', path: 'https://croprecommedation.vercel.app/', isExternal: false },
    { icon: <GiGrain className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Disease Detection', path: 'https://diseasedetectiontool.streamlit.app/', comingSoon: false, isExternal: false },
    // { icon: <GiChart className="w-12 h-12 text-green-700 drop-shadow-md" />, label: 'Market Insights', path: '/dashboard/market-insights', comingSoon: true }
  ];

  const isHomePage = location.pathname === '/dashboard';

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 overflow-hidden">
      <div className="flex h-full relative">
        {/* Mobile Menu Button */}
        <button 
          className={`fixed top-4 left-4 z-[60] p-2.5 ${navSolid ? 'bg-white' : 'bg-white/80 backdrop-blur-sm'} rounded-xl shadow-lg lg:hidden hover:bg-gray-50 transition-all duration-200 ${navSolid ? 'border border-gray-200' : 'border border-gray-200/50'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            className="w-5 h-5 text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Overlay Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}        {/* Sidebar */}
        <aside
          className={`fixed lg:static w-[240px] ${navSolid ? 'bg-green-900' : 'bg-green-900/90 backdrop-blur-sm'} 
          shadow-xl h-full lg:h-screen z-50 
          border-r border-green-800 flex flex-col
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:transform-none lg:translate-x-0 overflow-hidden transition-colors duration-300`}
        >
          {/* Logo Section */}
          <div className="flex-shrink-0 p-4 flex items-center justify-center border-b border-green-800">
            <img 
              src="/images/mainlogo.png" 
              alt="FarmCare AI" 
              className="h-12 w-auto object-contain cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Navigation Menu - Scrollable Area */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-800">
            <div className="px-4 mb-2">
              <h3 className="text-xs uppercase tracking-wide text-green-100 font-semibold">
                Main Menu
              </h3>
            </div>

            <Link
              to="/dashboard"
              className={`flex items-center px-6 py-3 text-green-100 hover:bg-green-800 transition-all duration-200 ${
                isHomePage ? 'bg-green-800 text-white' : ''
              }`}
            >
              <GiChart className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            {menuItems.map((item) => (
              item.isExternal ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center px-6 py-3 text-green-100 hover:bg-green-800 transition-all duration-200 relative`}
                >
                  <div className="flex items-center">
                    {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
                    {item.label}
                  </div>
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.comingSoon ? '#' : item.path}
                  className={`flex items-center px-6 py-3 text-green-100 hover:bg-green-800 transition-all duration-200 relative ${
                    location.pathname === item.path ? 'bg-green-800 text-white' : ''
                  } ${item.comingSoon ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <div className="flex items-center">
                    {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
                    {item.label}
                    {item.comingSoon && (
                      <span className="ml-auto bg-green-700 text-green-100 text-xs px-2 py-1 rounded-full">
                        Soon
                      </span>
                    )}
                  </div>
                </Link>
              )
            ))}
          </nav>

          {/* Logout Button - Fixed at bottom */}
          <div className={`flex-shrink-0 p-4 border-t border-green-800 ${navSolid ? 'bg-green-900' : 'bg-green-900/90 backdrop-blur-sm'} transition-colors duration-300`}>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-6 py-3 text-green-100 hover:bg-green-800 hover:text-white rounded-lg transition-all duration-200"
            >
              <IoLogOutOutline className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content - Adjusted to prevent overflow issues */}
        <main className={`flex-1 min-h-screen w-full ${navSolid ? 'bg-transparent' : 'bg-transparent backdrop-blur-sm'} overflow-x-hidden lg:ml-0 transition-all duration-300`}>
          <div className="h-full overflow-y-auto">
            <div className="px-4 py-4 sm:px-6 lg:px-8 pt-16 lg:pt-6 min-h-full">
              <div className="max-w-7xl mx-auto">
                {/* Content */}
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<DashboardHome menuItems={menuItems} />} />
                    <Route path="/soil-testing/*" element={<SoilTesting />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
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
  isExternal?: boolean;
}> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-4 md:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Welcome to FarmCare AI
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-600">
          Your intelligent farming companion for better crop management
        </p>
      </div>

      {/* Features Grid - Responsive Clickable Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-0">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 cursor-pointer ${
              item.comingSoon ? 'opacity-75' : ''
            }`}
          >
            {item.isExternal ? (
              <a 
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="text-center p-2 md:p-4">
                  <div className="mb-3 md:mb-4">
                    {React.cloneElement(item.icon, { 
                      className: `w-12 h-12 md:w-16 md:h-16 mx-auto text-green-600` 
                    })}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {item.label}
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Explore {item.label.toLowerCase()} features
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    External App
                  </span>
                </div>
              </a>
            ) : (
              <Link 
                to={item.comingSoon ? '#' : item.path} 
                className={`block ${item.comingSoon ? 'pointer-events-none' : ''}`}
              >
                <div className="text-center p-2 md:p-4">
                  <div className="mb-3 md:mb-4">
                    {React.cloneElement(item.icon, { 
                      className: `w-12 h-12 md:w-16 md:h-16 mx-auto ${
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
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Dashboard;


