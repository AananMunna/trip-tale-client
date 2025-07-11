import { Link } from "react-router";
import { useContext } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaMapMarkedAlt,
  FaClipboardList,
  FaUsers,
  FaDollarSign,
  FaSuitcase,
  FaUserTie,
  FaRegNewspaper
} from "react-icons/fa";
import { AuthContext } from './../../context/AuthProvider';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UserDashboardHome = () => {
  const { user, userRole } = useContext(AuthContext);
  const role = userRole || "tourist";
  const axiosSecure = useAxiosSecure();

  // get total payments
  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/stats/payments?email=${user?.email}`);

      return res.data;
    },
    enabled: role === "admin",
  });


  // get all user tourist and guide
  const { data: usersByRole, isLoading } = useQuery({
  queryKey: ["admin-users-by-role"],
  queryFn: async () => {
    const res = await axiosSecure.get(`/admin/users-by-role?email=${user?.email}`);
    return res.data;
  },
});


// get all packages length
const { data: packages = [] } = useQuery({
  queryKey: ["packages"],
  queryFn: async () => {
    const res = await axiosSecure.get("/packages");
    return res.data;
  },
});


// get all stories length
const { data: stories = [] } = useQuery({
  queryKey: ["packages"],
  queryFn: async () => {
    const res = await axiosSecure.get("/stories");
    return res.data;
  },
});





  return (
    <div className="p-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">Welcome, {user?.displayName || "Traveler"}! 🌍</h2>

      {/* ========== TOURIST VIEW ========== */}
      {role === "tourist" && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile */}
          <Card icon={<FaUser />} title="My Profile" color="blue">
            <p>Name: {user?.displayName}</p>
            <p>Email: {user?.email}</p>
            <Link to="/dashboard/my-profile" className="text-blue-500 hover:underline mt-3 inline-block">
              View Profile
            </Link>
          </Card>

          {/* Bookings */}
          <Card icon={<FaCalendarAlt />} title="My Bookings" color="emerald">
            <p>See all your tour reservations and booking statuses.</p>
            <Link to="/dashboard/my-bookings" className="text-emerald-500 hover:underline mt-3 inline-block">
              Go to Bookings
            </Link>
          </Card>

          {/* Payments */}
          <Card icon={<FaMoneyCheckAlt />} title="Payment History" color="indigo">
            <p>View payments and invoices for completed bookings.</p>
            <Link to="/dashboard/payment-history" className="text-indigo-500 hover:underline mt-3 inline-block">
              View Payments
            </Link>
          </Card>
        </div>
      )}

      {/* ========== GUIDE VIEW ========== */}
      {role === "guide" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card icon={<FaMapMarkedAlt />} title="My Tours" color="pink">
            <p>Create and manage your guided tours.</p>
            <Link to="/dashboard/my-tours" className="text-pink-500 hover:underline mt-3 inline-block">
              Manage Tours
            </Link>
          </Card>

          <Card icon={<FaClipboardList />} title="Bookings By Travelers" color="orange">
            <p>See who has booked your tours and update availability.</p>
            <Link to="/dashboard/guide-bookings" className="text-orange-500 hover:underline mt-3 inline-block">
              View Bookings
            </Link>
          </Card>
        </div>
      )}

      {/* ========== ADMIN VIEW ========== */}
      {role === "admin" && (
        <div className="space-y-8">
          {/* Admin Profile */}
          {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <img
                src={adminProfile?.photo || user?.photoURL}
                alt="Admin"
                className="w-16 h-16 rounded-full border-2 border-gray-400"
              />
              <div className="flex-1">
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border rounded p-2 w-full mb-2"
                      placeholder="Your Name"
                    />
                    <input
                      type="text"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      className="border rounded p-2 w-full"
                      placeholder="Photo URL"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-xl font-semibold">{adminProfile?.name || user?.displayName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-sm font-medium text-blue-600">Role: Admin</p>
                  </>
                )}
              </div>
              {editMode ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </div>
          </div> */}

          {/* Admin Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard icon={<FaDollarSign />} label="Total Payments" value={`$${stats?.totalPayments || 0}`} color="indigo" />
            <StatCard icon={<FaUserTie />} label="Total Guides" value={usersByRole?.guides?.length || 0} color="pink" />
            <StatCard icon={<FaSuitcase />} label="Total Packages" value={packages?.length || 0} color="emerald" />
            <StatCard icon={<FaUsers />} label="Total Clients" value={usersByRole?.tourists?.length || 0} color="blue" />
            <StatCard icon={<FaRegNewspaper />} label="Total Stories" value={stories?.length || 0} color="yellow" />
          </div>
        </div>
      )}
    </div>
  );
};

// 💡 Reusable Card component
const Card = ({ icon, title, children, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-4 mb-4">
      <div className={`text-3xl text-${color}-600`}>{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

// 📊 Admin Stat Card
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center gap-4">
    <div className={`text-${color}-600 text-3xl`}>{icon}</div>
    <div>
      <h4 className="text-lg font-medium">{label}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default UserDashboardHome;
