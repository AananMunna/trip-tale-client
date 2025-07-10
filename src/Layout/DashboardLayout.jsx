import { Link, NavLink, Outlet } from "react-router";
import { useState, useContext } from "react";
import { Home, User, CalendarCheck, Wallet, Menu, X } from "lucide-react";
import { AuthContext } from "./../context/AuthProvider";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user,userRole } = useContext(AuthContext);

const navLinks = [
  {
    path: "/dashboard/dashboardHome",
    label: "Home",
    icon: <Home className="w-5 h-5" />,
  },
  {
    path: "/dashboard/my-profile",
    label: "My Profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    path: "/dashboard/my-bookings",
    label: "My Bookings",
    icon: <CalendarCheck className="w-5 h-5" />,
    allowedRoles: ["tourist"], // ✅ tourist only
  },
  {
    path: "/dashboard/payment-history",
    label: "Payment History",
    icon: <Wallet className="w-5 h-5" />,
    allowedRoles: ["tourist"], // ✅ tourist only
  },
  {
    path: "/dashboard/add-story",
    label: "Add Stories",
    icon: <Wallet className="w-5 h-5" />,
    allowedRoles: ["tourist", "guide"], // ✅ both
  },
  {
    path: "/dashboard/manage-stories",
    label: "Manage Stories",
    icon: <Wallet className="w-5 h-5" />,
    allowedRoles: ["tourist", "guide"], // ✅ both
  },
  {
    path: "/dashboard/join-as-tour-guide",
    label: "Join as tour guide",
    icon: <Wallet className="w-5 h-5" />,
    allowedRoles: ["tourist"], // ✅ only tourists should see this
  },
  {
    path: "/dashboard/my-assigned-tours",
    label: "Assigned Tours",
    icon: <Wallet className="w-5 h-5" />,
    allowedRoles: ["guide"], // ✅ only tourists should see this
  },
  // Add more routes as needed
];


  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-teal-700 dark:text-emerald-300 tracking-wide"
          >
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }}
            >
              🌍
            </motion.span>
            TripTale
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation Links */}
       <nav className="flex flex-col gap-2 mt-6 px-4">
  {navLinks
    .filter(
      (link) =>
        !link.allowedRoles || link.allowedRoles.includes(userRole)
    )
    .map((link, idx) => (
      <NavLink
        key={idx}
        to={link.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all group ${
            isActive
              ? "bg-emerald-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900"
          }`
        }
      >
        <span className="group-hover:scale-110 transition-transform duration-200">
          {link.icon}
        </span>
        <span>{link.label}</span>
      </NavLink>
    ))}
</nav>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar (Mobile Only) */}
        <header className="md:hidden flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-800 shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            Dashboard
          </h2>
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="User"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />
        </header>

        {/* Outlet Area */}
        <main className="p-4 md:p-6 flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
