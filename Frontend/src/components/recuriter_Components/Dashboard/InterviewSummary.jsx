import { useState, useEffect } from "react";
import {
  Clock,
  Users,
  FileText,
  Brain,
  Code,
  Calendar,
  Building,
  User,
  CheckCircle,
  AlertCircle,
  Star,
  LoaderCircle,
} from "lucide-react";
import { getRecruiterToken } from "../../../hooks/role.js";
import { toast } from "react-toastify";


function InterviewSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [configText, setConfigText] = useState("");
  const [isConfigSaved, setIsConfigSaved] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  const tokenData = getRecruiterToken();
  console.log("Token Data:", tokenData.jobId, tokenData.recruiterId);
  

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/recruiter/get-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: tokenData.jobId,
          }),
        });
        
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || "Failed to fetch summary");
          throw new Error("Failed to fetch summary");
        }

        if (!data || data.length === 0) {
          toast.error("No summary data found");
          throw new Error("No summary data returned");
        }
        toast.success("Summary fetched successfully");
        setSummaryData(data[0]);

      } catch (err) {
        setLoading(false);
        toast.error("An error occurred while fetching summary");
        setError(err.message);
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const formatTime = (minutes) => {
    if (!minutes || isNaN(minutes)) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  const renderSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return <p className="text-gray-500">No subjects available</p>;
    }

    return subjects.map((subject, index) => (
      <div
        key={index}
        className="flex justify-center bg-green-50 border border-green-200 rounded-full p-2 shadow-sm"
      >
        <h6 className="text-green-800 font-bold text-md mb-1">
          {typeof subject === 'object' && subject !== null ? (subject.name || "Subject") : String(subject)}
        </h6>
      </div>
    ));
  };

  

  const renderBehavioralSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return <span className="text-gray-500">No focus areas available</span>;
    }

    return subjects.map((subject, index) => (
      <span
        key={index}
        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
      >
        {typeof subject === 'object' && subject !== null ? (subject.name || "Subject") : String(subject)}
      </span>
    ));
  };

 

  const renderKeywords = (keywords) => {
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return <span className="text-gray-500">No evaluation points available</span>;
    }

    return keywords.map((keyword, index) => (
      <span
        key={index}
        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
      >
        {typeof keyword === 'object' && keyword !== null ? (keyword.name || "Keyword") : String(keyword)}
      </span>
    ));
  };

  

  const handleSaveEmails = () => {
    const emailsArray = configText
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
    
    setConfigText(emailsArray.join(", "));
    setIsConfigSaved(emailsArray.length > 0);
    setIsEditing(false);
  };

  
  const handleStartInterviewProcess = async () => {
    const emailsArray = configText
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    console.log("Starting interview process with emails:", emailsArray);

    try {
      setLoading(true);
      const emailsResponse = await fetch("/api/recruiter/add-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: summaryData?.jobId,
          recruiterId: summaryData?.recruiterId,
          onlineTestId: summaryData?.onlineTestId,
          behavioralInterviewId: summaryData?.behavioralInterviewId,
          codingTestId: tokenData?.codingTestId,
          emails: emailsArray,
        }),
      });

      const data = await emailsResponse.json();
      setLoading(false);
      if (emailsResponse.ok) {
        toast.success(data.message || "Interview invitations sent successfully!");
        console.log("Emails sent successfully:", data);
        
      } else {
        toast.error(data.message || "Failed to send interview invitations");
        console.error("Error sending emails");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while starting the interview process");
      console.error("Error starting interview process:", error);
    }

    try {
      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: summaryData?.jobId,
          emails: emailsArray,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to create job applications");
        throw new Error("Failed to create job applications");
      }
      toast.success(data.message || "Job applications created successfully!");
    } catch (error) {
      toast.error("An error occurred while creating job applications");
      console.error("Error creating Job applications", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !summaryData) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <AlertCircle className="mr-2" />
        Error loading summary: {error || "No summary data found"}
      </div>
    );
  }

  const data = summaryData;
  console.log(data);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Interview Summary
              </h1>
              <p className="text-gray-600 text-lg">
                Complete overview of your interview process
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-medium">Ready to Start</span>
              </div>
            </div>
          </div>

          <div className="flex justify-evenly bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-3 opacity-80" />
                <div>
                  <p className="text-blue-100 text-sm">Company</p>
                  <p className="font-semibold">{data?.job?.companyName || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 opacity-80" />
                <div>
                  <p className="text-blue-100 text-sm">Role</p>
                  <p className="font-semibold">{data?.job?.interviewRole || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 opacity-80" />
                <div>
                  <p className="text-blue-100 text-sm">Date</p>
                  <p className="font-semibold">{formatDate(data?.job?.date)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Recruiter Contact
            </h3>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {data?.user?.username || "N/A"}
                </p>
                <p className="text-gray-600 text-sm">{data?.user?.email || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-white mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Online Assessment
                  </h2>
                  <p className="text-green-100">Technical Skills Evaluation</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {data?.onlineTest?.title || "Online Test"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {data?.onlineTest?.description || "No description available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Duration</span>
                  </div>
                  <p className="font-semibold text-lg">
                    {formatTime(data?.onlineTest?.duration)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Questions</span>
                  </div>
                  <p className="font-semibold text-lg">
                    {data?.onlineTest?.totalQuestions || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Passing Score: {data?.onlineTest?.passingScore || "N/A"}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-lg mb-3">
                  Topics Covered:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderSubjects(data?.onlineTest?.subjects)}
                </div>
              </div>
            </div>
          </div>

          {data?.behavioralInterview && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-white mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      AI Behavioral Interview
                    </h2>
                    <p className="text-purple-100">
                      Communication & Cultural Fit
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 mb-4">
                    AI-driven assessment of your communication skills and
                    cultural alignment
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Duration</span>
                    </div>
                    <p className="font-semibold text-lg">
                      {formatTime(data?.behavioralInterview?.duration)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <Users className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Questions</span>
                    </div>
                    <p className="font-semibold text-lg">
                      {data?.behavioralInterview?.totalQuestions || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Passing Score: {data?.behavioralInterview?.passingScore || "N/A"}%
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Focus Areas:
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {renderBehavioralSubjects(data?.behavioralInterview?.subjects)}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Key Evaluation Points:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {renderKeywords(data?.behavioralInterview?.keyWords)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {data?.codingTest && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
              <div className="flex items-center">
                <Code className="w-8 h-8 text-white mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Live Coding Interview
                  </h2>
                  <p className="text-orange-100">{data?.codingTest?.title}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {data?.codingTest?.description}
              </p>
              <p className="font-semibold text-lg">
                      {formatTime(data?.codingTest?.duration)}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Ready to Begin?
              </h3>
              <p className="text-gray-600">
                All interview phases are configured and ready to start
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
              >
                Add Student Emails
              </button>
              <button
                disabled={!isConfigSaved}
                onClick={handleStartInterviewProcess}
                className={`px-8 py-3 rounded-lg font-medium transition duration-200 transform ${
                  isConfigSaved
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
              {loading ?  <LoaderCircle className="animate-spin mx-auto" />  :"Start Interview Process"}
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Enter Student Emails (comma-separated)
              </label>

              <div className="flex flex-wrap gap-2 border p-3 rounded-lg bg-white">
                {configText
                  .split(",")
                  .filter((email) => email.trim() !== "")
                  .map((email, idx) => {
                    const trimmedEmail = email.trim();
                    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                      trimmedEmail
                    );
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isValid
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800 underline underline-offset-2 decoration-red-500"
                        }`}
                      >
                        {trimmedEmail}
                      </span>
                    );
                  })}
              </div>

              <textarea
                rows="3"
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={configText}
                onChange={(e) => {
                  const input = e.target.value;
                  setConfigText(input);
                }}
                placeholder="e.g. student1@example.com, student2@example.com"
              ></textarea>

              <button
                disabled={configText.trim() === ""}
                onClick={handleSaveEmails}
                className={`mt-3 px-5 py-2 rounded-lg transition duration-200 font-medium ${
                  configText.trim() === ""
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Save Emails
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewSummary;