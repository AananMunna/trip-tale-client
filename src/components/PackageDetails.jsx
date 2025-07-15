import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaMapMarkedAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import BookNowModal from "../components/BookNowModal";
import { useContext, useState } from "react";
import PremiumGallery from "./PremiumGallery";
import { AuthContext } from "../context/AuthProvider";
import { motion } from 'framer-motion';
import Swal from "sweetalert2";

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
      return res?.data;
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

  const { title, images, price, tourType, description, duration, tourPlan } = packageData;

  const handleBookNow = () => {
    if (!user) {
      return navigate("/login");
    }
    if (userRole === "tourist") {
      setIsBookModalOpen(true);
    }else if(userRole === "guide") {
  Swal.fire({
    icon: 'warning',
    title: 'Access Denied 😢',
    text: "You can't book the package because you are a guide.",
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Got it',
    backdrop: `
      rgba(0,0,123,0.4)
      left top
      no-repeat
    `,
  });
} else {
   Swal.fire({
    icon: 'warning',
    title: 'Access Denied 😢',
    text: "You can't book the package because you are an admin.",
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Got it',
    backdrop: `
      rgba(0,0,123,0.4)
      left top
      no-repeat
    `,
  });
}

  };

  return (
      <section className="max-w-6xl py-40 mx-auto px-4 pb-28 text-gray-800 dark:text-gray-100 transition-all relative">
  {/* 🎞️ Premium Gallery */}
  <PremiumGallery images={images} />

  {/* 🌍 Title */}
  <h1 className="text-4xl font-extrabold text-center mb-2 tracking-tight text-gray-900 dark:text-white">
    {title}
  </h1>

  {/* 📃 Overview */}
  <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl shadow-xl backdrop-blur-sm p-8 mb-12 mt-10">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Overview</h2>
    <p className="leading-relaxed text-gray-700 dark:text-gray-300 text-lg">{description}</p>
  </div>

  {/* 📌 Details */}
  <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
    <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg">
      <div className="flex items-center gap-3">
        <FaMapMarkedAlt className="text-2xl text-blue-600 dark:text-yellow-400" />
        <p><strong>Tour Type:</strong> {tourType}</p>
      </div>

      <div className="flex items-center gap-3">
        <FaClock className="text-2xl text-pink-500" />
        <p><strong>Duration:</strong> {duration}</p>
      </div>

      <div className="flex items-center gap-3">
        <FaMoneyBillWave className="text-2xl text-green-500" />
        <p>
          <strong>Price:</strong>{" "}
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">৳{price}</span>
        </p>
      </div>
    </div>

    {/* 🚀 Tour Plan Timeline */}
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Tour Plan</h2>
      <ol className="relative border-l border-gray-300 dark:border-gray-600 ml-4">
        {tourPlan.map((item, idx) => {
          // Extract day and description by splitting on ':'
          const [day, ...descParts] = item.split(":");
          const desc = descParts.join(":").trim();
          return (
            <li key={idx} className="mb-8 ml-6 last:mb-0">
              {/* Dot */}
              <span className="absolute -left-3 top-1.5 w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-gray-900"></span>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-emerald-400">{day.toUpperCase()}</h3>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{desc}</p>
            </li>
          );
        })}
      </ol>
    </div>
  </div>

  {/* 📦 Sticky Premium Book Now Button */}
  <motion.div
    initial={{ scale: 1 }}
    animate={{
      scale: [1, 1.05, 1],
      boxShadow: ["rgba(16,185,129,0.6)"],
    }}
    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    className="fixed bottom-5 right-5 z-50"
  >
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "#059669", transition: { duration: 0.3 } }}
      onClick={handleBookNow}
      className="px-6 py-3 bg-emerald-600 shadow-2xl text-white font-semibold rounded-full text-sm sm:text-base"
    >
      Book Now
    </motion.button>
  </motion.div>

  {/* 📦 Modal */}
  <BookNowModal isOpen={isBookModalOpen} closeModal={() => setIsBookModalOpen(false)} packageData={packageData} />
</section>

  );
};

export default PackageDetails;
