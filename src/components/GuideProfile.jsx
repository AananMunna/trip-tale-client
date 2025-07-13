import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { FaUserTie, FaEnvelope, FaClock } from "react-icons/fa";

export default function GuideProfile() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: guide, isPending, error } = useQuery({
    queryKey: ["guide", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?role=guide`);
      return res.data.find((g) => g._id === id);
    },
    staleTime: 5 * 60 * 1000,
  });

  // 🕓 Format join date
  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // 🕔 Time since (very basic)
  const timeAgo = (isoDate) => {
    const seconds = Math.floor((Date.now() - new Date(isoDate)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold text-gray-500 dark:text-gray-300">
        Loading guide profile...
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 dark:text-red-400 text-xl">
        Something went wrong or guide not found.
      </div>
    );
  }

  return (
    <section className="min-h-screen px-4 sm:px-10 py-40 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto  bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center gap-10"
      >
        {/* 📸 Photo */}
        <div className="flex-shrink-0 w-40 h-40 rounded-full overflow-hidden border-4 border-blue-300 dark:border-blue-600 shadow-lg">
          <img
            src={guide.photo}
            alt={guide.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 🧾 Info */}
        <div className="text-center md:text-left space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            <FaUserTie className="inline-block mr-2 text-blue-500" />
            {guide.name}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <FaEnvelope className="inline mr-2 text-green-500" />
            {guide.email}
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <FaClock className="inline mr-2 text-purple-500" />
            Joined: {formatDate(guide.createdAt)}
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Last Active: {timeAgo(guide.lastLogin)}
          </p>

          <span className="inline-block px-4 py-1 mt-2 text-sm rounded-full bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 font-semibold">
            Role: {guide.role}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
