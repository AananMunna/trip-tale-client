// TouristStoriesSection.jsx
import React from "react";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { motion } from "framer-motion";

const TouristStoriesSection = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["randomStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories?limit=4&random=true");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[300px] flex justify-center items-center text-red-500">
        Failed to load stories. Please try again later.
      </div>
    );
  }

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl  transition-colors duration-300">
      <h2 className="text-4xl font-extrabold text-center mb-2 tracking-tight text-gray-900 dark:text-white">
        📝 Tourist Stories
      </h2>
      <p className="text-center mb-12 max-w-xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
        Real experiences shared by travelers. Get inspired and share your own journey!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stories.map((story) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
          >
            <div className="h-44 overflow-hidden rounded-t-xl">
              {/* Show first image of images array or fallback image */}
              <img
                src={
                  story.images && story.images.length > 0
                    ? story.images[0]
                    : `https://source.unsplash.com/featured/?travel,${encodeURIComponent(story.title)}`
                }
                alt={story.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                {story.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-3">
                {story.text}
              </p>

              <div className="mt-4 flex items-center justify-between">
                {user ? (
                  <FacebookShareButton
                    url={window.location.origin + `/stories/${story._id}`}
                    quote={story.title}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition cursor-pointer"
                  >
                    <FacebookIcon size={32} round />
                    <span className="font-semibold text-sm select-none">Share</span>
                  </FacebookShareButton>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Login to Share
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <button
          onClick={() => navigate("/community")}
          className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md"
        >
          View All Stories
        </button>
      </div>
    </section>
  );
};

export default TouristStoriesSection;
