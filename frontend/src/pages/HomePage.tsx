// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// <<<<<<< main
// import { Leaf, CloudRain, ShoppingCart, Sun, BarChart, ShieldCheck, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
// import Navbar from "../components/Navbar";
// =======
// import { Leaf, CloudRain, ShoppingCart, Sun, BarChart, ShieldCheck, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
// >>>>>>> main

// // TypeScript interface for ServiceCard props
// interface ServiceCardProps {
//   Icon: React.ElementType;
//   title: string;
//   description: string;
//   delay: number;
// }

// const schemes = [
//   { title: "PM Kisan Yojana", description: "A financial support scheme for farmers providing direct income support.", date: "Feb 15, 2025", link: "https://pmkisan.gov.in/" },
//   { title: "Soil Health Card", description: "Get your soil tested and receive recommendations to improve productivity.", date: "Jan 30, 2025", link: "https://soilhealth.dac.gov.in/" },
//   { title: "Agri-Insurance", description: "Protect your crops against natural calamities and price fluctuations.", date: "Dec 25, 2024", link: "https://pmfby.gov.in/" },
// ];

// function HomePage() {
//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);
// <<<<<<< main
//   const [showVideo, setShowVideo] = useState(true);
//   const [autoSlidePaused] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false); // New state for scroll-to-top button
// =======
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [autoSlidePaused, setAutoSlidePaused] = useState(false);
// >>>>>>> main

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % schemes.length);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + schemes.length) % schemes.length);
//   };

//   // Auto-slide for schemes
//   useEffect(() => {
//     if (autoSlidePaused) return;
    
//     const slideInterval = setInterval(() => {
//       handleNext();
//     }, 3000);
    
//     return () => clearInterval(slideInterval);
//   }, [currentIndex, autoSlidePaused]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const heroHeight = window.innerHeight;
//       const scrollPosition = window.scrollY;
      
// <<<<<<< main
//       // Show video only when at top, with smoother transition
//       setShowVideo(scrollY < windowHeight * 0.6); // Reduced threshold 

