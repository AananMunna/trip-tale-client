import { Link } from "react-router";
import { useContext } from "react";
import { FaUser, FaCalendarAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { AuthContext } from './../../context/AuthProvider';

const UserDashboardHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">Welcome, {user?.displayName || "Traveler"}! 🌍</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <FaUser className="text-3xl text-blue-600 dark:text-yellow-400" />
            <h3 className="text-xl font-semibold">My Profile</h3>
          </div>
          <p>Name: {user?.displayName}</p>
          <p>Email: {user?.email}</p>
          <Link
            to="/dashboard/my-profile"
            className="text-blue-500 hover:underline mt-3 inline-block"
          >
            View Profile
          </Link>
        </div>

        {/* Bookings Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <FaCalendarAlt className="text-3xl text-emerald-600" />
            <h3 className="text-xl font-semibold">My Bookings</h3>
          </div>
          <p>See all your tour reservations and booking statuses.</p>
          <Link
            to="/dashboard/my-bookings"
            className="text-emerald-500 hover:underline mt-3 inline-block"
          >
            Go to Bookings
          </Link>
        </div>

        {/* Payments Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <FaMoneyCheckAlt className="text-3xl text-indigo-600" />
            <h3 className="text-xl font-semibold">Payment History</h3>
          </div>
          <p>View payments and invoices for completed bookings.</p>
          <Link
            to="/dashboard/payment-history"
            className="text-indigo-500 hover:underline mt-3 inline-block"
          >
            View Payments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHome;
