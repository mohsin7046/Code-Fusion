import { useCallback, useEffect, useState } from "react";
import SignupAnimation from "../../Utilities/signUpAnimation";
import { useNavigate } from "react-router-dom";
import UseCandidateSignupHooks from "../../hooks/useCandidateSignupHooks";
import { LoaderCircle } from 'lucide-react';
import {validateUrl,validateUserEmail,checkPasswordCriteria} from '../../hooks/validations.js';
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [leetcode, setLeetcode] = useState('');

  const [emailError, setEmailError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({});

  const { signup,loading } = UseCandidateSignupHooks();
  const navigate = useNavigate();

  const validPassword = {
    hasLowercase: "• Must include a lowercase letter",
    hasUppercase: "• Must include an uppercase letter",
    hasDigit: "• Must include a digit",
    hasSpecialChar: "• Must include a special character",
    isMinLength: "• Must be at least 6 characters long"
  }

  
  const debouncePasswordValidation = useCallback((password) => {
    const timeoutId = setTimeout(() => {
      if (password) {
        const criteria = checkPasswordCriteria(password);
        setPasswordCriteria(criteria);
      } else {
        setPasswordCriteria({});
      }
    }, 1000); 

    return () => clearTimeout(timeoutId);
  }, []);

   useEffect(() => {
    const cleanup = debouncePasswordValidation(password);
    return cleanup;
  }, [password, debouncePasswordValidation]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidEmail = validateUserEmail(email);
    if (!isValidEmail) {
      setEmailError('Not an Organization email');
      return;
    } else {
      setEmailError('');
    }

    const isUrlValid = validateUrl(linkedin);
    if (!isUrlValid) {
      setUrlError('Not a secure Website Url');
      return;
    } else {
      setUrlError('');
    }

    if (password !== confirmpassword) {
      toast.error('Passwords do not match!');
      return;
    }

    const socialLinks = [linkedin, github, leetcode].filter(Boolean);
    const skillList = skills.split(',').map(skill => skill.trim()).filter(Boolean);

    const res = await signup({
      username,
      email,
      password,
      confirmpassword,
      location,
      skills: skillList,
      socialLinks
    });

    console.log("Signup response:", res);
    

    if (res.newUser?.id && res.newUser?.email) {
      const otpRes = await fetch('/api/auth/send-email-otp',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: res.newUser.id,email: res.newUser.email }),
      })

      if (!otpRes.ok) {
        const data = await otpRes.json();
        toast.error(data.message || "Failed to send verification email");
        return; 
      }

      toast.success("Signup successful! Please verify your email.");
      navigate("/email-verification", {
        state: { userId: res.newUser.id, email: res.newUser.email },
      });
    } else {
       toast.error(res.message || "Signup failed. Please try again.");
    }
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
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl bg-white shadow-lg rounded-lg p-8 gap-8">
        
        
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-80 h-80">
            <SignupAnimation width={350} height={350} autoplay={true} />
          </div>
        </div>

        
        <div className="w-full md:w-1/2 border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Candidate Signup
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Username<span className="text-red-500">*</span></label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Enter username" required/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Enter email" required/>
                  {emailError && <p className="text-red-500">{emailError}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password<span className="text-red-500">*</span></label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Password" required />
                  <ul className="text-red-600 text-sm">
                {Object.entries(passwordCriteria)
                 .filter(([, passed]) => !passed)
                .map(([key]) => (
                  <li key={key}>{validPassword[key]}</li>
              ))}
              </ul>
            </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm Password<span className="text-red-500">*</span></label>
                <input type="password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Confirm Password" required/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Location<span className="text-red-500">*</span></label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="City, Country" required/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Skills (comma-separated)<span className="text-red-500">*</span></label>
                <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="e.g. React, Node.js" required/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">LinkedIn<span className="text-red-500">*</span></label>
                <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="https://linkedin.com/in/yourprofile" required/>
                  {urlError && <p className="text-red-500">{urlError}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">GitHub</label>
                <input type="url" value={github} onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="https://github.com/yourhandle" />
                  {urlError && <p className="text-red-500">{urlError}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">LeetCode</label>
                <input type="url" value={leetcode} onChange={(e) => setLeetcode(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="https://leetcode.com/yourhandle" />
                  {urlError && <p className="text-red-500">{urlError}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="terms" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} required
                className="h-4 w-4 text-blue-500 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the <span className="text-blue-500 hover:underline">Terms and Conditions</span><span className="text-red-500">*</span>
              </label>
            </div>
            <div>
              
              <button type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "SignUp"}
              </button>
              
            </div>
            <p className="text-sm text-center text-gray-700 mt-4">
              Want to hire instead?{" "}
            <span
              onClick={() => navigate("/recuriter-signup")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Go to Recruiter Signup
            </span>
          </p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserSignUp;
