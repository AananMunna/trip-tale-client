import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthProvider";
import { Dialog } from "@headlessui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from 'framer-motion';

const CommunityPage = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["allStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories");
      return res.data;
    },
  });

  const openStory = (index) => {
    setActiveStoryIndex(index);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
  };

  const handleShareClick = () => {
    if (!user) {
      navigate("/login");
    }
  };

  const nextStory = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-blue-500"></span>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load stories.
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-gray-800 dark:text-white">
      <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-gray-900 dark:text-white">
         Community Travel Stories
      </h2>

      {stories.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No stories available.</p>
      ) : (
        <div className="overflow-hidden">
  <div className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar px-2 pb-4">
    {stories.map((story, idx) => (
      <motion.div
        key={story._id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.1 }}
        viewport={{ once: true }}
        onClick={() => openStory(idx)}
        className="min-w-[300px] max-w-[320px] snap-start cursor-pointer bg-white dark:bg-neutral-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <div className="h-48 w-full relative">
          <img
            src={story.images?.[0]}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={story.userPhoto}
              alt={story.userName}
              className="w-9 h-9 object-cover rounded-full border"
            />
            <div>
              <p className="font-medium text-sm text-gray-800 dark:text-white">
                {story.userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-1">
            {story.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
            {story.text}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
</div>
      )}

      {activeStoryIndex !== null && (
        <Dialog open={true} onClose={closeStory} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
  <Dialog.Panel className="relative w-full max-w-4xl md:h-[85vh] h-[95vh] mx-auto bg-neutral-900 text-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-500 ease-in-out">

    {/* Left side – image carousel */}
    <div className="md:w-2/3 w-full h-1/2 md:h-full relative bg-black">
      <img
        src={stories[activeStoryIndex]?.images?.[0]}
        alt="story-img"
        className="w-full h-full object-cover"
      />
      <button
        onClick={closeStory}
        className="absolute top-4 right-4 text-white text-3xl font-bold hover:scale-110 transition"
      >
        &times;
      </button>
    </div>

    {/* Right side – story content */}
    <div className="md:w-1/3 w-full h-1/2 md:h-full overflow-y-auto p-5 space-y-4 bg-neutral-900">
      {/* User info */}
      <div className="flex items-center gap-3">
        <img
          src={stories[activeStoryIndex].userPhoto}
          alt={stories[activeStoryIndex].userName}
          className="w-10 h-10 rounded-full border object-cover"
        />
        <div>
          <p className="font-semibold">{stories[activeStoryIndex].userName}</p>
          <p className="text-sm text-gray-400">
            {new Date(stories[activeStoryIndex].createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Title & Text */}
      <h3 className="text-2xl font-bold">{stories[activeStoryIndex].title}</h3>
      <p className="text-sm text-gray-300">{stories[activeStoryIndex].text}</p>

      {/* Thumbnails (if more images) */}
      {stories[activeStoryIndex].images?.length > 1 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {stories[activeStoryIndex].images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              className="w-full h-28 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center pt-5">
        <FacebookShareButton
          url={window.location.href}
          quote={stories[activeStoryIndex].title}
          hashtag="#TravelStory"
          onClick={handleShareClick}
          disabled={!user}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
            !user
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <FacebookIcon size={24} round />
          Share
        </FacebookShareButton>

        <div className="flex gap-2">
          <button
            onClick={prevStory}
            disabled={activeStoryIndex === 0}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full disabled:opacity-30"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextStory}
            disabled={activeStoryIndex === stories.length - 1}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full disabled:opacity-30"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  </Dialog.Panel>
</Dialog>

      )}
    </section>
  );
};

export default CommunityPage;
