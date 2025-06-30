import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, MapPin, Locate, LogIn, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from '../store/authStore';
import Navbar from "../components/Navbar";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

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
    <>
      {/* Navbar */}
      <Navbar transparent={false} />
      
      <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-32" style={{ backgroundColor: "rgb(202, 245, 202)" }}>
      {/* Animated SignIn Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white px-6 py-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md"
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
              <Locate className="w-6 h-6" />
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

          {/* Animated Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-4 text-xs sm:text-sm text-gray-700 font-medium"
        >
          Don't have an account?{" "}
          <a href="/SignUp" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
};

export default SignIn;
