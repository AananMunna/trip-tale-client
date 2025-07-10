import React from "react";
import { Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const TripPage = () => {
  const axiosSecure = useAxiosSecure();

  const fetchPackages = async () => {
    const { data } = await axiosSecure.get("/packages"); // no base URL needed if set in axiosSecure
    return data;
  };

const { data: packages = [], isLoading, isError, error } = useQuery({
  queryKey: ["packages"],
  queryFn: fetchPackages,
});

  if (isLoading)
    return <p className="text-center mt-10">Loading packages...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">Error: {error.message}</p>
    );

  return (
    <section className="max-w-6xl mx-auto p-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-600">
        All Trips
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
          >
            <img
              src={pkg.images?.[0] || "/default-image.jpg"}
              alt={pkg.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {pkg.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {pkg.tourType}
            </p>
            <p className="font-bold text-emerald-600 mb-4">৳{pkg.price}</p>
            <Link
              to={`/packages/${pkg._id}`}
              className="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TripPage;
