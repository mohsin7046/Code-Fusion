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
        return decodedToken.role;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    } 
}
export default getToken;
