import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthProvider";
import { Dialog } from "@headlessui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
    <section className="max-w-7xl mx-auto px-4 py-30 text-gray-800 dark:text-white">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 dark:text-yellow-400">
        ✍️ Community Travel Stories
      </h2>

      {stories.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No stories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <div
              key={story._id}
              onClick={() => openStory(idx)}
              className="cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm p-4 hover:shadow-lg transition duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   navigate(`/guide/${story?.guideId}`);
                  // }}
                  src={story.userPhoto}
                  alt={story.userName}
                  className="w-10 h-10 object-cover rounded-full border cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{story.userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(story.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                {story.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {story.text.length > 150 ? `${story.text.slice(0, 150)}...` : story.text}
              </p>
              <div className="flex gap-2 overflow-x-auto rounded-md mb-4">
                {story.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`story-${i}`}
                    className="w-20 h-20 object-cover rounded border border-gray-300 dark:border-gray-600"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
                    // onClick={() => navigate(`/guide/${stories[activeStoryIndex]?.guideId}`)}
                    src={stories[activeStoryIndex].userPhoto}
                    alt={stories[activeStoryIndex].userName}
                    className="w-12 h-12 object-cover rounded-full border cursor-"
                  />
                  <div>
                    <p className="font-semibold">{stories[activeStoryIndex].userName}</p>
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
                    quote={stories[activeStoryIndex].title}
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
    </section>
  );
};

export default CommunityPage;
