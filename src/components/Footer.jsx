import React, { useState } from "react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "All Trips", path: "/all-trips" },
  { name: "About Us", path: "/aboutUs" },
  { name: "Community", path: "/community" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please enter a valid email.",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
      return;
    }

    // Here you can send the email to your backend API if needed

    Swal.fire({
      icon: "success",
      title: "Subscribed!",
      text: `You've successfully subscribed with ${email}.`,
      timer: 2500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });

    setEmail(""); // reset input
  };

  return (
    <footer className="relative bg-gradient-to-tr from-indigo-900 via-teal-700 to-emerald-900 text-gray-200 dark:text-gray-300 overflow-hidden">
      {/* Top Wave SVG */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-12 md:h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 54"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            fill="currentColor"
            d="M0 54L1440 0H0v54z"
            className="text-teal-600 dark:text-teal-700"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-4xl font-extrabold tracking-wide text-white hover:text-pink-400 transition"
            aria-label="TripTale Logo"
          >
            <span role="img" aria-label="globe">🌍</span>
            TripTale
          </Link>
          <p className="text-sm md:text-base font-light text-indigo-200 max-w-xs">
            Your gateway to unforgettable journeys. Explore. Dream. Discover.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-2xl text-indigo-300 mt-4">
            <a href="https://github.com/aananmunna" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition" aria-label="GitHub"><FaGithub /></a>
            <a href="https://linkedin.com/in/aanan-munna-6948b8245" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://twitter.com/aananmunna" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition" aria-label="Twitter"><FaTwitter /></a>
            <a href="mailto:info@triptale.com" className="hover:text-pink-400 transition" aria-label="Email"><FaEnvelope /></a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Quick Links</h3>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:text-emerald-400 transition-colors duration-200 text-gray-200 dark:text-gray-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
          <p className="text-gray-300 text-sm">Subscribe to our newsletter for the latest travel updates.</p>
          <div className="flex gap-2 mt-2 w-full max-w-sm">
            <Input
              placeholder="Enter your email"
              className="flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleSubscribe}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-indigo-800 text-center py-4 text-indigo-300 text-xs md:text-sm select-none">
        &copy; {new Date().getFullYear()} TripTale. Crafted with ❤️ by Munna.
      </div>
    </footer>
  );
}
