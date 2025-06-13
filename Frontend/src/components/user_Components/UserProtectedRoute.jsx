/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import getToken from "../../hooks/role.js";
const UserProtectedRoute = ({ children }) => {
    const role = getToken();
    if (!role) {
        return <Navigate to="/login" replace />;
    }
    
    if (role === "CANDIDATE") {
        return children;
    }
    
    return <Navigate to="/" replace />;
};

export default UserProtectedRoute;
