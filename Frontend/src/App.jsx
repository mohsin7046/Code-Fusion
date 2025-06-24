import LandingPage from "./components/common_Page/landingPage.jsx";
import { ToastContainer } from "react-toastify";
import "./index.css";
import Navbar from "./components/common_Page/navbar.jsx";
import Footer from "./components/common_Page/footer.jsx";
import RecuriterSideLayouts from "./components/recuriter_Components/RecuriterSideLayouts.jsx";
import Login from "./components/common_Dashboard/Pages/signIn";
import { Routes, Route } from "react-router-dom";
import Home from './components/VideoCalling/lobby.jsx';
import Room from './components/VideoCalling/Screen.jsx';
import EmailPage from "./components/VideoCalling/EmailPage.jsx";
import UserSideLayouts from "./components/user_Components/UserSideLayout.jsx";
import EmailVerificationCode from "./components/common_Dashboard/emailVerificationCode.jsx";
import UserSignUp from "./components/user_Components/UserSignUp.jsx";
import RecuriterSignUp from "./components/recuriter_Components/RecuriterSignUp.jsx";
import ForgotPassword from "./components/common_Dashboard/ForgotPassword.jsx";
import ResetPassword from "./components/common_Dashboard/ResetPassword.jsx";
import UserProtectedRoute from "./components/user_Components/UserProtectedRoute.jsx";
import RecuriterProtectedRoute from "./components/recuriter_Components/RecuriterProtectedRoute.jsx";
import OnlineTest_StartScreen from "./components/user_Components/OnlineTest_Screen/OnlineTest_StartScreen.jsx";
import AIInterviewSession from "./components/user_Components/BehaviourTest_Screen/BehaviourTest_MainScreen.jsx";
import BehaviourFeedback from "./components/user_Components/BehaviourTest_Screen/BehaviourFeedback.jsx";
import CommonTestAuthenticator from "./components/user_Components/CommonTestAuthenticator.jsx";


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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/recuriter-signup" element={<RecuriterSignUp />} />
        <Route path="/email-verification" element={<EmailVerificationCode />} />
        <Route path="/dashboard/*" element={<RecuriterProtectedRoute  ><RecuriterSideLayouts /> </RecuriterProtectedRoute>} />
        <Route path="/user/dashboard/*" element={<UserProtectedRoute><UserSideLayouts /> </UserProtectedRoute>} />
        <Route path="/home" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path='/email-page/:roomId' element={<EmailPage />} />
        <Route path='/testdes/:name/:JobId' element={<CommonTestAuthenticator />} />
        <Route path='/test' element={<OnlineTest_StartScreen />} />
        <Route path='/AItest' element={<AIInterviewSession />} />
        <Route path='/feed' element={<BehaviourFeedback />} />

      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
