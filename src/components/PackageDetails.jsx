import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaUserTie, FaMapMarkedAlt, FaMoneyBillWave } from "react-icons/fa";
import BookNowModal from "../components/BookNowModal";
import { useState } from "react";


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

  const {
    title,
    images,
    price,
    type,
    tourPlan,
    description,
    guideInfo,
  } = packageData;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-100">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-yellow-400">
        {title}
      </h1>

      {/* Image Gallery */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {images?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Package Image ${i + 1}`}
            className="rounded-xl object-cover shadow-md border border-gray-200 dark:border-gray-700"
          />
        ))}
      </div>

      {/* Overview Section */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10 transition-all">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Overview</h2>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
      </div>

      {/* Details Section */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left: Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaMapMarkedAlt className="text-xl text-blue-500 dark:text-yellow-400" />
            <p>
              <strong>Tour Type:</strong> {type}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-xl text-green-500" />
            <p>
              <strong>Price:</strong> <span className="text-lg font-semibold">৳{price}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FaUserTie className="text-xl text-purple-500" />
            <p>
              <strong>Guide:</strong> {guideInfo?.name}
            </p>
          </div>
        </div>

        <button
  onClick={() => setIsBookModalOpen(true)}
  className="px-5 py-2 mt-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg"
>
  Book Now
</button>

        {/* Right: Tour Plan */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Tour Plan</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {tourPlan?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <BookNowModal
  isOpen={isBookModalOpen}
  closeModal={() => setIsBookModalOpen(false)}
  packageData={packageData}
/>
    </section>
  );
};

export default PackageDetails;
