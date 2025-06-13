/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import getToken from "../../hooks/role.js";

const RecuriterProtectedRoute = ({ children }) => {
  
    const role = getToken();
    
    if (!role) {
        return <Navigate to="/login" replace />;
    }
    
    if (role === "RECRUITER") {
        return children;
    }
    
    return <Navigate to="/" replace />;
};

export default RecuriterProtectedRoute;
