import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
const getToken = () => {
   const token = Cookies.get("token");
   if(!token){
        console.error("No token found in cookies");
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);

        if (!decodedToken || !decodedToken.role) {
            console.error("Decoded token is invalid or does not contain a role");
            return null;
        }
        return { role: decodedToken.role, userId: decodedToken.id };
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    } 
}

export const getRecruiterToken = () => {
    const token = Cookies.get("jobToken");
    if (!token) {
        console.error("No job token found in cookies");
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);

        if (!decodedToken) {
            console.error("Decoded job token is invalid");
            return null;
        }
        return { recruiterId: decodedToken.recruiterId, jobId: decodedToken.jobId };
    } catch (error) {
        console.error("Error decoding job token:", error);
        return null;
    }
}
export default getToken;
