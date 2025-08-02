/* eslint-disable react/prop-types */
import { Eye } from "lucide-react";

const TableRows = ({ 
  getCurrentData, 
  selectedTest, 
  selectedView, 
  getStatusColor, 
  getShortlistCondition, 
  getFeedbackData, 
  setShortlistItem, 
  handleOnlineShortlist, 
  handleBehaviouralShortlist, 
  setSelectedCandidate, 
  setShowDetailedOverview, 
  handleDecline, 
  onlinedata, 
  behaviouraldata 
}) => {
  const renderTableRows = () => {
    const totaldata = getCurrentData();

   let  data = []

  if (selectedTest === "online") {
       data =  totaldata?.CandidateJobApplication?.flatMap((candidate) =>
      candidate.onlineTestResponse?.map((response) => ({
      ...response,
      status: candidate.status,
    })) || []
  ) || [];
}
if (selectedTest === "behavioral") {
  data = totaldata?.CandidateJobApplication?.flatMap((candidate) =>
    candidate.aiInterviewResponse?.map((response) => ({
      ...response,
      // name: candidate.name,
      status: candidate.status,
      // duration: response?.timeTaken || response?.duration || "N/A",
      // candidateId: candidate.candidateId,
      // email: candidate.candidateId,
    })) || []
  );
}

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
              {item.percentage}/100
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
              {item.submittedAt.split("T")[0]}
            </td>
            <td className="px-4 py-3">
              <button
                className={
                  getShortlistCondition(item)
                  ? "bg-gray-400 cursor-not-allowed px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                  : "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                }
                onClick={() => {
    setShortlistItem((prev)=>[...prev,item]);
    handleOnlineShortlist(index);
  }}
                disabled={getShortlistCondition(item)}
              >
                ShortList
              </button>
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
            <td className="px-4 py-3 text-green-600 font-medium">
              {item.overallScore}/100
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
              {item?.submittedAt.split("T")[0]}
            </td>
            
            <td className="px-4 py-3">
              <button
                className={
                  getShortlistCondition(item)
                  ?"bg-gray-400 cursor-not-allowed px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                  :"bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                }
                onClick={() => handleBehaviouralShortlist(index)}
                disabled={getShortlistCondition(item)}
              >
                ShortList
                </button>
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
              {selectedTest == "online" ? `${item?.percentage}/100` : `${item?.overallScore}/100`}
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
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1" onClick={()=>handleDecline(index,selectedTest)}> 
                Decline
              </button>
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

  return (
    <tbody>{renderTableRows()}</tbody>
  );
};
export default TableRows;