import React from "react";

function AboutUs() {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50" id="about">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:pr-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Transform your meetings into highly effective sessions with these core essentials:
            </p>
            <ul className="list-none text-gray-800 mb-8 space-y-4">
              {["Set a cadence for your team meetings.",
                "Have a clear meeting objective and agenda.",
                "Start on time and end on time.",
                "Include the right attendees.",
                "Define clear action items (who, what, when)."].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-lg">{item}</span>
                  </li>
              ))}
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              With the integrated <span className="font-semibold text-blue-500">Code Editor</span>, participants can collaborate on coding tasks during meetings.
              <span className="font-bold text-blue-600"> Rate It</span> ensures productive, efficient, and engaging meetings by collecting real-time feedback and fostering collaborative teamwork.
            </p>
          </div>

          {/* Right Content */}
          <div className="relative flex justify-center">
            <div className="w-full h-72 lg:h-96 bg-blue-100 rounded-lg overflow-hidden shadow-lg"></div>
            <div className="absolute inset-0 flex justify-center items-center p-9">
              <div className="bg-blue-50 bg-opacity-75 px-6 py-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-600">Foster Collaboration</h3>
                <p className="text-sm text-gray-600">
                  Empower your team to achieve more with streamlined workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
