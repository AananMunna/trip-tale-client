import { createBrowserRouter } from "react-router";
import Layout from "../Layout/Layout";
import DashboardLayout from "../Layout/DashboardLayout";

// public pages
import App from "./../App";
import Login from "./../pages/Login";
import Register from "./../pages/Register";
import NotFound from "./../pages/NotFound";
import AboutUs from "../pages/AboutUs";
import PackageDetails from "../components/PackageDetails";

// dashboard pages for normal users
import MyProfile from "../pages/dashboard/MyProfile";
import MyBookings from "../pages/dashboard/MyBookings";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import UserDashboardHome from "../pages/dashboard/UserDashboardHome";
import Payment from "../pages/dashboard/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: App },
      { path: "packages/:id", Component: PackageDetails },
      { path: "aboutUs", Component: AboutUs },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: UserDashboardHome },
      {
        path: "payment/:id",
        Component: Payment,
      },
      { path: "dashboardHome", Component: UserDashboardHome },
      { path: "my-profile", Component: MyProfile },
      { path: "my-bookings", Component: MyBookings },
      { path: "payment-history", Component: PaymentHistory },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
