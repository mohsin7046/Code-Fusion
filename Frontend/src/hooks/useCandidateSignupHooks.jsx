import {useState} from 'react'

 function UseCandidateSignupHooks() {
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const signup = async ({username, email, password, confirmpassword,skills,location,socialLinks}) =>{
        try{
            const role = "CANDIDATE";
            setLoading(true);
            if (password !== confirmpassword) {
                setError("Passwords do not match!");
                setLoading(false);
                return;
            }
            if (!username || !email || !password || !confirmpassword || skills.length === 0 || socialLinks.length === 0 || !location) {
                setError("All fields are required!");
                setLoading(false);
                return;
            }   
            const response = await fetch('/api/auth/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confirmpassword,skills,location,socialLinks,role })
            });
            const data = await response.json();
            
            if(data.error){
                setError(data.error);
            }
            setLoading(false);
            console.log(data);
            return data;
        }catch(error){
            console.log("Error in candidate signup hook: " + error);
            setError(error);
            return null;
        }
    }
    return {loading,error,signup};
}

export default UseCandidateSignupHooks;