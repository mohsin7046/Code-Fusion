export const getStatusColor = (status) => {
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

export const getTestResponse = (item) => {
  // if (selectedTest === "online") return item?.onlineTestResponse?.[0];
  // if (selectedTest === "behavioral") return item?.aiInterviewResponse?.[0];
  if(item){
  
    return item;
  }
  return null; 
};

export const getShortlistCondition = (item) => {
  // if (selectedTest === "online") return item?.passed;
  // if (selectedTest === "behavioral")
  //   return item?.aiInterviewResponse?.[0]?.passed;
  // if (selectedTest === "coding") return item?.status === "Qualified";
  if(item){
    return item?.passed
  }
  return false;
};

export const getFeedbackData = (item, testType) => {
  console.log("item",item);
  
// const response = testType === "online"
//   ? item?.onlineTestResponse?.[0]
//   : testType === "behavioral"
//   ? item?.aiInterviewResponse?.[0]
//   : item;

const response = item;

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