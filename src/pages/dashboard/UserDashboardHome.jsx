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
  FaRegNewspaper,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F"];

const UserDashboardHome = () => {
  const { user, userRole } = useContext(AuthContext);
  const role = userRole || "tourist";
  const axiosSecure = useAxiosSecure();

  // Fetch total payments - only for admin
  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/stats/payments?email=${user?.email}`);
      return res.data;
    },
    enabled: role === "admin",
  });

  // Fetch users by role - admin
  const { data: usersByRole = { guides: [], tourists: [] } } = useQuery({
    queryKey: ["admin-users-by-role"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/users-by-role?email=${user?.email}`);
      return res.data;
    },
    enabled: role === "admin",
  });

  // Fetch all packages
  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  // Fetch all stories
  const { data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories");
      return res.data;
    },
  });

  // Prepare chart data for admin
  const pieData = [
    { name: "Guides", value: usersByRole?.guides?.length || 0 },
    { name: "Tourists", value: usersByRole?.tourists?.length || 0 },
  ];

  const barData = [
    { month: "Jan", payments: 2000 },
    { month: "Feb", payments: 3000 },
    { month: "Mar", payments: 2500 },
    { month: "Apr", payments: stats?.totalPayments || 1000 }, // Fake/mock example
  ];

  return (
    <div className="p-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">Welcome, {user?.displayName || "Traveler"}! 🌍</h2>

      {/* ========== TOURIST DASHBOARD ========== */}
      {role === "tourist" && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card icon={<FaUser />} title="My Profile" color="blue">
            <p>Name: {user?.displayName}</p>
            <p>Email: {user?.email}</p>
            <Link to="/dashboard/my-profile" className="text-blue-500 hover:underline mt-3 inline-block">
              View Profile
            </Link>
          </Card>

          <Card icon={<FaCalendarAlt />} title="My Bookings" color="emerald">
            <p>See all your tour reservations and booking statuses.</p>
            <Link to="/dashboard/my-bookings" className="text-emerald-500 hover:underline mt-3 inline-block">
              Go to Bookings
            </Link>
          </Card>

          <Card icon={<FaMoneyCheckAlt />} title="Payment History" color="indigo">
            <p>View payments and invoices for completed bookings.</p>
            <Link to="/dashboard/payment-history" className="text-indigo-500 hover:underline mt-3 inline-block">
              View Payments
            </Link>
          </Card>
        </div>
      )}

      {/* ========== GUIDE DASHBOARD ========== */}
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

      {/* ========== ADMIN DASHBOARD ========== */}
      {role === "admin" && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard icon={<FaDollarSign />} label="Total Payments" value={`$${stats?.totalPayments || 0}`} color="indigo" />
            <StatCard icon={<FaUserTie />} label="Total Guides" value={usersByRole?.guides?.length || 0} color="pink" />
            <StatCard icon={<FaSuitcase />} label="Total Packages" value={packages?.length || 0} color="emerald" />
            <StatCard icon={<FaUsers />} label="Total Clients" value={usersByRole?.tourists?.length || 0} color="blue" />
            <StatCard icon={<FaRegNewspaper />} label="Total Stories" value={stories?.length || 0} color="yellow" />
          </div>

          {/* Admin Chart Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">User Role Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Monthly Payments</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="payments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🧩 Reusable Card Component
const Card = ({ icon, title, children, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-4 mb-4">
      <div className={`text-3xl text-${color}-600`}>{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

// 📊 Stat Card for Admin Stats
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
