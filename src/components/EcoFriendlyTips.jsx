import React from "react";
import { motion } from "framer-motion";

const tips = [
  "Use refillable water bottles instead of plastic.",
  "Respect wildlife and never feed or disturb them.",
  "Stay in eco-certified accommodations.",
  "Support local businesses and artisans.",
  "Minimize waste, recycle where possible.",
  "Walk or cycle to explore nearby places.",
];

const EcoFriendlyTips = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-500">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-4xl font-extrabold mb-14 tracking-tight text-gray-900 dark:text-white"
      >
        🌿 Eco-Friendly Travel Tips
      </motion.h2>

      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {tips.map((tip, idx) => (
          <motion.li
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex items-start gap-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <span className="flex-shrink-0 mt-1 text-3xl text-green-500 dark:text-green-400 select-none">
              ✅
            </span>
            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
              {tip}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default EcoFriendlyTips;
