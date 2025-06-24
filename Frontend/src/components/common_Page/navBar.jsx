import  { useState } from "react";
import { Link } from "react-router-dom";
import  {UseOnLogout}  from "../../hooks/useOnLogout";
import getToken from "../../hooks/role";
import { toast } from "react-toastify";
function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

   const { logout } = UseOnLogout();
   
    const onLogout = () =>{
        toast.success("Logout successfully");
        logout();
    }
     
    const role = getToken();

    return (
        <nav className="bg-white shadow-md top-0 left-0 fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                      
                        <span className="ml-2 text-2xl font-bold text-gray-800">
                            Code Fusion
                        </span>
                    </div>

                    <div className="lg:flex hidden md:flex space-x-8">
                        <a href="#home" className="text-gray-600 hover:text-blue-600">
                            Home
                        </a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">
                            How it works
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-blue-600">
                            Pricing
                        </a>
                        <a href="#importance" className="text-gray-600 hover:text-blue-600">
                            Why it’s important
                        </a>
                        <a href="#about" className="text-gray-600 hover:text-blue-600">
                            About us
                        </a>
                        <a href="#contact" className="text-gray-600 hover:text-blue-600">
                            Contact
                        </a>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {role ? 
                        <button onClick={onLogout} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                            logout
                        </button> :
                        <>
                        <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                            Login
                        </Link>
                        <Link to="/recuriter-signup" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                            Sign up
                        </Link>
                        </>
                        }
                        
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#how-it-works" className="block text-gray-600 hover:text-blue-600">
                            How it works
                        </a>
                        <a href="#pricing" className="block text-gray-600 hover:text-blue-600">
                            Pricing
                        </a>
                        <a href="#importance" className="block text-gray-600 hover:text-blue-600">
                            Why it’s important
                        </a>
                        <a href="#about" className="block text-gray-600 hover:text-blue-600">
                            About us
                        </a>
                        <a href="#contact" className="block text-gray-600 hover:text-blue-600">
                            Contact
                        </a>
                    </div>
                    <div className="px-4 py-4 space-x-4">
                         {role ? 
                        <button onClick={onLogout} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                            logout
                        </button> :
                        <>
                        <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                            Login
                        </Link>
                        <Link to="/recuriter-signup" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                            Sign up
                        </Link>
                        </>
                        }
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
