import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaMapMarkedAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import BookNowModal from "../components/BookNowModal";
import { useState } from "react";
import PremiumGallery from "./PremiumGallery";

const PackageDetails = () => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

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

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-100 transition-all">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700 dark:text-yellow-400">
        {title}
      </h1>

      {/* Image Gallery */}
      <PremiumGallery images={images} />


      {/* Overview */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-3">Overview</h2>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
      </div>

      {/* Details Section */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <FaMapMarkedAlt className="text-xl text-blue-600 dark:text-yellow-400" />
            <p><strong>Tour Type:</strong> {tourType}</p>
          </div>

          <div className="flex items-center gap-3">
            <FaClock className="text-xl text-pink-500" />
            <p><strong>Duration:</strong> {duration}</p>
          </div>

          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-xl text-green-500" />
            <p>
              <strong>Price:</strong> <span className="text-lg font-semibold">৳{price}</span>
            </p>
          </div>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 transition rounded-full text-white font-medium mt-4 shadow"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Modal */}
      <BookNowModal
        isOpen={isBookModalOpen}
        closeModal={() => setIsBookModalOpen(false)}
        packageData={packageData}
      />
    </section>
  );
};

export default PackageDetails;
