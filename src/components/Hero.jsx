import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
// import video1 from "https://res.cloudinary.com/dtiotqi9q/video/upload/v1752563464/banner_cobokk.mp4"; // your travel video

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.loop = true;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden text-white">
      {/* 🎥 Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://res.cloudinary.com/dtiotqi9q/video/upload/v1752563464/banner_cobokk.mp4"
        autoPlay
        muted
        playsInline
      />

      {/* 🧊 Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* 📦 Hero Content at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 inset-x-0 z-20 px-6 pb-12 text-center"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <span className="inline-block bg-white/10 text-teal-200 px-4 py-1 rounded-full text-sm font-medium tracking-wide">
            🧳 Discover Bangladesh with TripTale
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
            <span className="">
              Explore,
            </span>{" "}
            <span className="underline decoration-2 underline-offset-4 decoration-emerald-400">
              Experience,
            </span>{" "}
            <span className="">Enjoy.</span>
          </h1>

          <p className="max-w-xl mx-auto text-base md:text-lg text-gray-200">
            Plan unforgettable journeys with local insights and personalized packages. Let TripTale be your guide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Link
              to="/all-trips"
              className="px-6 py-3 bg-emerald-500 rounded-full text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              Browse Trips
            </Link>
            <Link
              to="/community"
              className="px-6 py-3 border-2 border-white rounded-full text-white hover:bg-white/10 transition"
            >
              Community
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}