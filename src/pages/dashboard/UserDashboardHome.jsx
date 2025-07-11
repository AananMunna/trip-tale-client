import { Link } from "react-router";
import { useContext } from "react";
import { FaUser, FaCalendarAlt, FaMoneyCheckAlt, FaMapMarkedAlt, FaClipboardList } from "react-icons/fa";
import { AuthContext } from './../../context/AuthProvider';

const UserDashboardHome = () => {
  const { user , userRole} = useContext(AuthContext);
  const role = userRole || "tourist"; // fallback to 'user' if no role found

  return (
    <div className="p-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">Welcome, {user?.displayName || "Traveler"}! 🌍</h2>

      {role === "tourist" && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <FaUser className="text-3xl text-blue-600 dark:text-yellow-400" />
              <h3 className="text-xl font-semibold">My Profile</h3>
            </div>
            <p>Name: {user?.displayName}</p>
            <p>Email: {user?.email}</p>
            <Link to="/dashboard/my-profile" className="text-blue-500 hover:underline mt-3 inline-block">
              View Profile
            </Link>
          </div>

          {/* Bookings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <FaCalendarAlt className="text-3xl text-emerald-600" />
              <h3 className="text-xl font-semibold">My Bookings</h3>
            </div>
            <p>See all your tour reservations and booking statuses.</p>
            <Link to="/dashboard/my-bookings" className="text-emerald-500 hover:underline mt-3 inline-block">
              Go to Bookings
            </Link>
          </div>

          {/* Payments */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <FaMoneyCheckAlt className="text-3xl text-indigo-600" />
              <h3 className="text-xl font-semibold">Payment History</h3>
            </div>
            <p>View payments and invoices for completed bookings.</p>
            <Link to="/dashboard/payment-history" className="text-indigo-500 hover:underline mt-3 inline-block">
              View Payments
            </Link>
          </div>
        </div>
      )}

      {role === "guide" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Manage Tours */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <FaMapMarkedAlt className="text-3xl text-pink-600" />
              <h3 className="text-xl font-semibold">My Tours</h3>
            </div>
            <p>Create and manage your guided tours.</p>
            <Link to="/dashboard/my-tours" className="text-pink-500 hover:underline mt-3 inline-block">
              Manage Tours
            </Link>
          </div>

          {/* Traveler Bookings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <FaClipboardList className="text-3xl text-orange-600" />
              <h3 className="text-xl font-semibold">Bookings By Travelers</h3>
            </div>
            <p>See who has booked your tours and update availability.</p>
            <Link to="/dashboard/guide-bookings" className="text-orange-500 hover:underline mt-3 inline-block">
              View Bookings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardHome;
