import React from "react";
import { motion } from "framer-motion";

export default function OverviewSection() {
  return (
    <section className="relative overflow-hidden py-24 px-6 sm:px-10 md:px-20 bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Glow Effects */}
      <div className="absolute top-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-blue-400 dark:bg-blue-600 opacity-10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full bg-purple-400 dark:bg-purple-600 opacity-10 blur-[120px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl mx-auto text-center space-y-10"
      >
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Explore Sylhet & More with TripTale 🌍
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Dive into Bangladesh’s natural beauty—from tea terraces to serene hills.
            Let TripTale guide your journey, one story at a time.
          </p>
        </div>

        {/* Video Embed */}
        <div className="relative w-full aspect-video max-w-5xl mx-auto rounded-xl shadow-xl overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl"
            src="https://www.youtube-nocookie.com/embed/MJ25IaHelZw?rel=0&modestbranding=1"
            title="Exploring Sylhet Like Never Before"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>
    </section>
  );
}
