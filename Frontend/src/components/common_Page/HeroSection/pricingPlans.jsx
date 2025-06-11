import React from "react";

function PricingPlans() {
  return (
    <div className="py-12 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Customizable plans for every company
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          With our scalable packages, you can pay for what you need and leave
          out what you don’t. We will grow with you. <br />
          <span className="font-semibold">
            Figure out what package is best for you
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Free</h3>
            <p className="text-4xl font-bold text-gray-800 mb-4">
              $0<span className="text-lg font-medium">/m</span>
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✔ 1 user 1 connected calendar</li>
              <li>✔ Up to 12 responses</li>
              <li>✔ Up to 3 survey results archived</li>
              <li>✔ Knowledge base</li>
              <li>...</li>
            </ul>
            <button className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition">
              Get Free
            </button>
          </div>

          <div className="bg-blue-500 text-white shadow-lg rounded-lg p-6 transform scale-105">
            <h3 className="text-lg font-bold mb-4">Personal</h3>
            <p className="text-4xl font-bold mb-4">
              $5<span className="text-lg font-medium">/m</span>
            </p>
            <div className="flex justify-center space-x-4 mb-6">
              <button className="bg-white text-blue-500 font-medium py-1 px-4 rounded-md">
                Monthly
              </button>
              <button className="text-white font-medium py-1 px-4 rounded-md hover:underline">
                Annually
              </button>
            </div>
            <ul className="space-y-2 mb-6">
              <li>✔ 1 user up to 2 connected calendars</li>
              <li>✔ Up to 50 responses</li>
              <li>✔ Up to 10 survey results archived</li>
              <li>✔ Standard email & chat</li>
              <li>...</li>
            </ul>
            <button className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-md hover:bg-blue-100 transition">
              Get Personal
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Team</h3>
            <p className="text-4xl font-bold text-gray-800 mb-4">
              $10<span className="text-lg font-medium">/m</span>
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>
                ✔ Per user in company domain with single calendar integrations
              </li>
              <li>✔ Unlimited responses</li>
              <li>✔ Unlimited survey results archived</li>
              <li>✔ Priority email & chat</li>
              <li>...</li>
            </ul>
            <button className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition">
              Get Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPlans;
