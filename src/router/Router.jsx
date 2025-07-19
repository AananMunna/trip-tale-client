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

// dashboard pages 
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
import ManageUsers from "../pages/admin/ManageUsers";
import ManageTourGuideCandidates from "../pages/admin/ManageTourGuideCandidates";
import GuideProfile from "../components/GuideProfile";
import PrivateRoute from './../components/PrivateRoute';
import AllPackages from "../pages/admin/AllPackages";
import EditPackage from "../pages/admin/EditPackage";
import ChatHome from "../pages/ChatHome";
import GuideInbox from "../pages/GuideInbox";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: App },
      { path: "packages/:id", Component: PackageDetails },
      { path: "/guide/:id", Component: GuideProfile },
      { path: "community", Component: CommunityPage },
      { path: "aboutUs", Component: AboutUs },
      { path: "all-trips", Component: TripPage },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "*", Component: NotFound },
      // ✨ For Tourist: Chat with guides
      {
        path: "chat", // http://localhost:5173/chat
        element: <ChatHome />,
      },

      // ✨ For Guide: Inbox from tourists
      {
        path: "guide-inbox", // http://localhost:5173/guide-inbox
        element: <GuideInbox />,
      },
    ],
  },
{
  path: "/dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <UserDashboardHome /> },
    { path: "dashboardHome", element: <UserDashboardHome /> },
    { path: "payment/:id", element: <Payment /> },
    { path: "add-story", element: <AddStory /> },
     
    {
      path: "manage-stories",
      element: <ManageStories />,
    },
    {
      path: "join-as-tour-guide",
      element: (
        <ProtectedRoute allowedRoles={["tourist"]}>
          <JoinAsTourGuide />
        </ProtectedRoute>
      ),
    },
    {
      path: "my-profile",
      element: <MyProfile />,
    },
    {
      path: "my-bookings",
      element: (
        <ProtectedRoute allowedRoles={["tourist"]}>
          <MyBookings />
        </ProtectedRoute>
      ),
    },
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
    {
      path: "all-packages",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AllPackages />
        </ProtectedRoute>
      ),
    },
    {
      path: "edit-package/:id",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <EditPackage />
        </ProtectedRoute>
      ),
    },
    {
      path: "manage-users",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <ManageUsers />
        </ProtectedRoute>
      ),
    },
    {
      path: "manage-candidates",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <ManageTourGuideCandidates />
        </ProtectedRoute>
      ),
    },
  ],
}
,
  {
    path: '/unauthorized',
    Component: Unauthorized
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
