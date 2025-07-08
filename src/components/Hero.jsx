import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Lottie from "lottie-react";
import travelAnimation from "../assets/travel.json"; // Replace with a travel-themed animation

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-20 md:py-36 text-gray-900 dark:text-white transition-colors duration-500">
      {/* Glow Effects */}
      <div className="absolute top-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-cyan-400 dark:bg-cyan-600 opacity-10 blur-[120px] md:blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full bg-rose-400 dark:bg-rose-600 opacity-10 blur-[120px] md:blur-[160px] pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-16"
      >
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="text-center md:text-left space-y-7 max-w-xl"
        >
          <div className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-sm rounded-full mb-1">
            🧳 Discover Bangladesh with TripTale
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="inline-block bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 bg-clip-text text-transparent animate-gradient-x">
              Explore,
            </span>{" "}
            <span className="text-blue-600 dark:text-blue-400 underline decoration-wavy decoration-green-400 underline-offset-4">
              Experience,
            </span>{" "}
            <span className="inline-block text-pink-500 dark:text-pink-300">
              Enjoy.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Plan unforgettable journeys with local insights, authentic stories,
            and personalized packages. Let TripTale be your guide to adventure.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2"
          >
            <Link
              to="/trips"
              className="px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-lg hover:scale-[1.04] transition-transform duration-300"
            >
              Browse Trips
            </Link>
            <Link
              to="/guides"
              className="px-6 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-300 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Meet Our Guides
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
          className="w-[80%] max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0 hover:scale-[1.02] transition-transform duration-500"
        >
          <Lottie animationData={travelAnimation} loop={true} />
        </motion.div>
      </motion.div>

      {/* Scroll Down */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 dark:text-gray-300 animate-bounce">
        ↓ Scroll to discover
      </div>
    </section>
  );
}
