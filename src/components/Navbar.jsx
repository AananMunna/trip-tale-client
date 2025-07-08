import { useContext, useState, useEffect, useRef } from "react";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeContext";
import ProfileDropdown from "./ProfileDropdown";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggleButton";

export default function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);
  const { user } = useContext(AuthContext);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const navLinks = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/community", label: "Community" },
    { to: "/about", label: "About Us" },
    { to: "/trips", label: "Trips" },
  ];

  useEffect(() => {
    function handleScroll() {
      const rotation = Math.min(window.scrollY / 5, 360);
      setScrollRotation(rotation);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="top-0 left-0 right-0 z-50 fixed backdrop-blur-md bg-gradient-to-r from-emerald-100/70 via-white/70 to-teal-100/70 dark:from-gray-900/80 dark:via-black/60 dark:to-gray-900/80 border-b border-white/20 dark:border-gray-700 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-teal-700 dark:text-emerald-300 tracking-wide">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }}
          >
            🌍
          </motion.span>
          <span className="">TripTale</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 tracking-wide shadow-sm backdrop-blur-md
                ${
                  isActive
                    ? "bg-emerald-500 text-white dark:text-gray-900"
                    : "text-gray-800 dark:text-gray-100 hover:bg-emerald-100/50 dark:hover:bg-emerald-700/30"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          {user ? (
            <ProfileDropdown user={user} />
          ) : (
            <div className="hidden md:flex gap-3">
              <NavLink
                to="/login"
                className="px-5 py-2 rounded-full bg-teal-600 text-white hover:scale-105 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-5 py-2 rounded-full border border-teal-600 text-teal-600 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-800 transition"
              >
                Register
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-full text-teal-700 dark:text-white hover:bg-teal-100 dark:hover:bg-teal-800"
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden px-6 pt-4 pb-6 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-b-xl shadow-inner"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-teal-100 dark:hover:bg-teal-700/40"
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="flex flex-col gap-2 mt-3">
                <NavLink to="/login" className="px-4 py-2 text-center bg-teal-600 text-white rounded-full">Login</NavLink>
                <NavLink to="/register" className="px-4 py-2 text-center border border-teal-600 text-teal-600 dark:text-teal-300 rounded-full">Register</NavLink>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
