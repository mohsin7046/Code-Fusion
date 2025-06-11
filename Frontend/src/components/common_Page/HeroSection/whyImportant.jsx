import React from "react";

function WhyImportant() {
  return (
    <div className="py-12 bg-gray-50" id="importance">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Why it’s important?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          How much time are you and your team spending in{' '}
          <span className="font-semibold">unproductive meetings</span>? With our
          platform, combine collaboration, coding, and meeting management to
          ensure every moment adds value. Say goodbye to wasted hours and hello
          to streamlined productivity.
        </p>

        <div className="relative flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-4">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full transform hover:scale-105 transition">
            <p className="text-blue-600 font-bold text-lg">“</p>
            <p className="text-gray-800 font-medium text-xl mb-4">
              62% felt <br />
              <span className="text-gray-600">
                that meetings take time away from team bonding opportunities
              </span>
            </p>
            <p className="text-sm text-gray-500">SOURCE: Harvard Business Review</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full transform hover:scale-105 transition border-2 border-blue-500">
            <p className="text-blue-600 font-bold text-lg">“</p>
            <p className="text-gray-800 font-medium text-xl mb-4">
              64% believe <br />
              <span className="text-blue-600 font-semibold">
                that meetings jeopardize deep thought processes
              </span>
            </p>
            <p className="text-sm text-gray-500">SOURCE: Harvard Business Review</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full transform hover:scale-105 transition">
            <p className="text-blue-600 font-bold text-lg">“</p>
            <p className="text-gray-800 font-medium text-xl mb-4">
              Meetings take time <br />
              <span className="text-gray-600">away from focused work</span>
            </p>
            <p className="text-sm text-gray-500">SOURCE: Harvard Business Review</p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-gray-600 mb-4">
            Feeling like there aren’t enough hours in the day is a common
            problem faced by many leaders in this world. <br />
            <span className="font-semibold">
              Try post-meeting surveys now and avoid wasting time.
            </span>
          </p>
          <button className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-600 transition">
            Sign up today
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhyImportant;
