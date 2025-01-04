import React from "react";
import LandingPage from "./common_Page/landingPage";
import "./index.css";
import Navbar from "./common_Page/navBar";
import Footer from "./common_Page/footer";
import SidebarLayout from "./User_Section/Pages/SideBar/sideLayouts";
import Login from "./User_Section/Pages/signIn";
import SignUp from "./User_Section/pages/signUp";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/*" element={<SidebarLayout />} />
      </Routes>
    </>
  );
}

export default App;
