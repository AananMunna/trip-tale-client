import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full text-center"
      >
        {/* Large subtle "404" with light shadow */}
        <h1 className="text-[10rem] font-extrabold text-gray-300 dark:text-gray-700 select-none leading-none">
          404
        </h1>

        {/* Headline */}
        <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-4">
          Oops! This page can’t be found.
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-10 max-w-md mx-auto">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
          Let’s get you back on track.
        </p>

        {/* Minimal Apple-style button with subtle hover */}
        <Link
          to="/"
          className="inline-block rounded-md border border-gray-300 dark:border-gray-700 px-8 py-3 text-gray-900 dark:text-white text-lg font-medium
            transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