//       // Show scroll-to-top button when scrolled down
//       setShowScrollTop(scrollY > windowHeight);
// =======
//       setNavSolid(scrollPosition > heroHeight * 0.8);
// >>>>>>> main
//     };
    
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 animate-fadeIn">
// <<<<<<< main
//         {/* Navbar */}
//         <Navbar transparent={true} />
// =======
//         {/* Responsive Navbar */}
//         <motion.header
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${navSolid
//               ? "bg-gradient-to-r from-green-800/95 to-green-900/95 shadow-lg backdrop-blur-md"
//               : "bg-transparent"
//             }`}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center py-2">
//               {/* Logo */}
//               <motion.div
//                 className="flex items-center gap-3"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6 }}
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <a href="/" className="relative">
//                   <img
//                     src="/images/mainlogo.png"
//                     className="h-16 sm:h-20 w-auto relative z-10 drop-shadow-lg cursor-pointer"
//                     alt="FarmCare Logo"
//                   />
//                 </a>
//               </motion.div>

//               {/* Desktop Navigation */}
//               <nav className="hidden md:flex self-center">
//                 <ul className="flex space-x-4 lg:space-x-6 text-base lg:text-lg font-medium text-white">
//                   {[
//                     { name: "Home", path: "/" },
//                     { name: "Services", path: "#" },
//                     { name: "Contact us", path: "/contact" },
//                     { name: "About us", path: "/about" }
//                   ].map((item) => (
//                     <motion.li
//                       key={item.name}
//                       whileHover={{ scale: 1.1, y: -2 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <a href={item.path} className="hover:text-green-300 transition-colors duration-300">
//                         {item.name}
//                       </a>
//                     </motion.li>
//                   ))}
//                   <motion.li whileHover={{ scale: 1.05 }}>
//                     <button
//                       onClick={() => navigate("/signin")}
//                       className="bg-white text-green-800 px-3 py-1 rounded-full hover:bg-green-100 transition-colors text-sm lg:text-base"
//                     >
//                       Login
//                     </button>
//                   </motion.li>
//                   <motion.li whileHover={{ scale: 1.05 }}>
//                     <button
//                       onClick={() => navigate("/signup")}
//                       className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-400 transition-colors text-sm lg:text-base"
//                     >
//                       Sign Up
//                     </button>
//                   </motion.li>
//                 </ul>
//               </nav>

//               {/* Mobile Menu Button */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="h-6 w-6 text-white" />
//                 ) : (
//                   <Menu className="h-6 w-6 text-white" />
//                 )}
//               </motion.button>
//             </div>

//             {/* Mobile Navigation Menu */}
//             <motion.div
//               initial={false}
//               animate={{
//                 height: isMobileMenuOpen ? 'auto' : 0,
//                 opacity: isMobileMenuOpen ? 1 : 0
//               }}
//               transition={{ duration: 0.3, ease: 'easeInOut' }}
//               className="md:hidden overflow-hidden bg-green-800/95 backdrop-blur-md rounded-b-lg"
//             >
//               <div className="px-4 py-4 space-y-3">
//                 {[
//                   { name: "Home", path: "/" },
//                   { name: "Services", path: "#" },
//                   { name: "Contact us", path: "/contact" },
//                   { name: "About us", path: "/about" }
//                 ].map((item) => (
//                   <motion.a
//                     key={item.name}
//                     href={item.path}
//                     whileHover={{ x: 5 }}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="block text-white hover:text-green-300 transition-colors duration-300 py-2 border-b border-green-700 last:border-b-0"
//                   >
//                     {item.name}
//                   </motion.a>
//                 ))}
                
//                 <div className="pt-4 space-y-3">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                       navigate("/signin");
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="w-full bg-white text-green-800 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors font-medium"
//                   >
//                     Login
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                       navigate("/signup");
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400 transition-colors font-medium"
//                   >
//                     Sign Up
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.header>
// >>>>>>> main

//         {/* Mobile Menu Backdrop */}
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-40 md:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//         )}

//         {/* Hero Section */}
//         <div className="relative w-full h-screen">
//           <video autoPlay loop muted className="w-full h-full object-cover">
//             <source src="/videoplayback.mp4" type="video/mp4" />
//           </video>

//           <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-800/60 to-black/80">
//             {/* Animated particles effect */}
//             <div className="absolute inset-0 overflow-hidden">
//               {[...Array(20)].map((_, i) => (
//                 <motion.div 
//                   key={i}
//                   className="absolute rounded-full bg-white/20"
//                   style={{
//                     width: Math.random() * 8 + 3 + 'px',
//                     height: Math.random() * 8 + 3 + 'px',
//                     left: Math.random() * 100 + '%',
//                     top: Math.random() * 100 + '%',
//                   }}
//                   animate={{
//                     y: [0, -(Math.random() * 100 + 50)],
//                     opacity: [0, 0.8, 0],
//                   }}
//                   transition={{
//                     duration: Math.random() * 5 + 10,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                     delay: Math.random() * 5,
//                   }}
//                 />
//               ))}
//             </div>
            
//             <div className="flex flex-col h-full">
//               {/* Left side decorative element */}
//               <motion.div 
//                 className="absolute left-0 top-1/2 -translate-y-1/2 h-64 w-2 bg-gradient-to-b from-green-300/0 via-green-300/80 to-green-300/0 rounded-r-full"
//                 animate={{ 
//                   height: [200, 300, 200],
//                   opacity: [0.4, 0.8, 0.4] 
//                 }}
//                 transition={{ 
//                   duration: 8, 
//                   repeat: Infinity,
//                   repeatType: "reverse" 
//                 }}
//               />
              
//               {/* Right side decorative element */}
//               <motion.div 
//                 className="absolute right-0 top-1/3 h-32 w-2 bg-gradient-to-b from-green-400/0 via-green-400/60 to-green-400/0 rounded-l-full"
//                 animate={{ 
//                   height: [120, 200, 120],
//                   opacity: [0.3, 0.7, 0.3] 
//                 }}
//                 transition={{ 
//                   duration: 6, 
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                   delay: 2 
//                 }}
//               />
              
//               {/* Hero content container */}
//               <motion.div
//                 className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center h-full text-white"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 1.2 }}
//               >
//                 {/* Text content - left side */}
//                 <motion.div 
//                   className="md:w-1/2 text-left md:pr-10"
//                   initial={{ opacity: 0, x: -30 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 1, delay: 0.3 }}
//                 >
//                   <motion.span 
//                     className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm mb-4"
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7, delay: 0.5 }}
//                   >
//                     THE FUTURE OF FARMING
//                   </motion.span>
                  
//                   <motion.h1
//                     className="text-5xl sm:text-7xl font-black tracking-tight mb-2"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7, delay: 0.6 }}
//                   >
//                     <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-white">
//                       Smart Farming,
//                     </span>
//                     <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-white mt-1">
//                       Smarter Choices
//                     </span>
//                   </motion.h1>
                  
//                   <motion.p
//                     className="text-lg text-green-100/90 mt-4 max-w-md"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.8, delay: 0.9 }}
//                   >
//                     Leveraging AI and data science to revolutionize agriculture for a sustainable and productive future.
//                   </motion.p>
                  
//                   <motion.div 
//                     className="mt-8 flex flex-wrap gap-4"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.8, delay: 1.1 }}
//                   >
//                     <button 
//                       onClick={() => navigate("/signin")}
//                       className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg shadow-green-900/30 hover:shadow-green-900/40 transform hover:-translate-y-1 transition-all duration-300"
//                     >
//                       Get Started
//                     </button>
//                     <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300">
//                       Learn More
//                     </button>
//                   </motion.div>
//                 </motion.div>
                
