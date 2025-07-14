// HiddenGems.jsx
import React from "react";

const hiddenPlaces = [
  {
    name: "Nafa-khum Waterfall",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR15jrQ0YIHP-alshkjmzt6ErurGceEqBzgw&s",
    location: "Bandarban",
    description: "One of the largest waterfalls in Bangladesh, hidden deep within tribal lands.",
  },
  {
    name: "Ratargul Swamp Forest",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCEn1Br4fWYC4Z6v07wz5LwnqXDKwjn-sv2g&s",
    location: "Sylhet",
    description: "A magical freshwater swamp forest, best explored by boat.",
  },
  {
    name: "Moheshkhali Island",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVNFWW1HmHA0kdoFYUid7FbN_iPx-LUu_vcw&s",
    location: "Cox's Bazar",
    description: "An island rich with salt fields, Buddhist temples, and calm village life.",
  },
];

export default function HiddenGems() {
  return (
    <section className="px-6 py-20 max-w-7xl mx-auto bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white rounded-xl shadow-md transition-colors duration-500">
      <h2 className="text-center text-4xl font-extrabold mb-14 tracking-tight text-gray-900 dark:text-white">
        🗺️ Hidden Gems of Bangladesh
      </h2>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {hiddenPlaces.map((place, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
          >
            <img
              src={place.image}
              alt={place.name}
              className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">{place.name}</h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                📍 {place.location}
              </p>
              <p className="text-gray-800 dark:text-gray-300 text-sm">
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
