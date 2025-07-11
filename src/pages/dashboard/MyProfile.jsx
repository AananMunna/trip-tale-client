import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "./../../context/AuthProvider";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

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

  // Get bookings stats
  useEffect(() => {
    axiosSecure.get(`/bookings?email=${user?.email}`).then((res) => {
      const total = res.data.length;
      const confirmed = res.data.filter((b) => b.status === "confirmed").length;
      const pending = total - confirmed;
      setBookingStats({ total, confirmed, pending });
    });
  }, [user?.email, axiosSecure]);

  // Get current user info
  useEffect(() => {
    axiosSecure
      .get(`/users/${user?.email}`)
      .then((res) => {
        setUserData(res.data);
        setName(res.data?.name || "");
      })
      .catch((err) => console.error(err));
  }, [user?.email]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    let uploadedImageURL = userData?.photo;

    // Upload image to imgbb if selected
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
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Overview */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        <img
          src={userData?.photo || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {userData?.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
        </div>
      </div>

      {/* Booking Stats */}
      {userRole === 'tourist' && (
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-100 dark:bg-emerald-900 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Bookings</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-white">
            {bookingStats.total}
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Confirmed</p>
          <p className="text-2xl font-bold text-green-700 dark:text-white">
            {bookingStats.confirmed}
          </p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-white">
            {bookingStats.pending}
          </p>
        </div>
      </div>
)}

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="space-y-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          Update Profile
        </h3>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Upload New Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-4 py-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded w-full md:w-auto"
        >
          Update Profile
        </button>
      </form>
    </motion.section>
  );
};

export default MyProfile;
