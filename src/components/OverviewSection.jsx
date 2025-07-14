import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaUserFriends, FaRegLightbulb } from "react-icons/fa";

export default function OverviewSection() {
  const features = [
    {
      icon: <FaMapMarkedAlt className="text-3xl text-teal-500" />,
      title: "Hidden Scenic Spots",
      description:
        "Discover breathtaking places off the beaten path—carefully curated for peace-seekers and wanderers alike.",
    },
    {
      icon: <FaUserFriends className="text-3xl text-blue-500" />,
      title: "Local Travel Experts",
      description:
        "Get guided by locals who know every tea trail, village, and secret sunset point in Sylhet.",
    },
    {
      icon: <FaRegLightbulb className="text-3xl text-purple-500" />,
      title: "Personalized Itineraries",
      description:
        "Craft your own adventure. Whether solo or squad, we tailor your journey to your vibe and interests.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 px-6 sm:px-10 md:px-20 bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Glow Effects */}
      <div className="absolute top-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-blue-400 dark:bg-blue-600 opacity-10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full bg-purple-400 dark:bg-purple-600 opacity-10 blur-[120px] pointer-events-none z-0" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl mx-auto text-center space-y-10"
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-center mb-2 tracking-tight text-gray-900 dark:text-white">
            Explore Sylhet & More with TripTale 🌍
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
            Dive into Bangladesh’s natural beauty—from tea terraces to serene hills.
            Let TripTale guide your journey, one story at a time.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left shadow hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
