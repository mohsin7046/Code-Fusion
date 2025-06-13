import  { useState } from "react";
import LoginAnimationHelper from "../../../Utilities/signInAnimation";
import useSignInHooks from "../../../hooks/useSignInHooks";
import { Link } from "react-router-dom";
import { LoaderCircle } from 'lucide-react';
import { toast,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading , setLoading] = useState(false);
  const {signIn} = useSignInHooks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn({email, password});

    if(!res.ok){
      setLoading(false);
      toast.error(res.message || "Login failed");
      return;
    }
    toast.success("Login successfully");
    setLoading(false);
  };

  return (
    <>
     <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl bg-white shadow-lg rounded-lg p-8 gap-8">
       
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-80 h-80">
            <LoginAnimationHelper width={320} height={320} autoplay={true} />
          </div>
        </div>
        <div className="w-full md:w-1/2 border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div>
              <button
             type="submit"
             className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                 {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "Login"}
             </button>
            </div>
            <div>
              <p>
                forgot your password? <Link to="/forgot-password" className="text-blue-500 hover:underline">Reset it here</Link>
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
    </>
  );
};

export default Login;