//                 {/* Visual element - right side */}
//                 <motion.div 
//                   className="md:w-1/2 w-full relative mt-10 md:mt-0 flex items-center justify-center"
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 1, delay: 0.8 }}
//                 >
//                   <div className="relative w-64 h-64 md:w-80 md:h-80">
//                     {/* Abstract circular elements */}
//                     <motion.div 
//                       className="absolute inset-0 rounded-full border-2 border-green-400/30"
//                       animate={{ 
//                         rotate: 360,
//                         scale: [1, 1.05, 1]
//                       }}
//                       transition={{ 
//                         rotate: { duration: 20, repeat: Infinity, ease: "linear" },
//                         scale: { duration: 8, repeat: Infinity, repeatType: "reverse" }
//                       }}
//                     />
//                     <motion.div 
//                       className="absolute inset-4 rounded-full border-2 border-green-300/40"
//                       animate={{ rotate: -360 }}
//                       transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//                     />
//                     <motion.div 
//                       className="absolute inset-8 md:inset-10 rounded-full border-2 border-white/20"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//                     />
                    
//                     {/* Center image */}
//                     <motion.div 
//                       className="absolute inset-12 md:inset-14 rounded-full bg-gradient-to-br from-green-400/80 to-green-600/80 flex items-center justify-center overflow-hidden backdrop-blur-sm"
//                       animate={{ 
//                         boxShadow: [
//                           "0 0 20px 0px rgba(74, 222, 128, 0.4)", 
//                           "0 0 40px 10px rgba(74, 222, 128, 0.5)", 
//                           "0 0 20px 0px rgba(74, 222, 128, 0.4)"
//                         ]
//                       }}
//                     >
//                       <img 
//                         src="/images/leaf-tech.png" 
//                         alt="FarmCare Technology" 
//                         className="w-4/5 h-4/5 object-contain"
//                       />
//                     </motion.div>
                    
//                     {/* Orbiting elements with simpler structure */}
//                     {[0, 120, 240].map((degree, i) => (
//                       <motion.div
//                         key={i}
//                         className="absolute rounded-full overflow-hidden"
//                         style={{
//                           width: "30px",
//                           height: "30px",
//                           backgroundColor: "rgba(74, 222, 128, 0.7)",
//                           left: "50%", 
//                           top: "50%",
//                           marginLeft: "-12px",
//                           marginTop: "-12px"
//                         }}
//                         animate={{
//                           x: Math.cos(degree * Math.PI / 180) * 120,
//                           y: Math.sin(degree * Math.PI / 180) * 120,
//                         }}
//                       />
//                     ))}

//                     {/* Additional orbiting elements only shown on medium screens and up */}
//                     {[60, 180, 300].map((degree, i) => (
//                       <motion.div
//                         key={i + 3}
//                         className="absolute rounded-full overflow-hidden hidden md:block"
//                         style={{
//                           width: "30px",
//                           height: "30px",
//                           backgroundColor: "rgba(74, 222, 128, 0.7)",
//                           left: "50%", 
//                           top: "50%",
//                           marginLeft: "-15px",
//                           marginTop: "-15px"
//                         }}
//                         animate={{
//                           x: Math.cos(degree * Math.PI / 180) * 150,
//                           y: Math.sin(degree * Math.PI / 180) * 150,
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </motion.div>
//               </motion.div>
//             </div>
//           </div>
//         </div>

//         {/* Overview Section */}
//         <div className="bg-white py-16 relative">
//           <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
//             {/* Image Section */}
//             <motion.div
//               className="md:w-1/2 relative flex justify-center items-center"
//               whileInView={{ opacity: 1, x: 0, scale: 1 }}
//               initial={{ opacity: 0, x: -50, scale: 0.9 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: false }}
//             >
//               {/* Floating decorative elements */}
//               <motion.div
//                 className="absolute -right-4 top-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full z-0 opacity-60 blur-sm"
//                 animate={{
//                   scale: [1, 1.2, 1],
//                   y: [0, -10, 0]
//                 }}
//                 transition={{
//                   duration: 5,
//                   repeat: Infinity,
//                   repeatType: "reverse"
//                 }}
//               />

//               <motion.div
//                 className="absolute -left-2 bottom-10 w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full z-0 opacity-60 blur-sm"
//                 animate={{
//                   scale: [1, 1.3, 1],
//                   y: [0, 10, 0]
//                 }}
//                 transition={{
//                   duration: 4,
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                   delay: 1
//                 }}
//               />

