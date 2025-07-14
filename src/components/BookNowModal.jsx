import { useContext, useState } from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { AuthContext } from "./../context/AuthProvider";
import useAxiosSecure from "./../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const BookNowModal = ({ isOpen, closeModal, packageData }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGuide, setSelectedGuide] = useState("");

  const { data: guides = [] } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=guide");
      return res.data;
    },
  });

  const handleBooking = async () => {
    if (!user?.email) {
      return navigate("/login");
    }

    const bookingInfo = {
      packageId: packageData?._id,
      packageTitle: packageData?.title,
      touristName: user?.displayName,
      touristEmail: user?.email,
      touristImage: user?.photoURL,
      tourDate: selectedDate.toISOString(),
      tourGuide: selectedGuide,
      price: packageData?.price,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/bookings", bookingInfo);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Confirm your Booking",
          text: "Your booking is now pending. Check 'My Bookings' page.",
          confirmButtonText: "Go to My Bookings",
        }).then(() => {
          closeModal();
          navigate("/dashboard/my-bookings");
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Booking failed", err.message, "error");
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60" aria-hidden="true" />

      {/* Scrollable + Responsive Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <Dialog.Panel className="w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
            <Dialog.Title className="text-xl font-bold mb-4 text-center">
              Book Now:{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {packageData?.title}
              </span>
            </Dialog.Title>

            <div className="space-y-3 text-sm">
              {/* Tourist Name */}
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Tourist Name:</label>
                <input
                  readOnly
                  value={user?.displayName}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Email:</label>
                <input
                  readOnly
                  value={user?.email}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Price:</label>
                <input
                  readOnly
                  value={`৳${packageData.price}`}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                />
              </div>

              {/* Tour Date */}
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Tour Date:</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                />
              </div>

              {/* Select Guide with Avatar & Action */}
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Select Tour Guide:</label>
                <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto p-2 space-y-2">
                  {guides.map((guide) => (
                    <div
                      key={guide._id}
                      onClick={() => setSelectedGuide(guide.email)}
                      className={`flex items-center justify-between gap-4 p-2 rounded-md cursor-pointer transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900 ${
                        selectedGuide === guide.email
                          ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-800"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={guide.photo}
                          alt={guide.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                        />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800 dark:text-white">{guide.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{guide.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/guide/${guide._id}`);
                          closeModal(); // optional
                        }}
                        className="text-sm px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>

                {selectedGuide && (
                  <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                    Selected: {guides.find((g) => g.email === selectedGuide)?.name}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!selectedGuide}
                  className="px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded hover:bg-emerald-700 dark:hover:bg-emerald-800 disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default BookNowModal;
