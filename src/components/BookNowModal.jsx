import { useContext, useState } from "react";
import { Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { AuthContext } from './../context/AuthProvider';
import useAxiosSecure from './../hooks/useAxiosSecure';

const BookNowModal = ({ isOpen, closeModal, packageData }) => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  console.log(user);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGuide, setSelectedGuide] = useState("");

  const handleBooking = async () => {
    const bookingInfo = {
      packageId: packageData._id,
      packageTitle: packageData.title,
      touristName: user?.displayName,
      touristEmail: user.email,
      touristImage: user.photoURL,
      tourDate: selectedDate.toISOString(),
      tourGuide: selectedGuide,
      price: packageData.price,
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
          // Optional: Navigate to My Bookings
          // navigate("/dashboard/my-bookings");
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

    {/* Centered Modal */}
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-md rounded-xl shadow-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
        <Dialog.Title className="text-xl font-bold mb-4 text-center">
          Book Now: <span className="text-emerald-600 dark:text-emerald-400">{packageData.title}</span>
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
              value={user.email}
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

          {/* Select Tour Guide */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Select Tour Guide:</label>
            <select
              value={selectedGuide}
              onChange={(e) => setSelectedGuide(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="">-- Select Guide --</option>
              {packageData.guideOptions?.map((guide, idx) => (
                <option key={idx} value={guide.name}>
                  {guide.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
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
  </Dialog>
);

};

export default BookNowModal;
