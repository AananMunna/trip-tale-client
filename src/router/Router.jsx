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
import AddStory from "../pages/dashboard/AddStory";
import ManageStories from "../pages/dashboard/ManageStories";
import JoinAsTourGuide from "../pages/dashboard/JoinAsTourGuide";
import TripPage from "../pages/TripPage";
import CommunityPage from "../pages/CommunityPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import MyAssignedTours from "../pages/dashboard/guide/MyAssignedTours";
import AddPackage from "../pages/dashboard/AddPackage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: App },
      { path: "packages/:id", Component: PackageDetails },
      { path: "community", Component: CommunityPage },
      { path: "aboutUs", Component: AboutUs },
      { path: "all-trips", Component: TripPage },
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
      { path: "add-story", Component: AddStory },
      { path: "manage-stories", Component: ManageStories },
      { path: "join-as-tour-guide", element: (
          <ProtectedRoute allowedRoles={["tourist"]}>
            <JoinAsTourGuide />
          </ProtectedRoute>
        ), },
      { path: "my-profile", Component: MyProfile },
      { path: "my-bookings", element: (
          <ProtectedRoute allowedRoles={["tourist"]}>
            <MyBookings />
          </ProtectedRoute>
        ), },
      {
        path: "my-assigned-tours",
        element: (
          <ProtectedRoute allowedRoles={["guide"]}>
            <MyAssignedTours />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <ProtectedRoute allowedRoles={["tourist"]}>
            <PaymentHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-package",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddPackage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/unauthorized',
    Component: Unauthorized
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
