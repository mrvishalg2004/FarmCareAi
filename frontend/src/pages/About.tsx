// About.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function About() {
  const navigate = useNavigate();
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavSolid(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navbar */}
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
      <div className="pt-24 px-4">
        {/* Content will be added later */}
      </div>
    </div>
  );
}

export default About;
