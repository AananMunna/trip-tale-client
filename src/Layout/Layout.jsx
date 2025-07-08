import React from "react";
import Navbar from "./../components/Navbar";
import { Outlet, useLocation, useNavigation } from "react-router";
import Footer from "./../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";


  const location = useLocation();
  const isAssignmentsPage = location.pathname === '/assignments'

  return (
    <>
      <ScrollToTop />
      <Navbar isAssignmentsPage={isAssignmentsPage}></Navbar>
      {isLoading && <LoadingSpinner />}
      <div className={isAssignmentsPage ? "py-0" : "py-10"}>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Layout;
