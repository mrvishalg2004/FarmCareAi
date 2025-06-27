import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, MapPin, LogIn, AlertCircle, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from '../store/authStore';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setNavSolid(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    try {
      console.log('=== STARTING LOGIN PROCESS ===');
      console.log('Email:', email);
      console.log('Password length:', password.length);
      
      await signIn(email.trim(), password);
      console.log('=== LOGIN SUCCESS ===');
      setError("");
      console.log('=== ATTEMPTING REDIRECT ===');
      navigate('/dashboard', { replace: true });
      console.log('Navigation completed successfully');
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      let errorMessage = 'Sign in failed';
      if (error && typeof error === 'object' && 'message' in error) {
        const supabaseError = error as { message: string; status?: number };
        if (supabaseError.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (supabaseError.message.includes('Too many requests')) {
          errorMessage = 'Too many sign in attempts. Please try again later';
        } else {
          errorMessage = supabaseError.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.display_name || "Location not found");
          } catch (error) {
            console.error('Location fetch error:', error);
            setError("Failed to get location details");
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError("Failed to get location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Responsive Navbar */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${navSolid
            ? "bg-gradient-to-r from-green-800/95 to-green-900/95 shadow-lg backdrop-blur-md"
            : "bg-gradient-to-r from-green-800/95 to-green-900/95 shadow-lg backdrop-blur-md"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <a href="/" className="relative">
                <img
                  src="/images/mainlogo.png"
                  className="h-16 sm:h-20 w-auto relative z-10 drop-shadow-lg cursor-pointer"
                  alt="FarmCare Logo"
                />
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex self-center">
              <ul className="flex space-x-4 lg:space-x-6 text-base lg:text-lg font-medium text-white">
                {[
                  { name: "Home", path: "/" },
                  { name: "Services", path: "#" },
                  { name: "Contact us", path: "/contact" },
                  { name: "About us", path: "/about" }
                ].map((item) => (
                  <motion.li
                    key={item.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={item.path} className="hover:text-green-300 transition-colors duration-300">
                      {item.name}
                    </a>
                  </motion.li>
                ))}
                <motion.li whileHover={{ scale: 1.05 }}>
                  <button
                    onClick={() => navigate("/signin")}
                    className="bg-white text-green-800 px-3 py-1 rounded-full hover:bg-green-100 transition-colors text-sm lg:text-base"
                  >
                    Login
                  </button>
                </motion.li>
                <motion.li whileHover={{ scale: 1.05 }}>
                  <button
                    onClick={() => navigate("/signup")}
                    className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-400 transition-colors text-sm lg:text-base"
                  >
                    Sign Up
                  </button>
                </motion.li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </motion.button>
          </div>

          {/* Mobile Navigation Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? 'auto' : 0,
              opacity: isMobileMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-green-800/95 backdrop-blur-md rounded-b-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "#" },
                { name: "Contact us", path: "/contact" },
                { name: "About us", path: "/about" }
              ].map((item) => (
                <motion.a
                  key={item.name}
                  href={item.path}
                  whileHover={{ x: 5 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white hover:text-green-300 transition-colors duration-300 py-2 border-b border-green-700 last:border-b-0"
                >
                  {item.name}
                </motion.a>
              ))}
              
              <div className="pt-4 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/signin");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-white text-green-800 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors font-medium"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400 transition-colors font-medium"
                >
                  Sign Up
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="pt-24 flex flex-col items-center px-4 sm:px-6 lg:px-8 min-h-screen">
        {/* Animated SignIn Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-10 bg-white px-6 py-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md"
        >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl font-bold text-green-900 mb-6 text-center"
        >
          Login to Your Account
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 bg-red-50 border-l-4 border-red-400 p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <Mail className="absolute left-3 top-3 text-blue-600" />
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
              required
            />
          </motion.div>

          {/* Location Input */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            <MapPin className="absolute left-3 top-3 text-teal-600" />
            <input
              type="text"
              placeholder="Enter Your Location (Optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-12 p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="absolute right-3 top-2 text-gray-600 hover:text-green-600 transition"
            >
              <MapPin className="w-6 h-6" />
            </button>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative"
          >
            <Lock className="absolute left-3 top-3 text-red-600" />
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
              required
            />
          </motion.div>

          {/* Enhanced Smooth Agricultural Sign In Button */}
          <motion.button
            whileHover={{ 
              scale: 1.03,
              y: -2,
              boxShadow: "0 15px 40px rgba(34, 197, 94, 0.4)",
            }}
            whileTap={{ 
              scale: 0.96,
              y: 0,
              boxShadow: "0 5px 15px rgba(34, 197, 94, 0.3)",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.2
            }}
            className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-4 rounded-xl shadow-lg font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed group"
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {/* Smooth Background Wave Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 opacity-0"
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{ 
                x: "0%", 
                opacity: 1,
                transition: { 
                  duration: 0.6, 
                  ease: "easeOut"
                }
              }}
              whileTap={{ 
                x: "100%",
                transition: { 
                  duration: 0.3, 
                  ease: "easeIn"
                }
              }}
            />

            {/* Ripple Effect on Click */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-xl"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.3, 0],
                transition: { duration: 0.5 }
              }}
            />
            
            {/* Agricultural Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <motion.div 
                className="absolute top-2 left-6 text-lg"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🌾
              </motion.div>
              <motion.div 
                className="absolute top-2 right-6 text-lg"
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                🌾
              </motion.div>
              <motion.div 
                className="absolute bottom-2 left-8 text-sm"
                animate={{ 
                  y: [0, -2, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                🌻
              </motion.div>
              <motion.div 
                className="absolute bottom-2 right-8 text-sm"
                animate={{ 
                  y: [0, -2, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                🌻
              </motion.div>
            </div>

            {/* Growing Plant Side Animation */}
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ 
                scale: isLoading ? [0.8, 1.2, 0.8] : 1, 
                rotate: 0, 
                opacity: 1 
              }}
              whileHover={{
                scale: 1.3,
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.6 }
              }}
              transition={{ 
                scale: { 
                  duration: isLoading ? 1.5 : 0.4, 
                  repeat: isLoading ? Infinity : 0,
                  ease: "easeInOut"
                },
                rotate: { duration: 0.4, ease: "easeOut" },
                opacity: { duration: 0.3 }
              }}
            >
              🌱
            </motion.div>

            {/* Main Button Content */}
            <motion.div 
              className="relative z-10 flex items-center justify-center"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center"
                >
                  {/* Smooth Spinner */}
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                  <span>Growing your session...</span>
                  <motion.div
                    className="ml-2 text-sm"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🌿
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    whileHover={{ 
                      rotate: 20,
                      scale: 1.1
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                  </motion.div>
                  <span>Sign In</span>
                  <motion.div
                    className="ml-2 text-base opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      x: [0, 5, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    🚜
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Floating Particles on Hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ 
                opacity: 1,
                transition: { duration: 0.3 }
              }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${25 + (i % 3) * 25}%`,
                  }}
                  initial={{ 
                    y: 0, 
                    opacity: 0,
                    scale: 0
                  }}
                  whileHover={{
                    y: [-5, -15, -25],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }
                  }}
                />
              ))}
            </motion.div>

            {/* Glow Effect on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 blur-sm"
              whileHover={{ 
                opacity: 0.3,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            />

            {/* Success Pulse Animation */}
            {isLoading && (
              <motion.div
                className="absolute inset-0 border-2 border-white/50 rounded-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        </form>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-6 space-y-4"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">New to FarmCare?</span>
            </div>
          </div>
          
          <motion.a
            href="/signup"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 8px 25px rgba(34, 197, 94, 0.2)"
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-block w-full relative overflow-hidden py-3 px-6 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all group"
          >
            {/* Background Wave Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Farming Icons */}
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100"
              initial={{ rotate: -45, scale: 0 }}
              whileHover={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              🌾
            </motion.div>
            
            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100"
              initial={{ rotate: 45, scale: 0 }}
              whileHover={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              🌻
            </motion.div>

            {/* Text Content */}
            <span className="relative z-10">Create Account</span>
            
            {/* Growing Border Effect */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;

