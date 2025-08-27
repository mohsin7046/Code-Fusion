import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ShortList_Details() {
  const jobId = useParams().id;
  console.log("Job ID:", jobId);

  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerLetter, setOfferLetter] = useState(null);

  useEffect(() => {
    const fetchVerifyData = async () => {
      try {
        const res = await fetch("/api/recruiter/shortlistedCandidates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId }),
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (data.success && data.data) {
          
          const candidateArray = Array.isArray(data.data)
            ? data.data
            : [data.data];

          setCandidates(candidateArray);
        } else {
          setCandidates([]);
        }
      } catch (error) {
        console.error("Error fetching shortlisted candidates:", error);
      }
    };

    fetchVerifyData();
  }, [jobId]);

 const handleFileUpload = async () => {
    try {
      if (!offerLetter) {
        alert("Please upload an offer letter before submitting!");
        return;
      }

      console.log(offerLetter);
      
      const formData = new FormData();
      formData.append("jobId", jobId);
    formData.append("candidateId", selectedCandidate.candidateId);
    formData.append("offerLetter", offerLetter); 

      const res = await fetch("/api/recruiter/offerLetterUpload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert(`Offer letter uploaded successfully for ${selectedCandidate.name}`);
        console.log("Upload Response:", result);
        setShowModal(false);
        setOfferLetter(null);

      } else {
        alert(result.message || "Failed to upload offer letter");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Something went wrong while uploading the file!");
    }
  };

  const handleHireClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setOfferLetter(e.target.files[0]);
  };


  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Candidates for Job {jobId}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border">ID</th>
              <th className="px-4 py-2 text-left border">Name</th>
              <th className="px-4 py-2 text-left border">Email</th>
              <th className="px-4 py-2 text-left border">Applied Date</th>
              <th className="px-4 py-2 text-center border">Hire</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? (
              candidates.map((c, index) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{c.name}</td>
                  <td className="px-4 py-2 border">{c.candidateId}</td>
                  <td className="px-4 py-2 border">
                    {new Date(c.job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleHireClick(c)}
                    >
                      Hire
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Upload Offer Letter for {selectedCandidate.name}
            </h3>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mb-4 block w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  setOfferLetter(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleFileUpload}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
