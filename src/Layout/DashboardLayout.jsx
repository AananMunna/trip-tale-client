import { Link, NavLink, Outlet } from "react-router";
import { useState, useContext, useRef, useEffect } from "react";
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
  Package,
} from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userRole } = useContext(AuthContext);

  // Swipe tracking
  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

  const sidebarRef = useRef(null);

  const navLinks = [
    { path: "/dashboard/dashboardHome", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/dashboard/my-profile", label: "My Profile", icon: <User className="w-5 h-5" /> },
    { path: "/dashboard/my-bookings", label: "My Bookings", icon: <CalendarCheck className="w-5 h-5" />, allowedRoles: ["tourist"] },
    { path: "/dashboard/payment-history", label: "Payment History", icon: <Wallet className="w-5 h-5" />, allowedRoles: ["tourist"] },
    { path: "/dashboard/add-story", label: "Add Story", icon: <FilePlus2 className="w-5 h-5" /> },
    { path: "/dashboard/manage-stories", label: "Manage Stories", icon: <ClipboardCheck className="w-5 h-5" /> },
    { path: "/dashboard/join-as-tour-guide", label: "Join as Tour Guide", icon: <UserPlus2 className="w-5 h-5" />, allowedRoles: ["tourist"] },
    { path: "/dashboard/my-assigned-tours", label: "Assigned Tours", icon: <Briefcase className="w-5 h-5" />, allowedRoles: ["guide"] },
    { path: "/dashboard/add-package", label: "Add Package", icon: <FilePlus2 className="w-5 h-5" />, allowedRoles: ["admin"] },
    { path: "/dashboard/all-packages", label: "All Package", icon: <Package className="w-5 h-5" />, allowedRoles: ["admin"] },
    { path: "/dashboard/manage-users", label: "Manage Users", icon: <Users2 className="w-5 h-5" />, allowedRoles: ["admin"] },
    { path: "/dashboard/manage-candidates", label: "Manage Candidates", icon: <UserPlus2 className="w-5 h-5" />, allowedRoles: ["admin"] },
  ];

  // Swipe from anywhere on screen to open drawer from right (swipe left)
  const handleTouchStart = (e) => {
    if (sidebarOpen) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;

    // Swipe left threshold (open drawer)
    if (diff < -70) {
      setSidebarOpen(true);
      touchStartX.current = null;
      touchCurrentX.current = null;
    }
  };

  // Swipe inside drawer to close (swipe right)
  const handleSidebarTouchStart = (e) => {
    if (!sidebarOpen) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleSidebarTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;

    // Swipe right threshold (close drawer)
    if (diff > 70) {
      setSidebarOpen(false);
      touchStartX.current = null;
      touchCurrentX.current = null;
    }
  };

  // Click outside drawer closes it
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div
      className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-20">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-teal-700 dark:text-emerald-300">
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1.2 }}
            >
              🌍
            </motion.span>
            TripTale
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navLinks
            .filter((link) => !link.allowedRoles || link.allowedRoles.includes(userRole))
            .map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-all group text-sm ${
                    isActive
                      ? "bg-emerald-600 text-white shadow"
                      : "text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                  }`
                }
              >
                <span className="group-hover:scale-110 transition-transform duration-200">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed z-30 inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onTouchStart={handleSidebarTouchStart}
        onTouchMove={handleSidebarTouchMove}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-teal-700 dark:text-emerald-300">
            🌍 TripTale
          </Link>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 mt-4 px-4 pb-6">
          {navLinks
            .filter((link) => !link.allowedRoles || link.allowedRoles.includes(userRole))
            .map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                onClick={() => setSidebarOpen(false)} // close drawer on nav link click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-all group text-sm ${
                    isActive
                      ? "bg-emerald-600 text-white shadow"
                      : "text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                  }`
                }
              >
                <span className="group-hover:scale-110 transition-transform duration-200">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:mr-64">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-800 shadow">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Dashboard</h2>
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
