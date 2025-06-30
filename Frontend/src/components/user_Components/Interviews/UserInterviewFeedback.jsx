import { useEffect, useState } from "react";
import {
  ChevronDown,
  BarChart3,
  User,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const UserInterviewFeedback = () => {
  const [selectedPhase, setSelectedPhase] = useState("online");
  const [onlineData, setOnlineData] = useState(null);
  const [behaviorData, setBehaviorData] = useState(null);

  const location = useLocation();
  const { jobId } = location.state || {};

  useEffect(() => {
    const getUserOnlineData = async () => {
      try {
        const res = await fetch(
          "/api/user/onlinetest/getuserDashboardOnlineTest",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
          }
        );

        const { data } = await res.json();
        const app = data?.CandidateJobApplication?.[0];
        const test = data?.onlineTests?.[0];
        const response = app?.onlineTestResponse?.[0];

        if (app && test && response) {
          const subjectGraph = test.subjects.map((subject) => ({
            name: subject.name,
            Easy: subject.easyQuestions,
            Medium: subject.mediumQuestions,
            Hard: subject.hardQuestions,
          }));

          setOnlineData({
            title: test.title,
            description: test.description,
            duration: test.duration, // Map from test instead of response
            testTotalQuestions: test.totalQuestions, // Map from test instead of response
            passingScore: test.passingScore, // Map from test instead of response
            attemptedQuestions: response.totalQuestions,
            timeTaken: response.timeTaken,
            cheatingDetected: response.cheatingDetected,
            cheatingReason: response.cheatingReason,
            passed: response.passed,
            percentage: response.percentage,
            totalCorrect: response.totalCorrectAnswers,
            overallScore: response.percentage,
            scoreColor: response.passed ? "text-green-800" : "text-red-800",
            scoreBg: "bg-blue-50 border-blue-200",
            secondaryInfo: {
              label: "Correct Answers",
              value: `${response.totalCorrectAnswers}/${test.totalQuestions}`,
              icon: CheckCircle,
              color: response.passed ? "text-green-800" : "text-red-800",
              bg: response.passed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200",
            },
            graph: subjectGraph,
            skills: test.subjects.map((subject) => ({
              name: subject.name,
              score:
                subject.totalQuestions > 0
                  ? Math.round(
                      (subject.totalQuestions / test.totalQuestions) * 10
                    )
                  : 0,
            })),
            improvements: response.cheatingDetected
              ? ["Cheating detected: " + response.cheatingReason]
              : ["Could improve accuracy"],
          });
        }
      } catch (error) {
        console.error("Error fetching online data:", error);
      }
    };

    const getUserBehaviorData = async () => {
      try {
        const res = await fetch(
          "/api/user/behaviouraltest/getuserDashboardBehaviourTest",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
          }
        );

        const { data } = await res.json();
        const app = data?.CandidateJobApplication?.[0];
        const interview = data?.behavioralInterviews?.[0];
        const response = app?.aiInterviewResponse?.[0];

        if (response && interview) {
          const subjectiveScore = response.subjectiveScore || {};
          setBehaviorData({
            title: interview.title,
            description: interview.description,
            totalQuestions: interview.totalQuestions,
            duration: interview.duration,
            passingScore: interview.passingScore,
            evaluationCriteria: interview.evaluationCriteria,
            overallScore: response.overallScore,
            scoreColor: response.passed ? "text-green-800" : "text-red-800",
            scoreBg: "bg-blue-50 border-blue-200",
            secondaryInfo: {
              label: "Candidate",
              value: response.name,
              icon: User,
              color: "text-blue-800",
              bg: "bg-blue-50 border-blue-200",
            },
            skills: Object.entries(subjectiveScore).map(([key, val]) => ({
              name: key,
              score: val.score,
              remarks: val.remarks,
            })),
            strengths: response.strengths || "—",
            weaknesses: response.weaknesses
              ? response.weaknesses.split(",").map((s) => s.trim())
              : ["—"],
            recommendations: response.recommendations || "—",
          });
        }
      } catch (error) {
        console.error("Error fetching behavior data:", error);
      }
    };

    const fetchData = async () => {
      await getUserOnlineData();
      await getUserBehaviorData();
    };

    if (jobId) fetchData();
  }, [jobId]);

  const currentData =
    selectedPhase === "online"
      ? onlineData
      : selectedPhase === "behavior"
      ? behaviorData
      : null;

  const SecondaryIcon = currentData?.secondaryInfo?.icon;

  return (
    <div>
      <div className="flex flex-row items-center font-semibold text-3xl self-start">
        <ArrowLeft
          onClick={() =>
            (window.location.href = "/dashboard/user/all-interview")
          }
          className="w-8 h-5 mb-4 cursor-pointer"
        />
        <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
      </div>

      {!currentData ? (
        <div className="text-center text-gray-600 mt-10">
          Loading feedback...
        </div>
      ) : (
        <div className="mx-auto p-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">{currentData.title}</h1>
              <p className="text-sm text-gray-600 break-words leading-relaxed">{currentData.description}</p>
            </div>
            <div className="relative flex-shrink-0">
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="online">Online Assessment</option>
                <option value="behavior">Behavioral Interview</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className={`p-6 rounded-lg border ${currentData.scoreBg}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  Overall Score
                </h3>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <p className={`text-3xl font-bold ${currentData.scoreColor}`}>
                {currentData.overallScore}%
              </p>
            </div>

            <div
              className={`p-6 rounded-lg border ${currentData.secondaryInfo.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  {currentData.secondaryInfo.label}
                </h3>
                {SecondaryIcon && (
                  <SecondaryIcon className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p
                className={`text-2xl font-bold ${currentData.secondaryInfo.color}`}
              >
                {currentData.secondaryInfo.value}
              </p>
            </div>
          </div>

          {selectedPhase === 'online' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded border bg-gray-50">
                <h4 className="text-sm text-gray-600">Duration</h4>
                <p className="text-lg font-semibold text-gray-900">{onlineData.duration} min</p>
              </div>
              <div className="p-4 rounded border bg-gray-50">
                <h4 className="text-sm text-gray-600">Total Questions</h4>
                <p className="text-lg font-semibold text-gray-900">{onlineData.testTotalQuestions}</p>
              </div>
              <div className="p-4 rounded border bg-gray-50">
                <h4 className="text-sm text-gray-600">Passing Score</h4>
                <p className="text-lg font-semibold text-gray-900">{onlineData.passingScore}%</p>
              </div>
              <div className="p-4 rounded border bg-gray-50">
                <h4 className="text-sm text-gray-600">Attempted Questions</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {currentData.attemptedQuestions}
                </p>
              </div>
              <div className="p-4 rounded border bg-gray-50">
                <h4 className="text-sm text-gray-600">Time Taken</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {currentData.timeTaken} min
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Skill Assessment
            </h2>
            <div className="space-y-6">
              {currentData.skills.map((skill, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-800 flex-1">
                      {skill.name}
                    </span>
                    <div className="flex items-center space-x-3 flex-1 justify-end">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(skill.score / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                        {skill.score}/10
                      </span>
                    </div>
                  </div>
                  {skill.remarks && (
                    <p className="text-sm text-gray-500 italic ml-1">
                      {skill.remarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedPhase === "behavior" && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Strengths
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {currentData.strengths}
              </p>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Areas for Improvement
              </h2>
            </div>
            <div className="space-y-3">
              {currentData.weaknesses?.map((improvement, index) => (
                <div key={index} className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{improvement}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedPhase === "behavior" && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recommendations
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {currentData.recommendations}
              </p>
            </div>
          )}

          {selectedPhase === "online" && currentData.cheatingDetected && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-6">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm font-medium">
                Cheating Detected: {currentData.cheatingReason}
              </p>
            </div>
          )}

          {selectedPhase === "online" && currentData.passed && (
            <div className="text-green-700 border border-green-300 bg-green-50 p-4 rounded-lg font-semibold text-center mb-6">
              ✅ You have passed the test successfully.
            </div>
          )}


          {selectedPhase === "online" && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Subject-Wise Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={currentData.graph}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Easy" stackId="a" fill="#34d399" />
                  <Bar dataKey="Medium" stackId="a" fill="#60a5fa" />
                  <Bar dataKey="Hard" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInterviewFeedback;