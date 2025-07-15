import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "./../../context/AuthProvider";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ROLE_COLORS = {
  admin: "bg-indigo-600 text-white",
  guide: "bg-pink-600 text-white",
  tourist: "bg-emerald-600 text-white",
};

const MyProfile = () => {
  const { user, userRole } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [bookingStats, setBookingStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
  });

  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Fetch bookings stats for tourist role
  useEffect(() => {
    if (userRole === "tourist") {
      axiosSecure.get(`/bookings?email=${user?.email}`).then((res) => {
        const total = res.data.length;
        const confirmed = res.data.filter((b) => b.status === "confirmed").length;
        const pending = total - confirmed;
        setBookingStats({ total, confirmed, pending });
      });
    }
  }, [user?.email, axiosSecure, userRole]);

  // Fetch user info on load
  useEffect(() => {
    axiosSecure
      .get(`/users/${user?.email}`)
      .then((res) => {
        setUserData(res.data);
        setName(res.data?.name || "");
      })
      .catch((err) => console.error(err));
  }, [user?.email, axiosSecure]);

  // Handle profile update including image upload
  const handleUpdate = async (e) => {
    e.preventDefault();

    let uploadedImageURL = userData?.photo;

    // Upload image if selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;
      const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: formData,
      });

      const imgData = await uploadRes.json();
      if (imgData.success) {
        uploadedImageURL = imgData.data.url;
      } else {
        return Swal.fire("Error", "Image upload failed!", "error");
      }
    }

    const updateDoc = {
      name,
      photo: uploadedImageURL,
    };

    axiosSecure
      .patch(`/users/${user?.email}`, updateDoc)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          Swal.fire("Success", "Profile updated successfully!", "success");
          setUserData({ ...userData, ...updateDoc });
        } else {
          Swal.fire("No Change", "Nothing was updated.", "info");
        }
      })
      .catch(() => Swal.fire("Error", "Update failed", "error"));
  };

  return (
    <motion.section
      className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* USER ROLE HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          My Profile
        </h1>
        {userRole && (
          <span
            className={`px-4 py-2 rounded-full uppercase tracking-wide font-semibold select-none ${
              ROLE_COLORS[userRole] || "bg-gray-600 text-white"
            }`}
            title={`You are logged in as ${userRole}`}
          >
            {userRole}
          </span>
        )}
      </div>

      {/* PROFILE OVERVIEW */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <img
          src={userData?.photo || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 shadow-md"
          loading="lazy"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {userData?.name || "Traveler"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{userData?.email}</p>
        </div>
      </div>

      {/* BOOKING STATS - only for tourist */}
      {userRole === "tourist" && (
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatBox
            label="Total Bookings"
            value={bookingStats.total}
            bgColor="bg-emerald-100 dark:bg-emerald-900"
            textColor="text-emerald-700 dark:text-white"
          />
          <StatBox
            label="Confirmed"
            value={bookingStats.confirmed}
            bgColor="bg-green-100 dark:bg-green-900"
            textColor="text-green-700 dark:text-white"
          />
          <StatBox
            label="Pending"
            value={bookingStats.pending}
            bgColor="bg-yellow-100 dark:bg-yellow-900"
            textColor="text-yellow-700 dark:text-white"
          />
        </div>
      )}

      {/* UPDATE PROFILE FORM */}
      <form onSubmit={handleUpdate} className="space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2">
          Update Profile
        </h3>

        <div>
          <label
            htmlFor="name"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
          >
            Upload New Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
        >
          Update Profile
        </button>
      </form>
    </motion.section>
  );
};

// Reusable stat box component for booking stats
const StatBox = ({ label, value, bgColor, textColor }) => (
  <div
    className={`${bgColor} p-6 rounded-xl text-center shadow-sm transition-transform transform hover:scale-105 cursor-default`}
    aria-label={label}
  >
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{label}</p>
    <p className={`text-3xl font-extrabold ${textColor}`}>{value}</p>
  </div>
);

export default MyProfile;
