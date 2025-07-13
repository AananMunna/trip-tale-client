import { useState, useEffect, useRef, useContext } from "react";
import {
  FaTachometerAlt,
  FaBullhorn,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router";

const ProfileDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => {
        Swal.fire({
          title: "Signed out successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: error.message,
        });
      });
  };

  return (
    user && (
      <div ref={dropdownRef} className="relative z-50">
        {/* Avatar */}
        <div
          onClick={() => setOpen(!open)}
          className="w-11 h-11 cursor-pointer rounded-full border-2 border-white dark:border-emerald-400 bg-gradient-to-tr from-emerald-400 to-cyan-500 hover:scale-105 transition-all shadow-lg overflow-hidden"
          title={user.displayName || "User Profile"}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User"
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl">
              <FaUser />
            </div>
          )}
        </div>

        {/* Dropdown Panel */}
        <div
          className={`absolute right-0 mt-3 w-72 backdrop-blur-xl bg-white/80 dark:bg-[#111827]/90 border border-gray-200/30 dark:border-gray-700/60 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
            open
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          {/* User Info */}
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.displayName || "Traveler"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {user.email || "No email found"}
            </p>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-3 space-y-2">
            <NavLink
              to="/dashboard"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                    : "text-gray-800 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-800"
                }`
              }
            >
              <FaTachometerAlt className="text-base" />
              Dashboard
            </NavLink>

            <NavLink
              to="/offer-announcements"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                    : "text-gray-800 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-800"
                }`
              }
            >
              <FaBullhorn className="text-base" />
              Offer Announcements
            </NavLink>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
          >
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileDropdown;
