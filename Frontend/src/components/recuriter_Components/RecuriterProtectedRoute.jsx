/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import getToken from "../../hooks/role.js";

const RecuriterProtectedRoute = ({ children }) => {
  
    const tokenData = getToken();
    console.log("Recruiter token data:", tokenData);
    
    
    if (!tokenData.role) {
        return <Navigate to="/login" replace />;
    }
    
    if (tokenData.role === "RECRUITER") {
        return children;
    }
    
    return <Navigate to="/" replace />;
};

export default RecuriterProtectedRoute;
