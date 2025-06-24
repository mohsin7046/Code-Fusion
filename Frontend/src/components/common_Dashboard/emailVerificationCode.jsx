/* eslint-disable no-unused-vars */
import { useLocation } from 'react-router-dom';
import Email from '../../assets/Email.png'
import { useState } from 'react';
import { toast } from 'react-toastify';


function EmailVerificationCode() {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [otp, setOtp] = useState('');
  const location = useLocation();
  const { userId, email } = location.state || {};
    if (!userId || !email) {
        console.log("Invalid state: userId or email is missing");
    }
    console.log("User ID:", userId);
    console.log("Email:", email);
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
           setLoading(true);
            const res = await fetch('/api/auth/verify-email',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, otp })
            })
            const data = await res.json();
            if(!res.ok){
                setError(data.message || "Verification failed");
                toast.error(data.message || "Verification failed")
                setLoading(false);
                return;
            }
            setLoading(false);
            toast.success(data.message);
            console.log("Email verified successfully");
            window.location.href = "/login";
            return;
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <img src={Email} alt="Email Verification" className="w-40 h-auto mx-auto" />
                    <h2 className="text-2xl font-bold mb-6 text-center">Email Verification</h2>
                    <p className="text-gray-600 mb-4">Please enter the verification code sent to your email.</p>
                    <form>
                        <input
                            type="text"
                            placeholder="Verification Code"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                            min={6}
                            max={6}
                            required
                            pattern="\d{6}" 
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                        />
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
                            disabled={loading}
                        >
                             {loading? "verifying..." : "Verify Email" }
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </div>
            </div>
        </>
    )
}

export default EmailVerificationCode;