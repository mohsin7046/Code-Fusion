import LandingPage from "./common_Page/landingPage";
import "./index.css";
import Navbar from "./common_Page/navBar";
import Footer from "./common_Page/footer";
import SidebarLayout from "./User_Section/Pages/SideBar/sideLayouts";
import Login from "./User_Section/Pages/signIn";
import SignUp from "./User_Section/Pages/signUp.jsx";
import { Routes, Route } from "react-router-dom";
import Home from './VideoCalling/lobby.jsx';
import Room from './VideoCalling/Screen.jsx';
import EmailPage from "./VideoCalling/EmailPage.jsx";

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
        <Route path="/home" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path='/email-page/:roomId' element={<EmailPage />} />
      </Routes>
    </>
  );
}

export default App;
