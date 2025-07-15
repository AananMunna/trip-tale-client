// TouristStoriesSection.jsx
import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Dialog } from "@headlessui/react";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthProvider";

const TouristStoriesSection = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["randomStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stor?limit=4&random=true");
      return res.data;
    },
  });

  const openStory = (index) => setActiveStoryIndex(index);
  const closeStory = () => setActiveStoryIndex(null);

  const prevStory = () => {
    if (activeStoryIndex > 0) setActiveStoryIndex(activeStoryIndex - 1);
  };

  const nextStory = () => {
    if (activeStoryIndex < stories.length - 1)
      setActiveStoryIndex(activeStoryIndex + 1);
  };

  const handleShareClick = () => {
    if (!user) navigate("/login");
  };

  if (isLoading)
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-[300px] flex justify-center items-center text-red-500">
        Failed to load stories. Please try again later.
      </div>
    );

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl transition-colors duration-300">
      <h2 className="text-4xl font-extrabold text-center mb-2 tracking-tight text-gray-900 dark:text-white">
        📝 Tourist Stories
      </h2>
      <p className="text-center mb-12 max-w-xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
        Real experiences shared by travelers. Get inspired and share your own journey!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stories.map((story, idx) => (
          <div
            key={story._id}
            onClick={() => openStory(idx)}
            className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300"
          >
            <img
              src={story.images[0] || `https://source.unsplash.com/featured/?travel,${story.title}`}
              alt={story.title}
              className="w-full h-44 object-cover rounded-t-xl"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                {story.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {story.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activeStoryIndex !== null && (
        <Dialog open={true} onClose={closeStory} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center bg-black/90 p-4">
            <Dialog.Panel className="relative w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg p-6 overflow-hidden">
              <button
                onClick={closeStory}
                className="absolute top-4 right-4 text-white text-3xl font-bold hover:scale-110 transition"
              >
                &times;
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={stories[activeStoryIndex].userPhoto}
                    alt={stories[activeStoryIndex].userName}
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">
                      {stories[activeStoryIndex].userName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(stories[activeStoryIndex].createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-3">
                  {stories[activeStoryIndex].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {stories[activeStoryIndex].text}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {stories[activeStoryIndex].images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`story-full-${i}`}
                      className="w-full h-64 object-cover rounded shadow"
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <FacebookShareButton
                    url={window.location.href}
                    quote={stories[activeStoryIndex].title + "\n\n" + stories[activeStoryIndex].text}
                    hashtag="#TravelStory"
                    onClick={handleShareClick}
                    disabled={!user}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      !user
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white transition"
                    }`}
                  >
                    <FacebookIcon size={28} round />
                    <span className="text-sm font-medium">Share on Facebook</span>
                  </FacebookShareButton>

                  <div className="flex gap-3">
                    <button
                      onClick={prevStory}
                      disabled={activeStoryIndex === 0}
                      className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextStory}
                      disabled={activeStoryIndex === stories.length - 1}
                      className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      <div className="mt-14 text-center">
        <button
          onClick={() => navigate("/community")}
          className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md"
        >
          View All Stories
        </button>
      </div>
    </section>
  );
};

export default TouristStoriesSection;
