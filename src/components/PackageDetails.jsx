import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaMapMarkedAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import BookNowModal from "../components/BookNowModal";
import { useContext, useState } from "react";
import PremiumGallery from "./PremiumGallery";
import { AuthContext } from "../context/AuthProvider";

const PackageDetails = () => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user, userRole } = useContext(AuthContext);

  const { data: packageData, isLoading, isError } = useQuery({
    queryKey: ["packageDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/packages/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-blue-500"></span>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Something went wrong while loading data.</p>
      </div>
    );

  const { title, images, price, tourType, description, duration } = packageData;

  const handleBookNow = () => {
    if (!user) {
      return navigate("/login");
    }
    if (userRole === "tourist") {
      setIsBookModalOpen(true);
    }
  };

  return (
    <section className="max-w-6xl py-40 mx-auto px-4 pb-28 text-gray-800 dark:text-gray-100 transition-all relative">

      {/* 🎞️ Premium Gallery */}
      <PremiumGallery images={images} />

      {/* 🌍 Title */}
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700 dark:text-yellow-400">
        {title}
      </h1>
      {/* 📃 Overview */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10 mt-10">
        <h2 className="text-2xl font-semibold mb-3">Overview</h2>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* 📌 Details */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <FaMapMarkedAlt className="text-xl text-blue-600 dark:text-yellow-400" />
            <p>
              <strong>Tour Type:</strong> {tourType}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaClock className="text-xl text-pink-500" />
            <p>
              <strong>Duration:</strong> {duration}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-xl text-green-500" />
            <p>
              <strong>Price:</strong>{" "}
              <span className="text-lg font-semibold">৳{price}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 📌 Sticky Book Now Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={handleBookNow}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 shadow-xl transition-all duration-300 text-white font-semibold rounded-full text-sm sm:text-base"
        >
          Book Now
        </button>
      </div>

      {/* 📦 Modal */}
      <BookNowModal
        isOpen={isBookModalOpen}
        closeModal={() => setIsBookModalOpen(false)}
        packageData={packageData}
      />
    </section>
  );
};

export default PackageDetails;