//               {/* The image with animations */}
//               <motion.div
//                 className="relative z-10 w-[90%] h-auto overflow-hidden rounded-xl"
//                 whileHover={{ scale: 1.03 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//               >
//                 <motion.img
//                   src="/images/overviewimage.png"
//                   alt="Overview"
//                   className="w-full h-auto object-cover rounded-xl"
//                   initial={{ scale: 1.1 }}
//                   animate={{
//                     scale: [1, 1.02, 1],
//                     rotateZ: [0, 0.5, 0]
//                   }}
//                   transition={{
//                     duration: 8,
//                     repeat: Infinity,
//                     repeatType: "reverse"
//                   }}
//                   style={{
//                     boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
//                     filter: "contrast(1.05) brightness(1.05)"
//                   }}
//                 />

//                 {/* Clean, subtle border instead of background color */}
//                 <div className="absolute inset-0 border-2 border-gray-200 rounded-xl" />

//                 {/* Subtle dot pattern overlay for texture */}
//                 <div
//                   className="absolute inset-0 opacity-10"
//                   style={{
//                     backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
//                     backgroundSize: "20px 20px"
//                   }}
//                 />
//               </motion.div>
//             </motion.div>

//             {/* Text Section */}
//             <motion.div
//               className="md:w-1/2 md:pl-8 mt-6 md:mt-0 text-black text-left"
//               whileInView={{ opacity: 1, x: 0, scale: 1 }}
//               initial={{ opacity: 0, x: 50, scale: 0.9 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: false }}
//             >
//               <motion.div
//                 className="inline-block mb-8"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6 }}
//                 viewport={{ once: false }}
//               >
//                 <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">OUR OFFERINGS</span>
//               </motion.div>

//               <motion.p
//                 className="mt-4 text-xl sm:text-2xl leading-relaxed"
//                 style={{ fontFamily: "'Roboto Slab', serif" }}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 viewport={{ once: false }}
//               >
//                 FarmCare AI empowers farmers with innovative solutions - from
//                 <span className="px-1.5 py-0.5 mx-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded">AI insights</span>
//                 and <span className="px-1.5 py-0.5 mx-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded">smart resource management</span> to
//                 <span className="px-1.5 py-0.5 mx-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded">market access</span>.
//                 Our platform optimizes farming operations, reducing costs while significantly boosting productivity.
//               </motion.p>
//             </motion.div>
//           </div>
//         </div>

//         {/* Services Section */}
//         <div id="services"
//           className="relative pt-0 pb-16 text-black"
//           style={{
//             background: "linear-gradient(to bottom, white, #6bcd8af5 var(--tw-gradient-to-position))"
//           }}
//         >
//           {/* Curved Top */}
//           <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
//             <svg
//               className="relative block w-full h-24"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 1440 100"
//               preserveAspectRatio="none"
//             >
//               <path
//                 fill="#ffffff"
//                 d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"
//               />
//             </svg>
//           </div>

//           {/* Services Content */}
//           <div className="relative z-10 max-w-7xl mx-auto px-4 text-center pt-24">
//             <motion.div
//               className="inline-block mb-8"
//               initial={{ opacity: 0, scale: 0.8 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: false }}
//             >
//               <span className="px-4 py-1 bg-white text-[#4b9d6af5] rounded-full text-sm font-medium">OUR OFFERINGS</span>
//             </motion.div>

//             <motion.h2
//               className="text-4xl font-bold bg-gradient-to-r from-[#4b9d6af5] to-[#258759f5] bg-clip-text text-transparent"
//               initial={{ opacity: 0, y: -30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: false }}
//             >
//               Smart Farming Services
//             </motion.h2>

//             <motion.p
//               className="text-lg mt-3 text-gray-600 max-w-2xl mx-auto"
//               initial={{ opacity: 0, y: -20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               viewport={{ once: false }}
//             >
//               Enhancing agriculture with cutting-edge technology and data-driven insights
//             </motion.p>

//             <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[
//                 { Icon: Leaf, title: "Treatment Plans", description: "Get recommendations based on weather, soil, and crop data." },
//                 { Icon: CloudRain, title: "Soil Testing", description: "Optimize water usage, fertilizers, and other resources effectively." },
//                 { Icon: ShoppingCart, title: "Market Insights", description: "Connect directly with buyers and maximize profits." },
//                 { Icon: Sun, title: "Yield Prediction", description: "Stay updated with real-time weather forecasts for better planning." },
//                 { Icon: BarChart, title: "Crop Recommendations", description: "Use AI to predict crop yields and plan for the best outcomes." },
//                 { Icon: ShieldCheck, title: "Disease Detection", description: "Detect crop diseases early with AI-powered image analysis." }
//               ].map((service, index) => (
//                 <ServiceCard key={index} Icon={service.Icon} title={service.title} description={service.description} delay={index * 0.2} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Schemes Section */}
//         <div id="schemes" className="py-20 flex flex-col items-center text-black bg-gradient-to-b from-green-50 to-white">
//           <motion.div
//             className="inline-block mb-3"
//             initial={{ opacity: 0, scale: 0.8 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.2 }}
//             viewport={{ once: false }}
//           >
//             <span className="px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">GOVERNMENT INITIATIVES</span>
//           </motion.div>

