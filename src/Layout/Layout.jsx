import React from "react";
import Navbar from "./../components/Navbar";
import { Outlet, useLocation, useNavigation } from "react-router";
import Footer from "./../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ScrollToTop from "../components/ScrollToTop";
import FindTripWithAI from "../pages/FindTripWithAI_NewFeature/FindTripWithAI";

const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";


  const location = useLocation();
  const isAssignmentsPage = location.pathname === '/assignments'

  return (
    <>
      <ScrollToTop />
            <FindTripWithAI />

      <Navbar isAssignmentsPage={isAssignmentsPage}></Navbar>
      {isLoading && <LoadingSpinner />}
      <div className={isAssignmentsPage ? "py-0" : "py-0"}>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Layout;
