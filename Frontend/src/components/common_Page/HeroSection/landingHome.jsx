
import { Link } from "react-router-dom";
import AnimationHome from '../../../Utilities/homeAnimation';

function LandingHome() {
  return (
    <section className="bg-white py-16 mt-5 h-screen content-center items-center" id="home">
      <div className="mx-auto px-4 sm:px-8 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between md:space-x-8">
          {/* Left Section */}
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <h1 className=" text-3xl lg:text-4xl font-light text-black leading-tight">
              Unleash the Power of{' '}
              <h1 className="text-black font-bold">Productive meetings</h1>
            </h1>
            <p className="mt-4 text-base lg:text-xl text-black">
              Built for Teams, Perfected for Coders.
            </p>
            <div className="mt-8 flex justify-center md:justify-start space-x-4">
              <Link to="/dashboard" className="py-3 w-48 text-center bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-700">
                Get Started
              </Link>
              <button className="py-3 w-44 border border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50">
                Sign up with Google
              </button>
            </div>
          </div>

          {/* Right Section (Animation) */}
          <div className="md:w-1/2 flex mt-5 justify-center">
            <AnimationHome />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingHome;
