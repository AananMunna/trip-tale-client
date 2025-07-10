import React, { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../context/AuthProvider";

const MyAssignedTours = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // Fetch assigned tours for this guide
  const {
    data: tours = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assignedTours", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assigned-tours?guideEmail=${user?.email}`);
      return res.data;
    },
    enabled: Boolean(user?.email),
  });

  // Mutation to update tour status
  const updateStatusMutation = useMutation({
    mutationFn: ({ tourId, status }) =>
      axiosSecure.patch(`/assigned-tours/${tourId}`, { status }),
    onSuccess: () => {
      Swal.fire("Success", "Status updated successfully", "success");
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status", "error");
    },
  });

  const handleAccept = (tourId) => {
    updateStatusMutation.mutate({ tourId, status: "accepted" });
  };

  const handleReject = (tourId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this tour?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ tourId, status: "rejected" });
      }
    });
  };

  if (isLoading) return <p>Loading assigned tours...</p>;
  if (isError) return <p>Error loading tours: {error.message}</p>;

  if (tours.length === 0) return <p>No assigned tours found.</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
        My Assigned Tours
      </h2>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow-md">
        <thead className="bg-emerald-600 text-white">
          <tr>
            <th className="py-3 px-6 text-left">Package Name</th>
            <th className="py-3 px-6 text-left">Tourist Name</th>
            <th className="py-3 px-6 text-left">Tour Date</th>
            <th className="py-3 px-6 text-left">Price</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr
              key={tour._id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="py-3 px-6">{tour.packageTitle}</td>
              <td className="py-3 px-6">{tour.touristName}</td>
              <td className="py-3 px-6">
                {new Date(tour.tourDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-6">৳{tour.price}</td>
              <td className="py-3 px-6">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    tour.status === "Pending"
                      ? "bg-yellow-500"
                      : tour.status === "In Review"
                      ? "bg-blue-500"
                      : tour.status === "Accepted"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {tour.status}
                </span>
              </td>
              <td className="py-3 px-6 flex gap-2">
                <button
                  disabled={tour.status !== "in-review" || updateStatusMutation.isLoading}
                  onClick={() => handleAccept(tour._id)}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    tour.status === "in-review"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Accept
                </button>
                <button
                  disabled={tour.status !== "pending" || updateStatusMutation.isLoading}
                  onClick={() => handleReject(tour._id)}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    tour.status === "pending"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAssignedTours;
