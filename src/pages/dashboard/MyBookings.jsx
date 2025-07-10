import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { Trash2, CreditCard } from "lucide-react";
import Confetti from "react-confetti";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";
import useWindowSize from "react-use/lib/useWindowSize"; // ✅ useWindowSize for full screen confetti

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { width, height } = useWindowSize(); // ✅ Get screen size
  const [showConfetti, setShowConfetti] = useState(false); // ✅ Confetti state

  const { data: bookings = [], refetch, isLoading } = useQuery({
    queryKey: ["userBookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user?.email}`);
      return res.data;
    },
  });

  // ✅ Show confetti if bookings > 3
  useEffect(() => {
    if (bookings.length > 3) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false); // hide after 5 seconds
      }, 5000);
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
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🎉 Confetti will show when more than 3 bookings */}
      {showConfetti && <Confetti width={width} height={height} />}

      <h2 className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">
        My Bookings
      </h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex flex-col gap-1 text-sm text-gray-800 dark:text-gray-100">
                <p><strong>Title:</strong> {booking.packageTitle}</p>
                <p><strong>Date:</strong> {new Date(booking.tourDate).toLocaleDateString()}</p>
                <p><strong>Price:</strong> ৳{booking.price}</p>
                <p><strong>Guide:</strong> {booking.tourGuide}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      booking.status === "pending"
                        ? "bg-yellow-500"
                        : booking.status === "confirmed"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                {/* Pay Button */}
                {booking.status === "pending" && (
                  <Link
                    to={`/dashboard/payment/${booking._id}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded inline-flex items-center gap-1 text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </Link>
                )}

                {/* Cancel Button */}
                {booking.status === "pending" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded inline-flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
