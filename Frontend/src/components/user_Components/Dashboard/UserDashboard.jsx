import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const barData = [
  { name: 'Jan', Attempts: 3, Shortlisted: 1, Failed: 2 },
  { name: 'Feb', Attempts: 4, Shortlisted: 2, Failed: 2 },
  { name: 'Mar', Attempts: 5, Shortlisted: 3, Failed: 2 },
  { name: 'Apr', Attempts: 6, Shortlisted: 4, Failed: 2 },
  { name: 'May', Attempts: 7, Shortlisted: 5, Failed: 2 },
];

const pieData = [
  { name: 'Shortlisted', value: 15 },
  { name: 'Failed', value: 10 },
];

const COLORS = ['#10b981', '#ef4444']; // Green, Red

const UserDashboard = () => {
  return (
    <div className="flex flex-col h-auto w-full text-black px-6 py-10 bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-10 text-center">User Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold">Total Attempted</h2>
          <p className="text-2xl mt-2 text-indigo-600 font-bold">35</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold">Shortlisted</h2>
          <p className="text-2xl mt-2 text-green-500 font-bold">15</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold">Failed</h2>
          <p className="text-2xl mt-2 text-red-500 font-bold">20</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="bg-white shadow-md rounded-xl p-8">
        <h2 className="text-xl font-medium text-gray-700 text-center mb-6">
          Detailed Feedback Of Student in all attempted Interviews in Form of Graphs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
          {/* Bar Chart */}
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Attempts" fill="#6366f1" />
                <Bar dataKey="Shortlisted" fill="#10b981" />
                <Bar dataKey="Failed" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full h-full flex items-center justify-center">
            <ResponsiveContainer width="80%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
