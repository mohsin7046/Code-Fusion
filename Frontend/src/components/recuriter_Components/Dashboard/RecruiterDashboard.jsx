import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-gray-900 mb-6">
          Recruiter Dashboard
        </h1>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Welcome to your dashboard! As a recruiter, you can schedule AI-powered interviews or initiate phone screening calls with potential candidates. Use the tools below to streamline your hiring process efficiently.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* AI Interview Card */}
          <div className="bg-white p-8 shadow-2xl rounded-xl hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Create New Interview
            </h2>
            <p className="text-gray-700 mb-6">
              Design and schedule AI-based interviews that can automatically evaluate candidates based on pre-defined job roles and skills. Save time and increase interview accuracy.
            </p>
            <Link to="/dashboard/create-interview">
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition">
                Start Now
              </button>
            </Link>
          </div>

          {/* Phone Screening Card */}
          <div className="bg-white p-8 shadow-2xl rounded-xl hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Create Phone Screening Call
            </h2>
            <p className="text-gray-700 mb-6">
              Schedule phone screening sessions with candidates to understand their communication, experience, and availability before proceeding to final rounds.
            </p>
            <Link to="/dashboard/meetings">
              <button className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition">
                Start Call
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
