import {useState} from 'react'

 function UseSignupHooks() {
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const signup = async ({username, email, password, confirmpassword}) =>{
        try{
            setLoading(true);
            const response = await fetch('/api/auth/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confirmpassword })
            });
            const data = await response.json();
            
            if(data.error){
                setError(data.error);
            }
            setLoading(false);
            console.log(data);
            
        }catch(error){
            setError(error);
        }
    }
    return {loading,error,signup};
}

export default UseSignupHooks;