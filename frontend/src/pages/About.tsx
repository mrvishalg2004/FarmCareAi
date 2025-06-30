// About.tsx
import { motion, useAnimation, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Menu, X } from "lucide-react";


const About = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSolid] = useState(true); // Always solid for About page
  const navigate = useNavigate();
  // For shuffling text animation
  const [aboutText, setAboutText] = useState("Welcome to FarmCare AI");
  const aboutVariants = [
    "Welcome to FarmCare AI",
    "Your Smart Farming Partner",
    "Empowering Every Farmer",
    "Smarter. Greener. Together."
  ];
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % aboutVariants.length;
      setAboutText(aboutVariants[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll-based animation refs
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  // Only use scroll-based animation for mission/vision to avoid unused vars
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const visionInView = useInView(visionRef, { once: true, margin: "-100px" });

  // For auto-sliding background elements
  const bgControls = useAnimation();
  useEffect(() => {
    bgControls.start({
      x: [0, 40, -40, 0],
      y: [0, 20, -20, 0],
      transition: { repeat: Infinity, duration: 16, ease: "easeInOut" }
    });
  }, [bgControls]);

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
      <div className="container mx-auto px-2 sm:px-4 py-10 lg:py-20 max-w-7xl pt-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-28 relative"
          style={{ zIndex: 1 }}
        >
          {/* Animated farming-style background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              animate={bgControls}
              className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
              style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.25)' }}
            />
            <motion.div
              animate={bgControls}
              className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 shadow-[0_8px_32px_rgba(132,204,22,0.18)]"
              style={{ boxShadow: '0 8px 32px 0 rgba(132,204,22,0.18)' }}
            />
            <motion.div
              animate={bgControls}
              className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 shadow-[0_8px_32px_rgba(253,224,71,0.15)]"
              style={{ boxShadow: '0 8px 32px 0 rgba(253,224,71,0.15)' }}
            />
          </div>

          {/* Farm illustration graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8 max-w-xs mx-auto"
          >
            <img
              src="/farm-illustration.png"
              alt="Farm Illustration"
              className="w-full h-auto drop-shadow-[0_8px_32px_rgba(34,197,94,0.18)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                document.getElementById('fallback-icon')?.classList.remove('hidden');
              }}
            />
            <div id="fallback-icon" className="hidden text-6xl py-6">🌱🤖🌾</div>
          </motion.div>

          {/* Shuffling text animation */}
          <motion.div
            className="relative inline-block mb-10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              key={aboutText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-green-900 tracking-tight bg-clip-text bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-transparent drop-shadow-[0_4px_16px_rgba(34,197,94,0.12)]"
              style={{ textShadow: '0 2px 8px rgba(34,197,94,0.10)' }}
            >
              {aboutText}
              <span className="absolute -top-2 -right-4 text-2xl md:text-3xl">✨</span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_84,_0.7)] p-8 lg:p-12 max-w-4xl mx-auto hover:shadow-[0_20px_50px_rgba(8,_112,_84,_0.5)] transition-all duration-500 border border-green-100"
            whileHover={{ y: -5 }}
          >
            {/* Hero content with enhanced styling */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:flex-1">
                <h2 className="text-2xl font-bold text-green-800 mb-4 tracking-tight">Revolutionizing Farming with AI</h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  <span className="font-semibold text-green-800">FarmCare AI</span> is your intelligent farming companion, designed to revolutionize how you care for your land and crops.
                </p>
                <div className="mt-4 flex gap-3 items-center">
                  <span className="text-green-700 font-semibold flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Smart
                  </span>
                  <span className="text-green-700 font-semibold flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Reliable
                  </span>
                  <span className="text-green-700 font-semibold flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Accessible
                  </span>
                </div>
              </div>
              <div className="md:flex-1">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Our AI-powered platform provides:
                    </h3>
                    <ul className="space-y-3">
                      {["Smart Crop Recommendations", "Advanced Soil Analysis", "Weather Integration", "Disease Detection"].map((feature, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + (idx * 0.1) }}
                          className="flex items-start"
                        >
                          <span className="text-green-600 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-5 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Get Started
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mission & Vision - Responsive, farming-style shadow, scroll-based animation */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-16 lg:mb-28"
        >
          <motion.div
            ref={missionRef}
            initial={{ opacity: 0, y: 40 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_32px_rgba(34,197,94,0.13)] border border-green-100 flex flex-col items-center"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed text-center">
              To make farming <span className="font-semibold text-green-800">smarter</span>, <span className="font-semibold text-green-800">easier</span>, and <span className="font-semibold text-green-800">more profitable</span> by providing simple and powerful digital tools to every farmer.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed text-center">
              We want to support <span className="font-semibold text-green-800">small and medium farmers</span> with the right knowledge, at the right time, in their own language.
            </p>
          </motion.div>
          <motion.div
            ref={visionRef}
            initial={{ opacity: 0, y: 40 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_32px_rgba(253,224,71,0.13)] border border-green-100 flex flex-col items-center"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🌟</span>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed text-center">
              A future where <span className="font-semibold text-green-800">every farmer</span>, in every village, uses technology to grow crops with <span className="font-semibold text-green-800">confidence</span>, <span className="font-semibold text-green-800">planning</span>, and <span className="font-semibold text-green-800">success</span>.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed text-center">
              We imagine a world where even the smallest farmer can use the power of AI to make <span className="font-semibold text-green-800">better decisions</span>, <span className="font-semibold text-green-800">reduce waste</span>, and <span className="font-semibold text-green-800">earn more</span> from farming.
            </p>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 lg:mb-32"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16"
          >
            <span className="inline-block bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">
              What Can You Do with FarmCare AI?
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ✅ Soil Testing: 
              </h3>
              <p className="text-gray-600">
                Check your soil and get tips to improve it.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ✅ Crop Recommendation:
              </h3>
              <p className="text-gray-600">
                Know the best crop for your land and season.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ✅ Farming Calendar (Coming Soon): 
              </h3>
              <p className="text-gray-600">
                Get reminders for sowing, watering, and harvesting.

              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ✅ Weather Updates(Coming Soon): 
              </h3>
              <p className="text-gray-600">
                Plan your work with real-time forecasts.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ✅ Plant Disease Detection (Coming Soon): 
              </h3>
              <p className="text-gray-600">
                 Upload plant photos and get help
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ✅ Yield Prediction (Coming Soon): 
              </h3>
              <p className="text-gray-600">
                Estimate your output before planting.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">
            💡 Why Use FarmCare AI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Easy to use on any mobile phone",
              "Available in English, Hindi, and Marathi",
              "Safe and private data",
              "Works well even with low internet",
              "Saves time, effort, and money",
              "Basic features are free for all farmers"
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">🌱</span>
                  <p className="text-gray-700 font-medium">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Who Can Use Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">
            👥 Who Can Use This App?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Farmers and their family members",
              "Krishi Mitras and field assistants",
              "Agricultural students and teachers",
              "Farm consultants and agri advisors"
            ].map((user, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4">
                  <span className="text-green-600 text-xl">👤</span>
                </div>
                <p className="text-center text-gray-700 font-medium">{user}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Who We Are Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-green-900 text-center mb-8">
            🤝 Who We Are
          </h2>
          <p className="text-gray-700 text-center text-lg mb-6">
            We are a team of students and developers who care deeply about agriculture and technology.
            We created FarmCare AI to support farmers with smart, simple, and reliable tools.
          </p>
          <blockquote className="text-center italic text-xl text-green-700 mb-8">
            "Even if the land is small, the farmer's dream is big. We want to support that dream."
          </blockquote>
          <p className="text-gray-700 text-center">
            We worked together to plan, design, build, and test this application with the aim of making farming smarter and simpler for everyone.
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">
            Our Expert Team
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
              name: "Vishal Golhar",
              role: "Project Lead, Frontend, Backend, Troubleshooting, API Management, AI/ML",
              email: "vishalgolhar10@gmail.com",
              resumeLink: "./resume/Vishal_Golhar_Resume.pdf"
              },
              {
              name: "Punam Channe",
              role: "Frontend, Backend",
              email: "punamchanne51@gmail.com",
              resumeLink: "./resume/PunamChanneResume.pdf"
              },
              {
              name: "Sagar Bawankule",
              role: "Frontend, Backend, AI/ML",
              email: "sagarbawankule333@gmail.com",
              resumeLink: "./resume/resumesagar.pdf"
              },
              {
              name: "Isha Bhole",
              role: "Frontend, Backend ",
              email: "ishabhole001@gmail.com",
              resumeLink: "./resume/ishabholeresume.pdf",
              },

            ].map((member, index) => (
              <div
              key={index}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition-all duration-300"
              >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-bold text-green-600">
                {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                {member.name}
              </h3>
              <p className="text-green-700 font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.specialty}</p>
              
              {/* Contact Links */}
              <div className="space-y-2">
                <button
                onClick={() => {
                  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(member.email)}`,'_blank','noopener');
                }}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
                >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Me
                </button>
                <a
                href={member.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors duration-200"
                >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
                </a>
              </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-green-900 mb-6">
            📞 Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform hover:scale-105 hover:bg-green-50 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl mb-4">📧</span>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Email Us</h3>
                <a href="mailto:contactfarmcareai@gmail.com" className="text-gray-700 hover:text-green-600 font-medium">
                  contactfarmcareai@gmail.com
                </a>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform hover:scale-105 hover:bg-green-50 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl mb-4">🌐</span>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Visit Our Website</h3>
                <a href="https://www.farmcareai.in" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600 font-medium">
                  www.farmcareai.in
                </a>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">🙌 Thank You!</h3>
            <p className="text-gray-700 mb-4">
              We built FarmCare AI for farmers like you.<br />
              Tell us what you need — we'll keep improving the app for your benefit.
            </p>
            <p className="text-xl text-green-700 font-semibold">
              "Let's grow smarter, together." 🌱
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
