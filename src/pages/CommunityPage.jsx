import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthProvider";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdventurePackages from "@/components/AdventurePackages";

const CommunityPage = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [filter, setFilter] = useState("");

  const {
    data: stories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories");
      return res.data;
    },
  });

  const openStory = (index) => setActiveStoryIndex(index);
  const closeStory = () => setActiveStoryIndex(null);

  const handleShareClick = () => {
    if (!user) navigate("/login");
  };

  const nextStory = () =>
    activeStoryIndex < filteredStories.length - 1 &&
    setActiveStoryIndex(activeStoryIndex + 1);
  const prevStory = () =>
    activeStoryIndex > 0 && setActiveStoryIndex(activeStoryIndex - 1);

  // Front-end filtering
  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(filter.toLowerCase()) ||
      story.userName.toLowerCase().includes(filter.toLowerCase()) ||
      story.text.toLowerCase().includes(filter.toLowerCase())
  );

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
      <h2 className="text-4xl font-extrabold text-center mb-6 tracking-tight">
        Community Travel Stories
      </h2>

      {/* Filter Input */}
      <div className="flex justify-center mb-8">
        <Input
          type="text"
          placeholder="Search by title, user, or text..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md w-full"
        />
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No stories match your filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredStories.map((story, idx) => (
            <Card
              key={story._id}
              onClick={() => openStory(idx)}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <CardHeader className="p-0 relative">
                <img
                  src={story.images?.[0]}
                  alt={story.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar>
                    <AvatarImage src={story.userPhoto} alt={story.userName} />
                    <AvatarFallback>{story.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{story.userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                  {story.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

{/* Modal */}
{activeStoryIndex !== null && (
  <div
    onClick={closeStory} // click outside closes
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-opacity duration-300"
  >
    <div
      onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
      className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] bg-neutral-900 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-neutral-700 transition-all duration-300"
    >
      {/* Left – Image */}
      <div className="md:w-2/3 w-full h-1/2 md:h-full relative">
        <img
          src={filteredStories[activeStoryIndex]?.images?.[0]}
          alt="story-img"
          className="w-full h-full object-cover transition-transform duration-150 hover:scale-[1.02]"
        />
        <button
          onClick={closeStory}
          className="absolute top-3 right-3 text-white text-3xl font-bold hover:text-red-500 transition-colors"
        >
          &times;
        </button>
      </div>

      {/* Right – Story Content */}
      <div className="md:w-1/3 w-full h-1/2 md:h-full overflow-y-auto p-5 flex flex-col justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage
              src={filteredStories[activeStoryIndex].userPhoto}
              alt={filteredStories[activeStoryIndex].userName}
            />
            <AvatarFallback>{filteredStories[activeStoryIndex].userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-white">{filteredStories[activeStoryIndex].userName}</p>
            <p className="text-sm text-gray-400">
              {new Date(filteredStories[activeStoryIndex].createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Title & Text */}
        <h3 className="text-2xl font-bold text-white">{filteredStories[activeStoryIndex].title}</h3>
        <p className="text-sm text-gray-300">{filteredStories[activeStoryIndex].text}</p>

        {/* Thumbnails */}
        {filteredStories[activeStoryIndex].images?.length > 1 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {filteredStories[activeStoryIndex].images.slice(1).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className="w-full h-24 object-cover rounded-lg transition-transform duration-150 hover:scale-[1.03]"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-5">
          <FacebookShareButton
            url={window.location.href}
            quote={filteredStories[activeStoryIndex].title}
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
            <Button
              onClick={prevStory}
              disabled={activeStoryIndex === 0}
              variant="outline"
              className="hover:bg-gray-700 hover:text-white transition"
            >
              <FaChevronLeft />
            </Button>
            <Button
              onClick={nextStory}
              disabled={activeStoryIndex === filteredStories.length - 1}
              variant="outline"
              className="hover:bg-gray-700 hover:text-white transition"
            >
              <FaChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      <div className="mt-5">
        <AdventurePackages />
      </div>
    </section>
  );
};

export default CommunityPage;
