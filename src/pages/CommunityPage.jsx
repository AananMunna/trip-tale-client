import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { useContext } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../context/AuthProvider';

const CommunityPage = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch all stories
const { data: stories = [], isLoading, isError } = useQuery({
  queryKey: ['allStories'],
  queryFn: async () => {
    const res = await axiosSecure.get('/stories');
    return res.data;
  }
});


  const handleShareClick = () => {
    if (!user) {
      navigate('/login');
    }
  };

  if (isLoading) return <p>Loading stories...</p>;
  if (isError) return <p>Failed to load stories.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 py-12">
      <h2 className="text-3xl font-bold mb-6 text-emerald-600">Community Stories</h2>
      {stories.length === 0 && <p>No stories to show.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{story.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {story.text.length > 150 ? story.text.slice(0, 150) + '...' : story.text}
            </p>
            <div className="flex gap-2 overflow-x-auto mb-4">
              {story.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`story-img-${idx}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
            <FacebookShareButton
              url={window.location.href}
              quote={story.title}
              hashtag="#TravelStory"
              onClick={handleShareClick}
              disabled={!user}
              className={`inline-flex items-center gap-2 ${
                !user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <FacebookIcon size={32} round />
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                Share on Facebook
              </span>
            </FacebookShareButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
