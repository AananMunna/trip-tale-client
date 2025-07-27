import React from "react";
import { Link } from "react-router"; // ✅ fixed import
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Compass, PlaneTakeoff } from "lucide-react";
// import FindTripWithAI from "./FindTripWithAI_NewFeature/FindTripWithAI";

const TripPage = () => {
  const axiosSecure = useAxiosSecure();

  const fetchPackages = async () => {
    const { data } = await axiosSecure.get("/packages");
    return data;
  };

  const {
    data: packages = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-3">
        <span className="loading loading-bars loading-lg text-emerald-500" />
        <p className="text-gray-500">Fetching your next adventure...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        Error loading trips: {error.message}
      </p>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center h-screen flex justify-center items-center flex-col py-20 text-gray-500 dark:text-gray-400">
        <PlaneTakeoff className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
        <p>No trips available at the moment. Stay tuned!</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-12 tracking-tight">
        Explore Our Top Trips
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Link
            key={pkg._id}
            to={`/packages/${pkg._id}`}
            className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={pkg.images?.[0] || "https://source.unsplash.com/800x600/?travel"}
              alt={pkg.title}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition duration-500 flex flex-col justify-end p-6">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                {pkg.title}
              </h2>

             

              <p className="text-sm text-gray-200 flex items-center gap-1">
                <Compass className="w-4 h-4" /> {pkg.tourType || "Adventure"}
              </p>

              <p className="text-lg font-semibold text-white mt-2">
                ৳{pkg.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TripPage;
