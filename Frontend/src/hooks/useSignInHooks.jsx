import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
function useSignInHooks() {
    const next = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = async ({email,password}) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email,password}),
            });
            const data = await res.json();
            if (res.ok) {
                next("/");
            }
            setLoading(false);
            console.log(data);
            
        } catch (error) {
            setError(error);
            console.log("Error in signin hook"+error); 
            setLoading(false);
        }
    }

    return { loading, error, signIn };
}
export default useSignInHooks;
