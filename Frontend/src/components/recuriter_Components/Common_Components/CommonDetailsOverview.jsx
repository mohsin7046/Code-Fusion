import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Eye,
  User,
  Mail,
  Award,
  XCircle,
  Toilet,
   AlertTriangle
} from "lucide-react";
import getToken from "../../../hooks/role.js";

const CommonDetailsOverview = () => {
  const [selectedTest, setSelectedTest] = useState("online");
  const [selectedView, setSelectedView] = useState("total");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailedOverview, setShowDetailedOverview] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [onlinedata, setonlinedata] = useState(null);
  const [behaviouraldata, setbehaviouraldata] = useState(null);

  const location = useLocation();
  const {jobId} = location.state;
  const recruiterToken = getToken();


  useEffect(() => {
    const handlegetbehaviouralCurrentData = async () => {
      try {
        const res = await fetch("/api/recruiter/get-dashboard-behaviour-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recruiterId: recruiterToken.userId,
            jobId: jobId,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching data:", data.message);
        }
        setbehaviouraldata(data);
        console.log("Fetched data from behaviour :", data);
        console.log("Fetched behaviour data:", behaviouraldata);
      } catch (error) {
        console.error("Error fetching behavioural test data:", error);
      }
    };

    const handlegetOnlineTestCurrentData = async () => {
      try {
        const res = await fetch("/api/recruiter/getOnlineTestData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recruiterId: recruiterToken.userId,
            jobId: jobId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching data from online:", data.message);
        }
        setonlinedata(data.data);
        console.log("Fetched data from online:", data);
        console.log("Fetched online data:", onlinedata);
      } catch (error) {
        console.error("Error fetching online test data:", error);
      }
    };

    const fetchData = async () => {
      try {
        await handlegetbehaviouralCurrentData();
        await handlegetOnlineTestCurrentData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("State Data", onlinedata);
  console.log("Behavior data", behaviouraldata);

  const testData = {
    online: {
      name: "Online Test",
      total: onlinedata,
      // total: [
      //   { id: 1, name: 'John Doe', email: 'john@example.com', score: 85, status: 'Completed', appliedDate: '2024-06-01' },
      //   { id: 2, name: 'Jane Smith', email: 'jane@example.com', score: 92, status: 'Completed', appliedDate: '2024-06-02' },
      //   { id: 3, name: 'Mike Johnson', email: 'mike@example.com', score: 78, status: 'Completed', appliedDate: '2024-06-03' },
      //   { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', score: 67, status: 'Completed', appliedDate: '2024-06-04' },
      //   { id: 5, name: 'Tom Brown', email: 'tom@example.com', score: 45, status: 'Completed', appliedDate: '2024-06-05' },
      // ],
      // shortlisted: [
      //   { id: 1, name: 'John Doe', email: 'john@example.com', score: 85, status: 'Qualified', threshold: 70 },
      //   { id: 2, name: 'Jane Smith', email: 'jane@example.com', score: 92, status: 'Qualified', threshold: 70 },
      //   { id: 3, name: 'Mike Johnson', email: 'mike@example.com', score: 78, status: 'Qualified', threshold: 70 },
      // ],
      shortlisted: onlinedata,
      feedback: onlinedata
    },
    behavioral: {
      name: "Behavioural Test",
      total: behaviouraldata?.data,
      shortlisted: behaviouraldata?.data,
      feedback: behaviouraldata?.data,
    },
    coding: {
      name: "Coding Test",
      total: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          status: "Scheduled",
          interviewer: "Tech Lead",
          date: "2024-06-20",
          platform: "CodeMeet Pro",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          status: "Completed",
          interviewer: "Senior Dev",
          date: "2024-06-18",
          platform: "CodeMeet Pro",
        },
      ],
      shortlisted: [
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          score: 90,
          status: "Qualified",
          problemsSolved: "3/3",
          codeQuality: "Excellent",
        },
      ],
      feedback: [
        {
          id: 2,
          name: "Jane Smith",
          score: 90,
          problemSolving: "Excellent",
          codeQuality: "Outstanding",
          systemDesign: "Very Good",
          feedback: "Impressive technical skills with clean, efficient code",
        },
      ],
    },
  };

  const testOptions = [
    { value: "online", label: "Online Test" },
    { value: "behavioral", label: "Behavioural Test" },
    { value: "coding", label: "Coding Test" },
  ];

  const getCurrentData = () => {
    return testData[selectedTest][selectedView] || [];
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "qualified":
        return "text-green-700 bg-green-50 border-green-200";
      case "scheduled":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "ongoing":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const renderTableHeaders = () => {
    if (selectedView === "total") {
      if (selectedTest === "online") {
        return (
          <tr className="border border-gray-300">
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              ID
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Email
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Score
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Applied Date
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Action
            </th>
          </tr>
        );
      } else if (selectedTest === "behavioral") {
        return (
          <tr className="border border-gray-300">
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              ID
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Email
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Date
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Duration
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Action
            </th>
          </tr>
        );
      } else {
        return (
          <tr className="border border-gray-300">
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              ID
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Email
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Date
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Platform
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Action
            </th>
          </tr>
        );
      }
    } else if (selectedView === "shortlisted") {
      return (
        <tr className="border border-gray-300">
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            ID
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Name
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Email
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Score
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Status
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Additional Info
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Action
          </th>
        </tr>
      );
    } else {
      return (
        <tr className="border border-gray-300">
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            ID
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Name
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Score
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Strengths
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Weaknesses
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Recommendations
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Action
          </th>
        </tr>
      );
    }
  };


  const getTestResponse = (item) => {
    if (selectedTest === "online") return item?.onlineTestResponse?.[0];
    if (selectedTest === "behavioral") return item?.aiInterviewResponse?.[0];
    return null; 
  };

  const getShortlistCondition = (item) => {
    if (selectedTest === "online") return item?.onlineTestResponse?.[0]?.passed;
    if (selectedTest === "behavioral")
      return item?.aiInterviewResponse?.[0]?.passed;
    if (selectedTest === "coding") return item?.status === "Qualified";
    return false;
  };

  const getFeedbackData = (item, testType) => {
    console.log("item",item);
    
  const response = testType === "online"
    ? item?.onlineTestResponse?.[0]
    : testType === "behavioral"
    ? item?.aiInterviewResponse?.[0]
    : item;

    console.log("reponse",response);
    
  return {
    name:
      response?.name || item.name || "Unknown",
    percentage:
      response?.percentage || response?.overallScore || 0,
    strengths:
      response?.strengths || item.leadership || item.problemSolving || "N/A",
    weaknesses:
      response?.weaknesses || item.teamwork || item.codeQuality || "N/A",
    feedback:
      response?.recommendations || item.feedback || item.systemDesign || "N/A",
  };
};




const CandidateDetailView = ({ candidate, selectedTest, selectedView, setShowDetailedOverview }) => {
  console.log(candidate);
  const testData = {
    online: { name: "Online Test" },
    behavioral: { name: "Behavioral Test" },
    coding: { name: "Coding Test" },
  };

  
  let data=null;

  if(selectedTest == 'online'){
    data = candidate?.onlineTestResponse[0];
  }
  if(selectedTest == 'behavioral'){
    data = candidate?.aiInterviewResponse[0];
  }

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
            <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
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
                  <span>{candidate.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>{candidate.candidateId}</span>
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
                  Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(candidate.status)}`}>{candidate.status}</span>
                </div>
                {candidate.date && <div>Date: {candidate.date}</div>}
                {candidate.interviewer && <div>Interviewer: {candidate.interviewer}</div>}
              </div>
            </div>
          </div>

          
          {data.cheatingDetected && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="text-red-700 font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Cheating Detected
              </h3>
              <p className="text-sm text-red-700">{data.cheatingReason}</p>
            </div>
          )}

          
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-gray-900 font-medium mb-3">Feedback</h3>
              {selectedTest === "online" && (
                <p className="text-sm text-gray-700">{data.feedback}</p>
              )}
              {selectedTest === "behavioral" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600 font-medium">Strengths:</span>
                    <p className="text-gray-700 mt-1">{data.strengths}</p>
                  </div>
                  <div>
                    <span className="text-yellow-600 font-medium">Weaknesses:</span>
                    <p className="text-gray-700 mt-1">{data.weaknesses}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Recommendations:</span>
                    <p className="text-gray-700 mt-1">{data.recommendations}</p>
                  </div>
                </div>
              )}
            </div>
          
        </div>
      </div>
    </div>
  );
};





  const renderTableRows = () => {
    const totaldata = getCurrentData();

    const data = totaldata?.CandidateJobApplication;
    const onlineTest = onlinedata?.onlineTests;
    const behavioralTest = behaviouraldata?.data?.behavioralInterviews;

    console.log("data log", data);

    return data?.map((item, index) => (
      <tr
        key={index}
        className="border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        {selectedView === "total" && selectedTest === "online" && (
          <>
            <td className="px-4 py-3 text-gray-700">{index + 1}</td>
            <td className="px-4 py-3 text-gray-900 font-medium">
              {item?.name}
            </td>
            <td className="px-4 py-3 text-gray-600">{item?.candidateId}</td>
            <td className="px-4 py-3 text-green-600 font-medium">
              {item.onlineTestResponse[0]?.percentage}/100
            </td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600">
              {item.onlineTestResponse[0]?.submittedAt.split("T")[0]}
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => {
                  const candidateData = {
                    ...item,

                    email:
                      item.email ||
                      `${item.name
                        .toLowerCase()
                        .replace(" ", ".")}@example.com`,

                    status: item.status || "Completed",
                  };
                  setSelectedCandidate(candidateData);
                  setShowDetailedOverview(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </button>
            </td>
          </>
        )}

        {selectedView === "total" && selectedTest === "behavioral" && (
          <>
            <td className="px-4 py-3 text-gray-700">{index + 1}</td>
            <td className="px-4 py-3 text-gray-900 font-medium">
              {item?.name}
            </td>
            <td className="px-4 py-3 text-gray-600">{item?.candidateId}</td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </td>

            <td className="px-4 py-3 text-gray-600">
              {item?.aiInterviewResponse[0]?.submittedAt.split("T")[0]}
            </td>
            <td className="px-4 py-3 text-gray-600">{item.duration}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => {
                  const candidateData = {
                    ...item,

                    email:
                      item.email ||
                      `${item.name
                        .toLowerCase()
                        .replace(" ", ".")}@example.com`,

                    status: item.status || "Completed",
                  };
                  setSelectedCandidate(candidateData);
                  setShowDetailedOverview(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </button>
            </td>
          </>
        )}

        {selectedView === "total" && selectedTest === "coding" && (
          <>
            <td className="px-4 py-3 text-gray-700">{index + 1}</td>
            <td className="px-4 py-3 text-gray-900 font-medium">
              {item?.onlineTestResponse[0]?.name}
            </td>
            <td className="px-4 py-3 text-gray-600">{item.email}</td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600">{item.interviewer}</td>
            <td className="px-4 py-3 text-gray-600">{item.date}</td>
            <td className="px-4 py-3 text-gray-600">{item.platform}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => {
                  // Create a complete candidate object for the modal
                  const candidateData = {
                    ...item,
                    // Ensure email is available for feedback view
                    email:
                      item.email ||
                      `${item.name
                        .toLowerCase()
                        .replace(" ", ".")}@example.com`,
                    // Ensure status is available for feedback view
                    status: item.status || "Completed",
                  };
                  setSelectedCandidate(candidateData);
                  setShowDetailedOverview(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </button>
            </td>
          </>
        )}

        {selectedView === "shortlisted" && getShortlistCondition(item) && (
          <>
            <td className="px-4 py-3 text-gray-700">{index + 1}</td>
            <td className="px-4 py-3 text-gray-900 font-medium">
              {item?.name}
            </td>
            <td className="px-4 py-3 text-gray-600">{item?.candidateId}</td>
            <td className="px-4 py-3 text-green-600 font-medium">
              {selectedTest == "online" ? `${getTestResponse(item)?.percentage}/100` : `${getTestResponse(item)?.overallScore}/100`}
            </td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600">
              {selectedTest === "online" &&
                `Threshold: ${onlineTest?.[0]?.passingScore}`}
              {selectedTest === "behavioral" &&
                `Cultural Fit: ${behavioralTest?.[0]?.passingScore}`}
              {selectedTest === "coding" && `Problems: ${item.problemsSolved}`}
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => {
                  const candidateData = {
                    ...item,
                    email:
                      item.email ||
                      `${item.name
                        .toLowerCase()
                        .replace(" ", ".")}@example.com`,
                    status: item.status || "Completed",
                  };
                  setSelectedCandidate(candidateData);
                  setShowDetailedOverview(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </button>
            </td>
          </>
        )}

       {selectedView === "feedback" && (
  (() => {
    const feedback = getFeedbackData(item, selectedTest);
    return (
      <>
        <td className="px-4 py-3 text-gray-700">{index + 1}</td>
        <td className="px-4 py-3 text-gray-900 font-medium">
          {feedback.name}
        </td>
        <td className="px-4 py-3 text-green-600 font-medium">
          {feedback.percentage}/100
        </td>
        <td className="px-4 py-3 text-gray-600 text-sm">
          {feedback.strengths}
        </td>
        <td className="px-4 py-3 text-gray-600 text-sm">
          {feedback.weaknesses}
        </td>
        <td className="px-4 py-3 text-gray-600 text-sm">
          {feedback.feedback}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => {
              const candidateData = {
                ...item,
                email:
                  item.email ||
                  `${item.name.toLowerCase().replace(" ", ".")}@example.com`,
                status: item.status || "Completed",
              };
              setSelectedCandidate(candidateData);
              setShowDetailedOverview(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
        </td>
      </>
    );
  })()
)}

      </tr>
    ));
  };

  // const DetailedOverview = ({ candidate }) => {
  //   return (
  //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  //       <div className="bg-white rounded-xl border border-gray-300 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
  //         <div className="p-6 border-b border-gray-200 flex justify-between items-center">
  //           <div>
  //             <h2 className="text-xl font-bold text-gray-900">
  //               {candidate.name}
  //             </h2>
  //             <p className="text-gray-600">
  //               Detailed Overview - {testData[selectedTest].name}
  //             </p>
  //           </div>
  //           <button
  //             onClick={() => setShowDetailedOverview(false)}
  //             className="text-gray-500 hover:text-gray-700 transition-colors"
  //           >
  //             <XCircle className="w-6 h-6" />
  //           </button>
  //         </div>

  //         <div className="p-6 space-y-6">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
  //               <h3 className="text-gray-900 font-medium mb-3">
  //                 Candidate Information
  //               </h3>
  //               <div className="space-y-2 text-sm">
  //                 <div className="flex items-center gap-2 text-gray-700">
  //                   <User className="w-4 h-4" />
  //                   <span>{candidate.name}</span>
  //                 </div>
  //                 <div className="flex items-center gap-2 text-gray-700">
  //                   <Mail className="w-4 h-4" />
  //                   <span>{candidate.email}</span>
  //                 </div>
  //                 {candidate.score && (
  //                   <div className="flex items-center gap-2 text-green-600">
  //                     <Award className="w-4 h-4" />
  //                     <span>Score: {candidate.score}/100</span>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>

  //             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
  //               <h3 className="text-gray-900 font-medium mb-3">Test Details</h3>
  //               <div className="space-y-2 text-sm text-gray-700">
  //                 <div>Test Type: {testData[selectedTest].name}</div>
  //                 <div>
  //                   Status:{" "}
  //                   <span
  //                     className={`px-2 py-1 rounded text-xs ${getStatusColor(
  //                       candidate.status
  //                     )}`}
  //                   >
  //                     {candidate.status}
  //                   </span>
  //                 </div>
  //                 {candidate.date && <div>Date: {candidate.date}</div>}
  //                 {candidate.interviewer && (
  //                   <div>Interviewer: {candidate.interviewer}</div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>

  //           {selectedView === "feedback" && (
  //             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
  //               <h3 className="text-gray-900 font-medium mb-3">
  //                 Detailed Feedback
  //               </h3>
  //               <div className="space-y-4">
  //                 {selectedTest === "online" && (
  //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
  //                     <div>
  //                       <span className="text-green-600 font-medium">
  //                         Strengths:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.strengths}
  //                       </p>
  //                     </div>
  //                     <div>
  //                       <span className="text-yellow-600 font-medium">
  //                         Areas for Improvement:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.weaknesses}
  //                       </p>
  //                     </div>
  //                     <div className="md:col-span-2">
  //                       <span className="text-blue-600 font-medium">
  //                         Recommendations:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.recommendations}
  //                       </p>
  //                     </div>
  //                   </div>
  //                 )}

  //                 {selectedTest === "behavioral" && (
  //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
  //                     <div>
  //                       <span className="text-purple-600 font-medium">
  //                         Leadership:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.leadership}
  //                       </p>
  //                     </div>
  //                     <div>
  //                       <span className="text-green-600 font-medium">
  //                         Teamwork:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.teamwork}
  //                       </p>
  //                     </div>
  //                     <div>
  //                       <span className="text-blue-600 font-medium">
  //                         Communication:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.communication}
  //                       </p>
  //                     </div>
  //                     <div className="md:col-span-3">
  //                       <span className="text-cyan-600 font-medium">
  //                         Overall Feedback:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.feedback}
  //                       </p>
  //                     </div>
  //                   </div>
  //                 )}

  //                 {selectedTest === "coding" && (
  //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
  //                     <div>
  //                       <span className="text-green-600 font-medium">
  //                         Problem Solving:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.problemSolving}
  //                       </p>
  //                     </div>
  //                     <div>
  //                       <span className="text-blue-600 font-medium">
  //                         Code Quality:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.codeQuality}
  //                       </p>
  //                     </div>
  //                     <div>
  //                       <span className="text-purple-600 font-medium">
  //                         System Design:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.systemDesign}
  //                       </p>
  //                     </div>
  //                     <div className="md:col-span-3">
  //                       <span className="text-cyan-600 font-medium">
  //                         Technical Feedback:
  //                       </span>
  //                       <p className="text-gray-700 mt-1">
  //                         {candidate.feedback}
  //                       </p>
  //                     </div>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 flex items-center gap-2 min-w-[200px] justify-between hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span>
              {testOptions.find((opt) => opt.value === selectedTest)?.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px]">
              {testOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedTest(option.value);
                    setDropdownOpen(false);
                    setSelectedView("total");
                  }}
                  className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Test Section */}
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {testData[selectedTest].name}
          </h2>

          {/* Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedView("total")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedView === "total"
                  ? "bg-gray-100 border-gray-300 text-gray-900"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Total applicants
            </button>
            <button
              onClick={() => setSelectedView("shortlisted")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedView === "shortlisted"
                  ? "bg-gray-100 border-gray-300 text-gray-900"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Shortlisted applicant
            </button>
            <button
              onClick={() => setSelectedView("feedback")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedView === "feedback"
                  ? "bg-gray-100 border-gray-300 text-gray-900"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Feedback
            </button>
          </div>

          {/* Table */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-gray-900 font-medium mb-4">Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden">
                <thead>{renderTableHeaders()}</thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showDetailedOverview && selectedCandidate && (
  <CandidateDetailView
    candidate={selectedCandidate}
    selectedTest={selectedTest}
    selectedView={selectedView}
    setShowDetailedOverview={setShowDetailedOverview}
  />
)}

    </div>
  );
};

export default CommonDetailsOverview;
