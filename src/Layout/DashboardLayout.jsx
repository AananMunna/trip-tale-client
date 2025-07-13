import { Link, NavLink, Outlet } from "react-router";
import { useState, useContext } from "react";
import {
  Home,
  User,
  CalendarCheck,
  Wallet,
  Menu,
  X,
  Briefcase,
  ClipboardCheck,
  FilePlus2,
  Users2,
  UserPlus2,
} from "lucide-react";
import { AuthContext } from "./../context/AuthProvider";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userRole } = useContext(AuthContext);

  const navLinks = [
    { path: "/dashboard/dashboardHome", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/dashboard/my-profile", label: "My Profile", icon: <User className="w-5 h-5" /> },
    {
      path: "/dashboard/my-bookings",
      label: "My Bookings",
      icon: <CalendarCheck className="w-5 h-5" />,
      allowedRoles: ["tourist"],
    },
    {
      path: "/dashboard/payment-history",
      label: "Payment History",
      icon: <Wallet className="w-5 h-5" />,
      allowedRoles: ["tourist"],
    },
    {
      path: "/dashboard/add-story",
      label: "Add Story",
      icon: <FilePlus2 className="w-5 h-5" />,
    },
    {
      path: "/dashboard/manage-stories",
      label: "Manage Stories",
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
    {
      path: "/dashboard/join-as-tour-guide",
      label: "Join as Tour Guide",
      icon: <UserPlus2 className="w-5 h-5" />,
      allowedRoles: ["tourist"],
    },
    {
      path: "/dashboard/my-assigned-tours",
      label: "Assigned Tours",
      icon: <Briefcase className="w-5 h-5" />,
      allowedRoles: ["guide"],
    },
    {
      path: "/dashboard/add-package",
      label: "Add Package",
      icon: <FilePlus2 className="w-5 h-5" />,
      allowedRoles: ["admin"],
    },
    {
      path: "/dashboard/manage-users",
      label: "Manage Users",
      icon: <Users2 className="w-5 h-5" />,
      allowedRoles: ["admin"],
    },
    {
      path: "/dashboard/manage-candidates",
      label: "Manage Candidates",
      icon: <UserPlus2 className="w-5 h-5" />,
      allowedRoles: ["admin"],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-teal-700 dark:text-emerald-300 tracking-wide"
          >
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1.2 }}
            >
              🌍
            </motion.span>
            TripTale
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 mt-6 px-4">
          {navLinks
            .filter(link => !link.allowedRoles || link.allowedRoles.includes(userRole))
            .map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-emerald-600 text-white shadow"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar for Mobile */}
        <header className="md:hidden flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-800 shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Dashboard</h2>
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        </header>

        {/* Dynamic Content */}
        <main className="p-4 md:p-6 flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
