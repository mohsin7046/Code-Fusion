import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import getToken from '../../../hooks/role.js';

function Verify_candidate() {
  const navigate = useNavigate();
  const formData = getToken();

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchVerifyData = async () => {
      try {
        const res = await fetch('/api/recruiter/current-interview-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: formData.userId, status: "YET_TO_START" }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("Error fetching current interviews:", data.message);
          throw new Error(data.message || "Failed to fetch current interviews");
        }

        console.log("API Response:", data);

        setInterviews(data.data || []);

      } catch (error) {
        console.error("Error fetching current interviews:", error);
      }
    };

    fetchVerifyData();
  }, [formData.userId]);

  const handleNavigate = (index,id) => {
    navigate(`/dashboard/candidate-details/${id}`);
  };

  return (
    <div className="p-6 text-black">
      <div className="flex flex-row items-center font-semibold text-3xl self-start">
        <ArrowLeft
          onClick={() => (window.location.href = "/dashboard")}
          className="w-8 h-5 mb-4 cursor-pointer"
        />
        <h2 className="text-2xl font-semibold mb-4 ml-2">Current Interview</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Total Candidates</th>
              <th className="px-4 py-2 border">More</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {interviews.length > 0 ? (
              interviews.map((item, index) => (
                <tr key={item.id} className="transition">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{item.interviewRole}</td>
                  <td className="px-4 py-2 border">{item.description}</td>
                  <td className="px-4 py-2 border">{item.date?.split("T")[0]}</td>
                  <td className="px-4 py-2 border">{item.time}</td>
                  <td className="px-4 py-2 border">{item.totalApplicants ?? 0}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleNavigate(index, item.id)}
                      className="bg-gray-700 text-white px-3 py-1 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No interviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Verify_candidate;
