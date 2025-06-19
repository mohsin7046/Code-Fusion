/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import getToken from "../../hooks/role.js";
const UserProtectedRoute = ({ children }) => {
    const tokenData = getToken();
    if (!tokenData.role ) {
        return <Navigate to="/login" replace />;
    }
    
    if (tokenData.role === "CANDIDATE") {
        return children;
    }
    
    return <Navigate to="/" replace />;
};

export default UserProtectedRoute;
