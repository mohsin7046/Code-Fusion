import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getToken from "../../../hooks/role";

function UserAllInterviews() {
  const formData = getToken();
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchCurrentInterviews = async () => {
      try {
        const res = await fetch('/api/user/onlinetest/getUserDashboardData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await res.json();
        console.log("Current Interviews Data:", data);

        if (!res.ok) {
          console.log("Error fetching current interviews:", data.message);
          throw new Error(data.message || "Failed to fetch current interviews");
        }

        setInterviews(data?.data || []);
      } catch (error) {
        console.error("Error fetching current interviews:", error);
      }
    };

    fetchCurrentInterviews();
  }, []);

  const handleNavigate = (jobId) => {
    navigate(`/user/dashboard/all-interview/${jobId}`, { state: { jobId } });
  };

  return (
    <div className="p-6 text-black">
      <div className="flex flex-row items-center font-semibold text-3xl self-start">
        <ArrowLeft onClick={() => window.location.href = '/dashboard'} className="w-8 h-5 mb-4 cursor-pointer" />
        <h2 className="text-2xl font-semibold mb-4 ml-2">Current Interviews</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">More</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {interviews.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.interviewRole}</td>
                <td className="px-4 py-2 border">{item.description}</td>
                <td className="px-4 py-2 border">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{item.time}</td>
                <td className="px-4 py-2 border">
                  {item.CandidateJobApplication?.[0]?.status || 'Pending'}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    Detailed Overview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserAllInterviews;
