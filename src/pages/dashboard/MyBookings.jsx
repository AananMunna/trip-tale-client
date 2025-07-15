import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { CreditCard, Trash2 } from "lucide-react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    data: bookings = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["userBookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user?.email}`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.tourDate) - new Date(a.tourDate)
      );
      return sorted;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (bookings.length > 3) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [bookings]);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this tour?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.delete(`/bookings/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
        refetch();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {showConfetti && <Confetti width={width} height={height} />}

      <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 text-center mb-8">
        🧳 My Bookings
      </h2>

      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <span className="loading loading-spinner text-emerald-600 w-8 h-8" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          <p>No bookings found.</p>
          <Link
            to="/all-trips"
            className="mt-4 inline-block text-emerald-600 hover:text-emerald-800 font-semibold underline"
          >
            Book your first trip now →
          </Link>
        </div>
      ) : (
        <>
          {/* ✅ CARD Layout (Visible on mobile) */}
          <div className="grid sm:grid-cols-2 gap-6 lg:hidden">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
              >
                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    ✈️ {booking.packageTitle}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    📅 Tour Date:{" "}
                    <span className="font-medium">
                      {new Date(booking.tourDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    💰 Price: ৳{booking.price}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👤 Guide: {booking.tourGuide}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-400">
                      Status:
                    </span>{" "}
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white ${
                        booking.status === "pending"
                          ? "bg-yellow-500"
                          : booking.status === "confirmed"
                          ? "bg-green-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 mt-auto">
                  {booking.status === "pending" && (
                    <>
                      <Link
                        to={`/dashboard/payment/${booking._id}`}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4 rounded-lg inline-flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                      </Link>

                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-lg inline-flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ TABLE Layout (Visible on large screens) */}
          <div className="hidden lg:block overflow-x-auto mt-8">
            <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Package</th>
                  <th className="px-4 py-2 text-sm">Tour Date</th>
                  <th className="px-4 py-2 text-sm">Price</th>
                  <th className="px-4 py-2 text-sm">Guide</th>
                  <th className="px-4 py-2 text-sm">Status</th>
                  <th className="px-4 py-2 text-sm text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                      {booking.packageTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(booking.tourDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      ৳{booking.price}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {booking.tourGuide}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white ${
                          booking.status === "pending"
                            ? "bg-yellow-500"
                            : booking.status === "confirmed"
                            ? "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2 space-y-2">
                      {booking.status === "pending" && (
                        <>
                          <Link
                            to={`/dashboard/payment/${booking._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm"
                          >
                            <CreditCard size={14} /> Pay
                          </Link>
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MyBookings;
