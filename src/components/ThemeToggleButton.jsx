import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      onClick={() => setDarkMode((prev) => !prev)}
      title="Toggle Theme"
      whileTap={{ scale: 0.94 }}
      className={`relative w-[72px] h-[38px] flex items-center px-1 rounded-full 
        border transition-colors duration-300 
        ${
          darkMode
            ? "bg-gray-800 border-white/10 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.4)]"
            : "bg-gray-200 border-gray-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]"
        }`}
    >
      {/* Sliding Icon Bubble */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={`w-7 h-7 rounded-full flex items-center justify-center 
          shadow-md text-lg
          ${
            darkMode
              ? "ml-auto bg-gradient-to-br from-gray-900 to-gray-700 text-yellow-300"
              : "bg-gradient-to-br from-yellow-400 to-yellow-300 text-gray-800"
          }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ rotate: 180, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -180, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaMoon />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaSun />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
