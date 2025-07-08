import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      onClick={() => setDarkMode((prev) => !prev)}
      className="relative w-16 h-9 flex items-center px-1 rounded-full bg-gray-200 dark:bg-gray-800 shadow-inner border border-gray-300/50 dark:border-white/10 backdrop-blur-md transition-colors duration-300"
      title="Toggle Theme"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md ${
          darkMode
            ? "bg-gray-900 text-yellow-400 ml-auto"
            : "bg-yellow-400 text-gray-900"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaMoon />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
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
