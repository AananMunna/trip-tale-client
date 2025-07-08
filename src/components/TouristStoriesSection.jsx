// TouristStoriesSection.jsx
import React from "react";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { useNavigate } from "react-router";

const TouristStoriesSection = () => {
  const navigate = useNavigate();

  const isLoggedIn = true; // Replace with actual auth logic

  const stories = [
    {
      id: 1,
      title: "Mystic Sundarbans Adventure",
      description: "Exploring the lush mangroves and spotting Royal Bengal Tigers was a thrilling experience!",
      image: "https://source.unsplash.com/featured/?sundarbans",
      url: "https://example.com/story/1",
    },
    {
      id: 2,
      title: "Tea Garden Tranquility",
      description: "The peace and green of Sylhet’s tea gardens were like therapy to my soul.",
      image: "https://source.unsplash.com/featured/?sylhet",
      url: "https://example.com/story/2",
    },
    {
      id: 3,
      title: "Dhaka City Wonders",
      description: "From the Lalbagh Fort to the bustling New Market, Dhaka is vibrant and alive!",
      image: "https://source.unsplash.com/featured/?dhaka",
      url: "https://example.com/story/3",
    },
    {
      id: 4,
      title: "Hill Tracks of Bandarban",
      description: "Hiking through Nilgiri hills and meeting the tribal communities was unforgettable.",
      image: "https://source.unsplash.com/featured/?bandarban",
      url: "https://example.com/story/4",
    },
  ];

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 rounded-xl shadow-md">
      <h2 className="text-4xl font-extrabold text-center mb-12 tracking-tight">
        📝 Tourist Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={story.image}
              alt={story.title}
              className="h-56 w-full object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold">{story.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {story.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                {isLoggedIn ? (
                  <FacebookShareButton
                    url={story.url}
                    quote={story.title}
                    className="flex items-center gap-2"
                  >
                    <FacebookIcon size={32} round />
                    <span className="text-sm font-medium">Share</span>
                  </FacebookShareButton>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Login to Share
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/stories")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          View All Stories
        </button>
      </div>
    </section>
  );
};

export default TouristStoriesSection;
