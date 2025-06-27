// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock, UserPlus, AlertCircle, User, Phone, MapPin, Crop } from 'lucide-react';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { auth } from '../lib/firebase';

// interface FormData {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   phone: string;
//   location: string;
//   farmSize: string;
// }

// function SignUp() {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     location: '',
//     farmSize: ''
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setIsLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       setIsLoading(false);
//       return;
//     }

//     if (!formData.name.trim()) {
//       setError('Name is required');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('Creating user account...');
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );

//       console.log('User created successfully, updating profile...');
//       // Update display name
//       await updateProfile(userCredential.user, {
//         displayName: formData.name
//       });

//       console.log('Account created successfully, redirecting...');
//       navigate('/dashboard');
//     } catch (error: unknown) {
//       console.error('Signup error:', error);
//       let errorMessage = 'Failed to create account';
      
//       // Handle specific Firebase errors
//       if (error && typeof error === 'object' && 'code' in error) {
//         const firebaseError = error as { code: string; message?: string };
//         switch (firebaseError.code) {
//           case 'auth/email-already-in-use':
//             errorMessage = 'An account with this email already exists';
//             break;
//           case 'auth/invalid-email':
//             errorMessage = 'Invalid email address';
//             break;
//           case 'auth/weak-password':
//             errorMessage = 'Password is too weak';
//             break;
//           case 'auth/network-request-failed':
//             errorMessage = 'Network error. Please check your connection';
//             break;
//           default:
//             errorMessage = firebaseError.message || 'Failed to create account';
//         }
//       }
      
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Join FarmCare AI and optimize your agricultural practices
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
//           {error && (
//             <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Enter your full name"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                 Phone Number (Optional)
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Phone className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Enter your phone number"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700">
//                 Location (Optional)
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <MapPin className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="location"
//                   name="location"
//                   type="text"
//                   value={formData.location}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Enter your location"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700">
//                 Farm Size (Optional)
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Crop className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <select
//                   id="farmSize"
//                   name="farmSize"
//                   value={formData.farmSize}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                 >
//                   <option value="">Select farm size</option>
//                   <option value="small">Small (&lt; 5 acres)</option>
//                   <option value="medium">Medium (5-20 acres)</option>
//                   <option value="large">Large (&gt; 20 acres)</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Create a password (min 6 characters)"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Confirm your password"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Creating Account...
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus className="h-5 w-5 mr-2" />
//                     Create Account
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Already have an account?</span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <button
//                 onClick={() => navigate('/signin')}
//                 className="w-full flex justify-center py-2 px-4 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
//               >
//                 Sign in instead
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
// import { useAuthStore } from '../store/authStore';

// function SignUp() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const signUp = useAuthStore((state) => state.signUp);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       await signUp(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Failed to create account');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Join SmartFarm AI and optimize your agricultural practices
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
//           {error && (
//             <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Create a password"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
//                 Confirm Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="confirm-password"
//                   name="confirm-password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   placeholder="Confirm your password"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
//               >
//                 <UserPlus className="h-5 w-5 mr-2" />
//                 Create Account
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Already have an account?</span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <button
//                 onClick={() => navigate('/signin')}
//                 className="w-full flex justify-center py-2 px-4 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
//               >
//                 Sign in instead
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  MapPin,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { signUp } = useAuthStore();

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
      setError("Email must contain '@'.");
      setIsLoading(false);
      return;
    }

    if (!/^\d+$/.test(mobile)) {
      setError("Mobile number must contain only digits.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== STARTING SIGNUP PROCESS ===");
      console.log("Creating account for:", email);
      await signUp(email, password);
      console.log("✅ Account created successfully");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account";

      if (error && typeof error === "object" && "message" in error) {
        const supabaseError = error as { message: string };
        if (supabaseError.message.includes("already registered")) {
          errorMessage = "An account with this email already exists";
        } else if (supabaseError.message.includes("invalid email")) {
          errorMessage = "Invalid email address";
        } else if (supabaseError.message.includes("weak password")) {
          errorMessage = "Password is too weak";
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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setLocation(data.display_name || "Location not found");
        },
        () =>
          setError("Failed to get location. Please enable location services.")
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navbar - Same as HomePage */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${navSolid
            ? "bg-gradient-to-r from-green-800 to-green-900 shadow-lg backdrop-blur-md"
            : "bg-gradient-to-r from-green-800 to-green-900 shadow-lg backdrop-blur-md"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-1">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <a href="/" className="relative">
              <div className="absolute inset-0/10 rounded-full blur-[1px]"></div>
              <img
                src="/images/mainlogo.png"
                className="h-20 w-auto relative z-10 drop-shadow-lg cursor-pointer"
                alt="FarmCare Logo"
              />
            </a>
          </motion.div>

          <nav className="self-center">
            <ul className="flex space-x-6 text-lg font-medium text-white">
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
                  <a href={item.path} className="hover:text-green-300 transition-colors duration-300">{item.name}</a>
                </motion.li>
              ))}
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => navigate("/signin")}
                  className="bg-white text-green-800 px-3 py-0.5 rounded-full hover:bg-green-100 transition-colors"
                >
                  Login
                </button>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-green-500 text-white px-3 py-0.5 rounded-full hover:bg-green-400 transition-colors"
                >
                  Sign Up
                </button>
              </motion.li>
            </ul>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 flex flex-col items-center px-4 sm:px-6 lg:px-8 min-h-screen">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-10 bg-white px-6 py-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md"
        >
        <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-6 text-center">
          Create an Account
        </h2>
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            {
              placeholder: "Enter Your Name",
              value: name,
              setter: setName,
              icon: (
                <User className="absolute left-3 top-3 text-purple-600" />
              ),
            },
            {
              placeholder: "Enter Your Email",
              value: email,
              setter: setEmail,
              icon: <Mail className="absolute left-3 top-3 text-blue-600" />,
            },
            {
              placeholder: "Enter Your Mobile Number",
              value: mobile,
              setter: setMobile,
              icon: (
                <Phone className="absolute left-3 top-3 text-orange-600" />
              ),
            },
            {
              placeholder: "Enter Your Password",
              value: password,
              setter: setPassword,
              icon: <Lock className="absolute left-3 top-3 text-red-600" />,
            },
            {
              placeholder: "Confirm Your Password",
              value: confirmPassword,
              setter: setConfirmPassword,
              icon: <Shield className="absolute left-3 top-3 text-gray-600" />,
            },
          ].map((input, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {input.icon}
              <input
                type={
                  input.placeholder.includes("Password") ? "password" : "text"
                }
                placeholder={input.placeholder}
                value={input.value}
                onChange={(e) => input.setter(e.target.value)}
                className="w-full pl-10 p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
                required
              />
            </motion.div>
          ))}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <MapPin className="absolute left-3 top-3 text-teal-600" />
            <input
              type="text"
              placeholder="Enter Your Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-12 p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
              required
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="absolute right-3 top-2 text-gray-600 hover:text-green-600 transition"
            >
              <MapPin className="w-6 h-6" />
            </button>
          </motion.div>
          <motion.button
            type="submit"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" /> Create Account
              </>
            )}
          </motion.button>
        </form>
        <div className="text-center mt-4 text-xs sm:text-sm text-gray-700 font-medium">
          Already have an account?{" "}
          <a href="/SignIn" className="text-blue-600 hover:underline">
            Login here
          </a>
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;