//           <h2 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
//             Latest Farming Schemes
//           </h2>

//           <p className="text-lg mt-2 text-gray-600 max-w-2xl text-center">
//             Stay updated with the newest initiatives designed to benefit farmers across the country
//           </p>

//           <div className="relative mt-12 flex items-center w-full max-w-3xl overflow-hidden">
//             {/* Left Arrow */}
//             <button
//               onClick={handlePrev}
//               className="absolute left-2 z-10 flex items-center justify-center w-10 h-10 bg-white text-green-800 rounded-full shadow-lg transition-all duration-300 border border-green-200 transform hover:scale-110"
//             >
//               <ChevronLeft size={24} />
//             </button>

//             {/* Sliding Scheme Cards with hover pause */}
//             <div 
//               className="w-full flex overflow-hidden rounded-xl shadow-lg"
//               onMouseEnter={() => setAutoSlidePaused(true)}
//               onMouseLeave={() => setAutoSlidePaused(false)}
//             >
//               <motion.div
//                 className="flex"
//                 initial={{ x: "0%" }}
//                 animate={{ x: `-${currentIndex * 100}%` }}
//                 transition={{ type: "spring", stiffness: 50 }}
//               >
//                 {schemes.map((scheme, index) => (
//                   <a
//                     key={index}
//                     href={scheme.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-full min-w-[100%] p-8 text-center bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
//                   >
//                     <div className="mx-auto w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center">
//                       <img src="/images/government-icon.svg" alt="Government Scheme" className="w-8 h-8" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-green-800">{scheme.title}</h3>
//                     <p className="text-gray-600 mt-3">{scheme.description}</p>
//                     <p className="text-xs mt-4 text-gray-500">📅 Published on: {scheme.date}</p>
//                     <div className="mt-5">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                         Learn More
//                       </span>
//                     </div>
//                   </a>
//                 ))}
//               </motion.div>
//             </div>

//             {/* Right Arrow */}
//             <button
//               onClick={handleNext}
//               className="absolute right-2 z-10 flex items-center justify-center w-10 h-10 bg-white text-green-800 rounded-full shadow-lg transition-all duration-300 border border-green-200 transform hover:scale-110"
//             >
//               <ChevronRight size={24} />
//             </button>
            
//             {/* Slide indicators */}
//             <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
//               {schemes.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentIndex(index)}
//                   className={`w-2 h-2 rounded-full transition-all ${
//                     index === currentIndex ? "bg-green-600 w-4" : "bg-green-300"
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="bg-gradient-to-b from-green-800 to-green-900 text-white pt-16 pb-8">
//           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

//             {/* About Section */}
//             <div>
//               <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start">
//                 <img src="/images/logo2.png" alt="FarmCare AI" className="h-8 w-auto mr-2" />
//                 FarmCare AI
//               </h3>
//               <p className="text-gray-300">
//                 Revolutionizing agriculture with AI-driven solutions for smarter farming.
//               </p>
//               <div className="mt-4 flex justify-center md:justify-start space-x-4">
//                 {/* Social icons */}
//                 {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
//                   <a key={social} href="#" className="text-white hover:text-green-300 transition-colors">
//                     <span className="sr-only">{social}</span>
//                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
//                       <span className="text-xs">{social.charAt(0).toUpperCase()}</span>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h3 className="text-2xl font-bold mb-4">🔗 Quick Links</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300">
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a 
//                     href="#" 
//                     onClick={(e) => {
//                       e.preventDefault();
//                       document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
//                     }}
//                     className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300"
//                   >
//                     Services
//                   </a>
//                 </li>
//                 <li>
//                   <a 
//                     href="#" 
//                     onClick={(e) => {
//                       e.preventDefault();
//                       document.getElementById("schemes")?.scrollIntoView({ behavior: "smooth" });
//                     }}
//                     className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300"
//                   >
//                     Schemes
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300">
//                     Contact
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Contact Section */}
//             <div>
//               <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
//               <p className="flex items-center justify-center md:justify-start gap-2 mb-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 <a href="mailto:contactfarmcareai@gmail.com" className="hover:text-green-300">contactfarmcareai@gmail.com</a>
//               </p>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="mt-12 text-center text-gray-400 text-sm border-t border-gray-700 pt-6 max-w-7xl mx-auto">
//             <p>&copy; {new Date().getFullYear()} FarmCare AI. All rights reserved.</p>
//             <div className="mt-2 flex justify-center space-x-4 text-xs">
//               <a href="#" className="hover:text-white">Privacy Policy</a>
//               <a href="#" className="hover:text-white">Terms of Service</a>
//               <a href="#" className="hover:text-white">Cookie Policy</a>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// }

