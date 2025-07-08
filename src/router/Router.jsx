import { createBrowserRouter } from "react-router";
import Layout from "../Layout/Layout";
import App from "./../App";
import Login from "./../pages/Login";
import Register from "./../pages/Register";
import NotFound from "./../pages/NotFound";
import AboutUs from "../pages/AboutUs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: App },
      
      { path: "aboutUs", Component: AboutUs },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "*", Component: NotFound },
    ],
  },
  { path: "*", Component: NotFound },
]);
