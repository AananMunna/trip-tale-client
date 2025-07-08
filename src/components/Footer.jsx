import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 text-gray-200 dark:text-gray-300">
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
            className="text-indigo-900 dark:text-indigo-700"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row justify-between gap-12 relative z-10">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start max-w-xs text-center md:text-left">
          <Link
            to="/"
            className="flex items-center gap-3 text-4xl font-extrabold tracking-wide text-white hover:text-pink-400 transition"
            aria-label="TripTale Logo"
          >
            <span role="img" aria-label="globe">🌍</span>
            TripTale
          </Link>
          <p className="mt-4 text-sm md:text-base font-light text-indigo-200 max-w-xs">
            Your gateway to unforgettable journeys. Explore. Dream. Discover.
          </p>
        </div>

        {/* Social Links with labels */}
        <nav className="flex flex-col space-y-6 md:space-y-8 text-center md:text-left">
          <h3 className="text-xl font-semibold tracking-wide text-pink-400">Connect with us</h3>
          <div className="flex justify-center md:justify-start gap-6 text-3xl text-indigo-300">
            <a
              href="https://github.com/aananmunna"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-pink-400 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/aanan-munna-6948b8245"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-pink-400 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com/aananmunna"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-pink-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="mailto:aananmunna420@gmail.com"
              aria-label="Email"
              className="hover:text-pink-400 transition"
            >
              <FaEnvelope />
            </a>
          </div>
        </nav>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-indigo-800 text-center py-4 text-indigo-300 text-xs md:text-sm select-none">
        &copy; {new Date().getFullYear()} TripTale. Crafted with ❤️ by Munna.
      </div>
    </footer>
  );
}
