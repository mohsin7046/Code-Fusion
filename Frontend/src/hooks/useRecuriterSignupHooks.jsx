import {useState} from 'react'

 function UseRecuriterSignupHooks() {
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const signup = async ({username, email, password, confirmpassword,company_name,company_description,company_role,company_website,company_location}) =>{
        try{
            const role = "RECRUITER";
            setLoading(true);

            if (password !== confirmpassword) {
                setError("Passwords do not match!");
                setLoading(false);
                return;
            }
            if (!username || !email || !password || !confirmpassword || !company_name || !company_description || !company_role || !company_website || !company_location) {
                setError("All fields are required!");
                setLoading(false);
                return;
            }  

            const response = await fetch('/api/auth/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confirmpassword,role,company_name,company_description,company_role,company_website,company_location})
            });
            const data = await response.json();
            
            if(data.error){
                setError(data.error);
            }
            setLoading(false);
            console.log(data);
            return data;
            
        }catch(error){
            setError(error);
            return null;
        }
    }
    return {loading,error,signup};
}

export default UseRecuriterSignupHooks;