// // Enhanced ServiceCard component
// const ServiceCard = ({ Icon, title, description, delay }: ServiceCardProps) => (
//   <motion.div
//     className="p-6 rounded-2xl shadow-xl bg-white text-black flex flex-col items-center text-center overflow-hidden relative group"
//     style={{
//       boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
//     }}
//     initial={{ opacity: 0, y: 50 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6, delay }}
//     viewport={{ once: false, amount: 0.2 }}
//     whileHover={{ y: -5 }}
//   >
//     <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>
//     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//       <Icon className="w-8 h-8 text-green-700" />
//     </div>
//     <h3 className="mt-1 font-bold text-xl">{title}</h3>
//     <p className="mt-2 text-gray-600">{description}</p>
//     <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
//   </motion.div>
// );

// export default HomePage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, CloudRain, ShoppingCart, Sun, BarChart, ShieldCheck, ChevronLeft, ChevronRight, ArrowUp, Menu, X } from "lucide-react";
import Navbar from "../components/Navbar";

// TypeScript interface for ServiceCard props
// interface ServiceCardProps {
//   Icon: React.ElementType;
//   title: string;
//   description: string;
//   delay: number;
// }

const schemes = [
  { title: "PM Kisan Yojana", description: "A financial support scheme for farmers providing direct income support.", date: "Feb 15, 2025", link: "https://pmkisan.gov.in/" },
  { title: "Soil Health Card", description: "Get your soil tested and receive recommendations to improve productivity.", date: "Jan 30, 2025", link: "https://soilhealth.dac.gov.in/" },
  { title: "Agri-Insurance", description: "Protect your crops against natural calamities and price fluctuations.", date: "Dec 25, 2024", link: "https://pmfby.gov.in/" },
];

function HomePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [autoSlidePaused, setAutoSlidePaused] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % schemes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + schemes.length) % schemes.length);
  };

  // Auto-slide for schemes
  useEffect(() => {
    if (autoSlidePaused) return;
    
    const slideInterval = setInterval(() => {
      handleNext();
    }, 3000);
    
    return () => clearInterval(slideInterval);
  }, [currentIndex, autoSlidePaused]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Show video only when at top, with smoother transition
      setShowVideo(scrollPosition < heroHeight * 0.6);

      // Show scroll-to-top button when scrolled down
      setShowScrollTop(scrollPosition > heroHeight);

      // Set navbar solid state
      setNavSolid(scrollPosition > heroHeight * 0.8);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 animate-fadeIn">
        {/* Navbar */}
        <Navbar transparent={true} />

        {/* Responsive Navbar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${navSolid
              ? "bg-gradient-to-r from-green-800/95 to-green-900/95 shadow-lg backdrop-blur-md"
              : "bg-transparent"
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

        {/* Hero Section */}
        <div className="relative w-full h-screen">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="/videoplayback.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-800/60 to-black/80">
            {/* Animated particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    width: Math.random() * 8 + 3 + 'px',
                    height: Math.random() * 8 + 3 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                  }}
                  animate={{
                    y: [0, -(Math.random() * 100 + 50)],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
            
            <div className="flex flex-col h-full">
              {/* Left side decorative element */}
              <motion.div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-64 w-2 bg-gradient-to-b from-green-300/0 via-green-300/80 to-green-300/0 rounded-r-full"
                animate={{ 
                  height: [200, 300, 200],
                  opacity: [0.4, 0.8, 0.4] 
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              {/* Right side decorative element */}
              <motion.div 
                className="absolute right-0 top-1/3 h-32 w-2 bg-gradient-to-b from-green-400/0 via-green-400/60 to-green-400/0 rounded-l-full"
                animate={{ 
                  height: [120, 200, 120],
                  opacity: [0.3, 0.7, 0.3] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2 
                }}
              />
              
              {/* Hero content container */}
              <motion.div
                className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center h-full text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              >
                {/* Text content - left side */}
                <motion.div 
                  className="md:w-1/2 text-left md:pr-10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <motion.span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                  >
                    THE FUTURE OF FARMING
                  </motion.span>
                  
                  <motion.h1
                    className="text-5xl sm:text-7xl font-black tracking-tight mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                  >
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-white">
                      Smart Farming,
                    </span>
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-white mt-1">
                      Smarter Choices
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    className="text-lg text-green-100/90 mt-4 max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    Leveraging AI and data science to revolutionize agriculture for a sustainable and productive future.
                  </motion.p>
                  
                  <motion.div 
                    className="mt-8 flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                  >
                    <button 
                      onClick={() => navigate("/signin")}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg shadow-green-900/30 hover:shadow-green-900/40 transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Get Started
                    </button>
                    <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300">
                      Learn More
                    </button>
                  </motion.div>
                </motion.div>
                
                {/* Visual element - right side */}
                <motion.div 
                  className="md:w-1/2 w-full relative mt-10 md:mt-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    {/* Abstract circular elements */}
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-green-400/30"
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 8, repeat: Infinity, repeatType: "reverse" }
                      }}
                    />
                    <motion.div 
                      className="absolute inset-4 rounded-full border-2 border-green-300/40"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute inset-8 md:inset-10 rounded-full border-2 border-white/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Center image */}
                    <motion.div 
                      className="absolute inset-12 md:inset-14 rounded-full bg-gradient-to-br from-green-400/80 to-green-600/80 flex items-center justify-center overflow-hidden backdrop-blur-sm"
                      animate={{ 
                        boxShadow: [
                          "0 0 20px 0px rgba(74, 222, 128, 0.4)", 
                          "0 0 40px 10px rgba(74, 222, 128, 0.5)", 
                          "0 0 20px 0px rgba(74, 222, 128, 0.4)"
                        ]
                      }}
                    >
                      <img 
                        src="/images/leaf-tech.png" 
                        alt="FarmCare Technology" 
                        className="w-4/5 h-4/5 object-contain"
                      />
                    </motion.div>
                    
                    {/* Orbiting elements with simpler structure */}
                    {[0, 120, 240].map((degree, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full overflow-hidden"
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: "rgba(74, 222, 128, 0.7)",
                          left: "50%", 
                          top: "50%",
                          marginLeft: "-12px",
                          marginTop: "-12px"
                        }}
                        animate={{
                          x: Math.cos(degree * Math.PI / 180) * 120,
                          y: Math.sin(degree * Math.PI / 180) * 120,
                        }}
                      />
                    ))}

                    {/* Additional orbiting elements only shown on medium screens and up */}
                    {[60, 180, 300].map((degree, i) => (
                      <motion.div
                        key={i + 3}
                        className="absolute rounded-full overflow-hidden hidden md:block"
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: "rgba(74, 222, 128, 0.7)",
                          left: "50%", 
                          top: "50%",
                          marginLeft: "-15px",
                          marginTop: "-15px"
                        }}
                        animate={{
                          x: Math.cos(degree * Math.PI / 180) * 150,
                          y: Math.sin(degree * Math.PI / 180) * 150,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-white py-16 relative">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
            {/* Image Section */}
            <motion.div
              className="md:w-1/2 relative flex justify-center items-center"
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              {/* Floating decorative elements */}
              <motion.div
                className="absolute -right-4 top-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full z-0 opacity-60 blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />

              <motion.div
                className="absolute -left-2 bottom-10 w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full z-0 opacity-60 blur-sm"
                animate={{
                  scale: [1, 1.3, 1],
                  y: [0, 10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              />

              {/* The image with animations */}
              <motion.div
                className="relative z-10 w-[90%] h-auto overflow-hidden rounded-xl"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.img
                  src="/images/overviewimage.png"
                  alt="Overview"
                  className="w-full h-auto object-cover rounded-xl"
                  initial={{ scale: 1.1 }}
                  animate={{
                    scale: [1, 1.02, 1],
                    rotateZ: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  style={{
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                    filter: "contrast(1.05) brightness(1.05)"
                  }}
                />

                {/* Clean, subtle border instead of background color */}
                <div className="absolute inset-0 border-2 border-gray-200 rounded-xl" />

                {/* Subtle dot pattern overlay for texture */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Text Section */}
            <motion.div
              className="md:w-1/2 md:pl-8 mt-6 md:mt-0 text-black text-left"
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              <motion.div
                className="inline-block mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false }}
              >
                <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">OUR OFFERINGS</span>
              </motion.div>

              <motion.p
                className="mt-4 text-xl sm:text-2xl leading-relaxed"
                style={{ fontFamily: "'Roboto Slab', serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: false }}
              >
                FarmCare AI empowers farmers with innovative solutions - from
                <span className="px-1.5 py-0.5 mx-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded">AI insights</span>
                and <span className="px-1.5 py-0.5 mx-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded">smart resource management</span> to
                <span className="px-1.5 py-0.5 mx-0.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded">market access</span>.
                Our platform optimizes farming operations, reducing costs while significantly boosting productivity.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services"
          className="relative pt-0 pb-16 text-black"
          style={{
            background: "linear-gradient(to bottom, white, #6bcd8af5 var(--tw-gradient-to-position))"
          }}
        >
          {/* Curved Top */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
            <svg
              className="relative block w-full h-24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
            >
              <path
                fill="#ffffff"
                d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"
              />
            </svg>
          </div>

          {/* Services Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center pt-24">
            <motion.div
              className="inline-block mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
            >
              <span className="px-4 py-1 bg-white text-[#4b9d6af5] rounded-full text-sm font-medium">OUR OFFERINGS</span>
            </motion.div>

            <motion.h2
              className="text-4xl font-bold bg-gradient-to-r from-[#4b9d6af5] to-[#258759f5] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
            >
              Smart Farming Services
            </motion.h2>

            <motion.p
              className="text-lg mt-3 text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false }}
            >
              Enhancing agriculture with cutting-edge technology and data-driven insights
            </motion.p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { Icon: Leaf, title: "Treatment Plans", description: "Get recommendations based on weather, soil, and crop data." },
                { Icon: CloudRain, title: "Soil Testing", description: "Optimize water usage, fertilizers, and other resources effectively." },
                { Icon: ShoppingCart, title: "Market Insights", description: "Connect directly with buyers and maximize profits." },
                { Icon: Sun, title: "Yield Prediction", description: "Stay updated with real-time weather forecasts for better planning." },
                { Icon: BarChart, title: "Crop Recommendations", description: "Use AI to predict crop yields and plan for the best outcomes." },
                { Icon: ShieldCheck, title: "Disease Detection", description: "Detect crop diseases early with AI-powered image analysis." }
              ].map((service, index) => (
                <ServiceCard key={index} Icon={service.Icon} title={service.title} description={service.description} delay={index * 0.2} />
              ))}
            </div>
          </div>
        </div>

        {/* Schemes Section */}
        <div id="schemes" className="py-20 flex flex-col items-center text-black bg-gradient-to-b from-green-50 to-white">
          <motion.div
            className="inline-block mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: false }}
          >
            <span className="px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">GOVERNMENT INITIATIVES</span>
          </motion.div>

          <h2 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Latest Farming Schemes
          </h2>

          <p className="text-lg mt-2 text-gray-600 max-w-2xl text-center">
            Stay updated with the newest initiatives designed to benefit farmers across the country
          </p>

          <div className="relative mt-12 flex items-center w-full max-w-3xl overflow-hidden">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 z-10 flex items-center justify-center w-10 h-10 bg-white text-green-800 rounded-full shadow-lg transition-all duration-300 border border-green-200 transform hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Sliding Scheme Cards with hover pause */}
            <div 
              className="w-full flex overflow-hidden rounded-xl shadow-lg"
              onMouseEnter={() => setAutoSlidePaused(true)}
              onMouseLeave={() => setAutoSlidePaused(false)}
            >
              <motion.div
                className="flex"
                initial={{ x: "0%" }}
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              >
                {schemes.map((scheme, index) => (
                  <a
                    key={index}
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-w-[100%] p-8 text-center bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
                  >
                    <div className="mx-auto w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <img src="/images/government-icon.svg" alt="Government Scheme" className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800">{scheme.title}</h3>
                    <p className="text-gray-600 mt-3">{scheme.description}</p>
                    <p className="text-xs mt-4 text-gray-500">📅 Published on: {scheme.date}</p>
                    <div className="mt-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Learn More
                      </span>
                    </div>
                  </a>
                ))}
              </motion.div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2 z-10 flex items-center justify-center w-10 h-10 bg-white text-green-800 rounded-full shadow-lg transition-all duration-300 border border-green-200 transform hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Slide indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
              {schemes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-green-600 w-4" : "bg-green-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-green-800 to-green-900 text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

            {/* About Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start">
                <img src="/images/logo2.png" alt="FarmCare AI" className="h-8 w-auto mr-2" />
                FarmCare AI
              </h3>
              <p className="text-gray-300">
                Revolutionizing agriculture with AI-driven solutions for smarter farming.
              </p>
              <div className="mt-4 flex justify-center md:justify-start space-x-4">
                {/* Social icons */}
                {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                  <a key={social} href="#" className="text-white hover:text-green-300 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                      <span className="text-xs">{social.charAt(0).toUpperCase()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-2xl font-bold mb-4">🔗 Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300">
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("schemes")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300"
                  >
                    Schemes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-transform transform hover:translate-x-1 duration-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
              <p className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contactfarmcareai@gmail.com" className="hover:text-green-300">contactfarmcareai@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 text-center text-gray-400 text-sm border-t border-gray-700 pt-6 max-w-7xl mx-auto">
            <p>&copy; {new Date().getFullYear()} FarmCare AI. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4 text-xs">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Enhanced ServiceCard component
const ServiceCard = ({ Icon, title, description, delay }) => (
  <motion.div
    className="p-6 rounded-2xl shadow-xl bg-white text-black flex flex-col items-center text-center overflow-hidden relative group"
    style={{
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    }}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: false, amount: 0.2 }}
    whileHover={{ y: -5 }}
  >
    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-8 h-8 text-green-700" />
    </div>
    <h3 className="mt-1 font-bold text-xl">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
  </motion.div>
);

export default HomePage;