// HiddenGems.jsx
import React from "react";
import { Link } from "react-router";

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
    <section className="max-w-7xl mx-auto px-6 py-20 text-gray-900 dark:text-white">
      <h2 className="text-center text-4xl font-extrabold mb-16 tracking-tight">
        🗺️ Hidden Gems of Bangladesh
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {hiddenPlaces.map((place, idx) => (
          <div key={idx} className="space-y-3">
            {/* Image as a clickable link */}
            <Link to="/all-trips" aria-label={`Explore ${place.name}`}>
              <img
                src={place.image}
                alt={place.name}
                loading="lazy"
                className="w-full mb-3 h-64 object-cover rounded-xl hover:scale-[1.03] hover:brightness-105 transition duration-300 shadow-md"
              />
            </Link>

            {/* Text Info (no card!) */}
            <div className="pl-1">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {place.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">📍 {place.location}</p>
              <p className="text-base text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
