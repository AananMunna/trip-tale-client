import { motion } from "framer-motion";

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1.6,
      ease: "linear",
    },
  },
};

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-t-transparent border-cyan-500 dark:border-cyan-400"
        variants={spinnerVariants}
        animate="animate"
      />
    </div>
  );
};

export default LoadingSpinner;
