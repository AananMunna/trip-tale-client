import { useState, useEffect, useRef, useContext } from "react";
import { FaTachometerAlt, FaBullhorn, FaSignOutAlt, FaUser } from "react-icons/fa";
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
          draggable: true,
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
      <div ref={dropdownRef} className="relative">
        {/* Avatar Button */}
        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-10 z-50 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center cursor-pointer border-2 border-white dark:border-emerald-500 hover:scale-105 transition-transform duration-200 shadow-md"
          title={user.displayName || "User Profile"}
        >
          {user.photoURL ? (
            <img
              className="rounded-full h-9 w-9 object-cover"
              src={user.photoURL}
              alt="Profile"
              loading="lazy"
            />
          ) : (
            <FaUser className="text-white text-lg" />
          )}
        </div>

        {/* Dropdown Panel */}
        <div
          className={`absolute right-0 mt-4 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-xl border border-emerald-200 dark:border-emerald-700 z-50 transform transition-all duration-300 ease-in-out ${
            open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
          }`}
        >
          {/* User Info */}
          <div className="px-5 py-4 border-b border-emerald-200 dark:border-emerald-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate select-none">
              {user.displayName || "No Name"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate select-none">
              {user.email || "No Email"}
            </p>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-3 space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow"
                    : "text-gray-700 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 hover:text-emerald-900 dark:hover:text-white"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaTachometerAlt className="text-base" />
              Dashboard
            </NavLink>

            <NavLink
              to="/offer-announcements"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow"
                    : "text-gray-700 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 hover:text-emerald-900 dark:hover:text-white"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaBullhorn className="text-base" />
              Offer Announcements
            </NavLink>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 mt-1 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-b-xl transition-colors duration-200"
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
