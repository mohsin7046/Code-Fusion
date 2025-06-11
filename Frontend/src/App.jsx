import LandingPage from "./components/common_Page/landingPage.jsx";
import "./index.css";
import Navbar from "./components/common_Page/navbar.jsx";
import Footer from "./components/common_Page/footer.jsx";
import RecuriterSideLayouts from "./components/recuriter_Components/RecuriterSideLayouts.jsx";
import Login from "./components/common_Dashboard/Pages/signIn";
import SignUp from "./components/common_Dashboard/Pages/signUp.jsx";
import { Routes, Route } from "react-router-dom";
import Home from './components/VideoCalling/lobby.jsx';
import Room from './components/VideoCalling/Screen.jsx';
import EmailPage from "./components/VideoCalling/EmailPage.jsx";
import UserSideLayouts from "./components/user_Components/UserSideLayout.jsx";
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
        <Route path="/dashboard/*" element={<RecuriterSideLayouts />} />
        <Route path="/user/dashboard/*" element={<UserSideLayouts />} />
        <Route path="/home" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path='/email-page/:roomId' element={<EmailPage />} />
      </Routes>
    </>
  );
}

export default App;
