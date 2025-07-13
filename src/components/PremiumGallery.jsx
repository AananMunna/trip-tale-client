import React, { useState } from "react";

const PremiumGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      {/* Masonry Style with CSS columns */}
      <div
        className="columns-1 sm:columns-2 md:columns-3 gap-4 px-4"
        style={{ columnGap: "1rem" }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="mb-4 break-inside-avoid cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img}
              alt={`Gallery image ${idx + 1}`}
              className="w-full object-cover rounded-lg"
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white text-4xl font-bold hover:scale-110 transition"
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen"
            className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
          />
        </div>
      )}
    </>
  );
};

export default PremiumGallery;
