import React from "react";
import { Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Compass, PlaneTakeoff } from "lucide-react";

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
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <PlaneTakeoff className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
        <p>No trips available at the moment. Stay tuned!</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold text-center text-emerald-700 dark:text-emerald-400 mb-12 tracking-tight">
        🌍 Explore Our Top Trips
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
          >
            <img
              src={pkg.images?.[0] || "/default-image.jpg"}
              alt={pkg.title}
              className="w-full h-56 object-cover"
              loading="lazy"
            />

            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                {pkg.title}
              </h2>

              <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
                <Compass className="w-4 h-4" /> {pkg.tourType || "Adventure"}
              </p>

              {pkg.destination && (
                <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <MapPin className="w-4 h-4" /> {pkg.destination}
                </p>
              )}

              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2 mb-4">
                ৳{pkg.price}
              </p>

              <Link
                to={`/packages/${pkg._id}`}
                className="mt-auto inline-block text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TripPage;
