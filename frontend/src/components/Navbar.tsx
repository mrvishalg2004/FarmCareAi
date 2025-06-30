import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

// Custom hook to prevent body scrolling when menu is open
const usePreventBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Save current body style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden';
      // Re-enable scrolling when component unmounts
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
};

interface NavbarProps {
  transparent?: boolean;
  additionalLinks?: { title: string; path: string }[];
}

const Navbar = ({ transparent = true, additionalLinks = [] }: NavbarProps) => {
  const [navSolid, setNavSolid] = useState(!transparent);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use custom hook to prevent body scrolling when mobile menu is open
  usePreventBodyScroll(isMobileMenuOpen);

  // Effect for handling scroll transparency
  useEffect(() => {
    if (!transparent) {
      setNavSolid(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setNavSolid(scrollY > 100);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  // Effect for handling click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Effect for handling window resize to close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint in Tailwind
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Default navigation links
  const defaultLinks = [
    { title: "Home", path: "/" },
    { title: "Services", path: "#services" },
    { title: "Contact us", path: "#contact" },
    { title: "About us", path: "#about" }
  ];

  // Combine default links with any additional links passed as props
  const navLinks = [...defaultLinks, ...additionalLinks];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${
        navSolid
          ? "bg-gradient-to-r from-green-800 to-green-900 shadow-lg backdrop-blur-md"
          : "bg-transparent"
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
          <Link to="/" className="relative">
            <div className="absolute inset-0/10 rounded-full blur-[1px]"></div>
            <img
              src="/images/mainlogo.png"
              className="h-20 w-auto relative z-10 drop-shadow-lg"
              alt="FarmCare Logo"
            />
          </Link>
        </motion.div>

        <nav className="self-center flex items-center">
          <ul className="hidden md:flex space-x-6 text-lg font-medium text-white">
            {navLinks.map((item) => (
              <motion.li
                key={item.title}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={item.path} 
                  className="hover:text-green-300 transition-colors duration-300"
                >
                  {item.title}
                </Link>
              </motion.li>
            ))}
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => navigate("/signin")}
                className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-1.5 rounded-lg shadow-lg hover:shadow-green-400/20 transition-all duration-300"
              >
                Login
              </button>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => navigate("/signup")}
                className="bg-white text-green-700 border-2 border-green-500 px-4 py-1.5 rounded-lg shadow-lg hover:bg-green-50 hover:shadow-green-400/20 transition-all duration-300"
              >
                Sign Up
              </button>
            </motion.li>
          </ul>
          
          {/* Mobile menu button */}
          <motion.button 
            className="md:hidden text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg px-3 py-2 ml-4 shadow-md transition-all duration-200 focus:outline-none flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={isMobileMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 90 },
                closed: { rotate: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              )}
            </motion.span>
          </motion.button>
        </nav>
      </div>
      
      {/* Mobile menu dropdown with backdrop overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 bg-black z-40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ touchAction: 'none' }}
            />
            
            {/* Menu dropdown */}
            <div className="md:hidden fixed right-0 top-0 bottom-0 z-50 h-screen">
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                className={`flex flex-col h-full shadow-xl w-80 border-l border-gray-200 ${
                  navSolid
                    ? "bg-white"
                    : "bg-white bg-opacity-98 backdrop-blur-lg"
                }`}
              >
                <div className="flex flex-col h-full">
                  {/* Safe area for top status bar - especially on mobile */}
                  <div className="pt-safe-top"></div>
                  
                  {/* Close button at top right */}
                  <div className="flex justify-end px-4 pt-4">
                    <motion.button
                      className="text-green-800 hover:text-green-600 p-2 rounded-full hover:bg-green-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </motion.button>
                  </div>
                  
                  {/* Logo and Title in mobile menu */}
                  <div className="px-5 flex items-center mb-6 pb-4 border-b border-green-200">
                    <img 
                      src="/images/mainlogo.png" 
                      alt="FarmCare Logo" 
                      className="h-10 w-auto mr-3"
                    />
                    <h3 className="text-green-800 font-bold text-xl">FarmCare AI</h3>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto px-5"
                       style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                    <div className="space-y-2 py-2">
                      {navLinks.map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <Link
                            to={item.path}
                            className="flex items-center text-green-800 hover:text-green-600 hover:bg-green-50 transition-all duration-200 py-4 px-3 font-medium text-base border-b border-green-100 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {/* Icon based on menu item */}
                            {item.title === "Home" && (
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                              </svg>
                            )}
                            {item.title === "Services" && (
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                              </svg>
                            )}
                            {item.title === "Contact us" && (
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                              </svg>
                            )}
                            {item.title === "About us" && (
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                              </svg>
                            )}
                            {item.title}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 mt-auto pt-6 pb-12 border-t border-green-100 space-y-4 sticky bottom-0 bg-white">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        navigate("/signin");
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 w-full font-medium flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                      </svg>
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        navigate("/signup");
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-white text-green-700 border-2 border-green-500 px-4 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-green-50 transition-all duration-300 w-full font-medium flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                      </svg>
                      Sign Up
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
