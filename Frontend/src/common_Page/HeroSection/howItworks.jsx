import React from "react";
import googleSvg from "../../assets/google.svg";
import customizeSvg from "../../assets/customize.svg";
import codeSvg from "../../assets/code.svg";

function HowItWorks() {
  return (
    <div className="flex w-full justify-center content-center py-12 bg-gray-50" id="how-it-works">
      <div className="mx-auto px-7 sm:px-6 lg:px-8 max-w-screen-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How it works?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
          {[
            {
              title: 'Click Google Integration',
              description: 'Simply log into your Google account, then seamlessly integrate and mirror your planned meetings.',
              icon: <img src={googleSvg} alt="Google" className="w-12 h-12" />,
            },
            {
              title: 'Customization',
              description: 'Whatever the goals of your team or organization, create a survey to better help you understand the minds of those involved.',
              icon: <img src={customizeSvg} alt="Customize" className="w-12 h-12" />,
            },
            {
              title: 'Code Editor',
              description: 'Automatically triggered emails collect feedback while you code. Manage meetings and track progress seamlessly in your dashboard with clean, organized data.',
              icon: <img src={codeSvg} alt="Code" className="w-12 h-12" />,
            },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 w-full transition-transform transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex justify-center mb-4 text-blue-500">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
