/* eslint-disable react/prop-types */
import { XCircle, User, Mail, Award, AlertTriangle } from "lucide-react";

const CandidateDetailView = ({ candidate, selectedTest, selectedView, setShowDetailedOverview }) => {
  console.log(candidate);
  const testData = {
    online: { name: "Online Test" },
    behavioral: { name: "Behavioral Test" },
    coding: { name: "Coding Test" },
  };

  
  let data=null;

  // if(selectedTest == 'online'){
  //   data = candidate;
  // }
  // if(selectedTest == 'behavioral'){
  //   data = candidate;
  // }
  data = candidate;

console.log(data);


  const getStatusColor = (status) => {
    switch (status) {
      case "PASSED":
        return "text-green-600 border-green-600";
      case "FAILED":
        return "text-red-600 border-red-600";
      default:
        return "text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-gray-300 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{data?.name}</h2>
            <p className="text-gray-600">Detailed Overview - {testData[selectedTest].name}</p>
          </div>
          <button onClick={() => setShowDetailedOverview(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-medium mb-3">Candidate Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span>{data?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>{data?.candidateId}</span>
                </div>
                {data?.percentage && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Award className="w-4 h-4" />
                    <span>Score: {data?.percentage}/100</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-medium mb-3">Test Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>Test Type: {testData[selectedTest].name}</div>
                <div>
                  Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(data?.status)}`}>{data?.status}</span>
                </div>
                {data?.date && <div>Date: {data?.date}</div>}
                {data?.interviewer && <div>Interviewer: {data?.interviewer}</div>}
              </div>
            </div>
          </div>

          
          {data.cheatingDetected && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="text-red-700 font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Cheating Detected
              </h3>
              <p className="text-sm text-red-700">{data?.cheatingReason}</p>
            </div>
          )}

          
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-medium mb-3">Feedback</h3>
              {selectedTest === "online" && (
                <p className="text-sm text-gray-700">{data?.feedback}</p>
              )}
              {selectedTest === "behavioral" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600 font-medium">Strengths:</span>
                    <p className="text-gray-700 mt-1">{data?.strengths}</p>
                  </div>
                  <div>
                    <span className="text-yellow-600 font-medium">Weaknesses:</span>
                    <p className="text-gray-700 mt-1">{data?.weaknesses}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Recommendations:</span>
                    <p className="text-gray-700 mt-1">{data?.recommendations}</p>
                  </div>
                </div>
              )}
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailView;