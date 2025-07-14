import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PremiumGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Escape key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* 🎭 Theater-style Masonry Gallery */}
      <div
        className="columns-1 sm:columns-2 md:columns-3 gap-4 px-4 pb-10"
        style={{ columnGap: "1rem" }}
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow-xl hover:shadow-2xl hover:brightness-110 transition"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-auto object-cover rounded-lg"
            />
          </motion.div>
        ))}
      </div>

      {/* 🎬 Immersive Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ✖️ Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white text-4xl font-bold hover:scale-110 transition"
            >
              &times;
            </button>

            {/* 🖼️ Fullscreen Image */}
            <motion.img
              src={selectedImage}
              alt="Selected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border-4 border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumGallery;
