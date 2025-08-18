import React, { useState, useEffect, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  {
    src: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Sundarbans Mangrove Forest",
    caption: "Explore the mystical Sundarbans",
    location: "Khulna Division"
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D5612AQGPyVWko-eUAQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1694197547335?e=2147483647&v=beta&t=4A-Rwo25UK_4hsnqsBDai1zrasqJtiq3l25gLQRxXA0",
    alt: "Cox's Bazar Beach",
    caption: "Relax on the world's longest natural sea beach",
    location: "Cox's Bazar"
  },
  {
    src: "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/9782559_best%20tea%20gardens%20Bangladesh.jpg",
    alt: "Sylhet Tea Gardens",
    caption: "Discover the lush tea gardens of Sylhet",
    location: "Sylhet Division"
  },
  {
    src: "https://www.bengaltours.com/wp-content/uploads/2022/08/60-Dome-Mosque.jpg",
    alt: "Historical Mosque City of Bagerhat",
    caption: "Step back in time at this UNESCO World Heritage Site",
    location: "Bagerhat"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[120vh] overflow-hidden"
    >
      {/* 🖼️ Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              backgroundImage: `url(${image.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0
            }}
          />
        ))}
      </motion.div>

      {/* 🧊 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80 z-10" />

      {/* 🏝️ Card Slider Container */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* 🎚️ Slider Cards */}
          <div className="flex overflow-x-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="w-full flex-shrink-0 px-2"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: index === currentSlide ? 1 : 0.5,
                    scale: index === currentSlide ? 1 : 0.95
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white/10  rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-emerald-100">
                          Featured Destination
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                        {image.location}
                      </h2>
                      <p className="text-lg text-gray-200 mb-6">
                        {image.caption}
                      </p>
                      <div className="flex gap-4">
                        <Link to="/all-trips">
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Explore Tours
                          </Button>
                        </Link>
                        <Link to={`/destinations/${image.location.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Button variant="outline" className="text-black dark:text-white border-white hover:bg-white/10">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 🎯 Slider Controls */}
          <div className="flex justify-between items-center mt-6 px-2">
            <div className="flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? "bg-emerald-400 w-8" 
                      : "bg-white/30 w-3 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/30 text-black hover:bg-white/10 hover:border-white/50"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/30 text-black hover:bg-white/10 hover:border-white/50"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ Floating Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-1/4 left-0 right-0 z-20 px-6 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/5 text-emerald-100 px-4 py-2 rounded-full text-sm font-medium tracking-wide backdrop-blur-md border border-white/10 mb-6"
          >
            ✈️ Discover Bangladesh's Hidden Gems
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Journey Beyond
            </span>{" "}
            <span className="text-white">The Ordinary</span>
          </motion.h1>
        </div>
      </motion.div>
    </section>
  );
}