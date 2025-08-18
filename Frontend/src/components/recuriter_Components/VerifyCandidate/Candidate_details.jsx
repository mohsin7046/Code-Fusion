import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CandidateTable() {
  
  const jobId = useParams().id;
  console.log("Job ID:", jobId);
  

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [process, setProcess] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`/api/recruiter/getAllAppliedCandidates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();
        console.log("API Response:", data);

        setCandidates(data.data || []);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
    setProcess(localStorage.getItem(`processApplication`));
  }, [jobId]);

  const handleClick = async (email, status) => {
    const res = await fetch(`/api/recruiter/acceptReject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, jobId, status }),
    });
    if (!res.ok) {
      alert("Error updating candidate status");
      return;
    }
    const data = await res.json();
    console.log("Update Response:", data);
    alert(data.message || "Candidate status updated successfully");
  };

  const setProcessApplication = async () => {
    const res = await fetch('/api/recruiter/processApplication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
  });

    if(!res.ok) {
      alert("Error processing applications");
      return;
    }
    const data = await res.json();
    localStorage.setItem(`processApplication`, true);
    console.log("Process Response:", data);
  }



  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Candidates</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border">ID</th>
              <th className="px-4 py-2 text-left border">College</th>
              <th className="px-4 py-2 text-left border">Email</th>
              <th className="px-4 py-2 text-center border">View</th>
              <th className="px-4 py-2 text-center border">Accept</th>
              {/* <th className="px-4 py-2 text-center border">Reject</th> */}
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? (
              candidates.map((c, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{c.collegeName}</td>
                  <td className="px-4 py-2 border">{c.email}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      // disabled={c.isAccepted}
                      onClick={() => c.isAccepted ? handleClick(c.email, "reject") : handleClick(c.email, "accept")}
                      className={
                        c.isAccepted
                          ? "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          : "bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      }
                    >
                      {c.isAccepted ? "Reject" : "Accept"}
                    </button>
                  </td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
     <div className="flex justify-end mt-4">
        <button
        disabled={process}
          className={process ? "bg-gray-500 cursor-not-allowed  text-white px-6 py-2 rounded-lg shadow-lg":"bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 hover:from-indigo-600 transition-all duration-200 font-semibold"}
          onClick={setProcessApplication}
        >
          Process
        </button>
      </div>


      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
              onClick={() => setSelectedCandidate(null)}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Candidate Details
            </h3>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">College:</span>{" "}
                {selectedCandidate.collegeName}
              </p>
              <p>
                <span className="font-semibold">Branch:</span>{" "}
                {selectedCandidate.branch}
              </p>
              <p>
                <span className="font-semibold">Passing Year:</span>{" "}
                {selectedCandidate.passingYear}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedCandidate.email}
              </p>
              <p>
                <span className="font-semibold">SSC %:</span>{" "}
                {selectedCandidate.sscPercentage}
              </p>
              <p>
                <span className="font-semibold">HSC %:</span>{" "}
                {selectedCandidate.hscPercentage}
              </p>
              <p>
                <span className="font-semibold">Last Sem CGPA:</span>{" "}
                {selectedCandidate.lastSemesterCGPA}
              </p>
            </div>

            <div className="mt-5">
              <h4 className="text-lg font-semibold mb-2">📂 Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href={selectedCandidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Resume
                </a>
                <a
                  href={selectedCandidate.sscUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  SSC Marksheet
                </a>
                <a
                  href={selectedCandidate.hscUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  HSC Marksheet
                </a>
                <a
                  href={selectedCandidate.lastSemesterMarksheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center p-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Last Sem Marksheet
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
