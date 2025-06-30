/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import { getRecruiterToken } from "../../../../hooks/role.js";
import useCreateSummary from "../../../../hooks/useCreateSummary.jsx";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";


function GeneratedBehavior(props) {
  const [behavioralTest, setBehavioralTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tokenData = getRecruiterToken();
  const { createSummary } = useCreateSummary();
  
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const behavioralRes = await fetch('/api/recruiter/get-behaviour-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId:tokenData.jobId,
            recruiterId:tokenData.recruiterId
          }),
        });

        const data = await behavioralRes.json();
        setLoading(false);
        if (!behavioralRes.ok) {
          toast.error(data.message || "Failed to load behavioral test");
          throw new Error(data.message || "Failed to load behavioral test");
        }
        console.log("Behavioral GET Test Data:", data);
        toast.success(data.message || "Behavioral test loaded successfully");
        setBehavioralTest(data.getquestions[0]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load behavioral test");
        setError("Failed to load behavioral test.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

const handleCheck = async () => {
  if(tokenData.hasCodingTest){
    props.Next();
  }else{
  const response = await createSummary(
        tokenData.jobId,
        tokenData.recruiterId,
        tokenData.onlineTestId,
        tokenData.behaviourTestId
  )
  if(response.success){
    toast.success(response.message)
    props.Next();
  }else{
    toast.error(response.message)
  }
}
}

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
      <p className="text-red-600 text-center">{error}</p>
    </div>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "HARD": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

 
  const uniqueSubjects = [
    ...new Set((behavioralTest?.questions || []).map((q) => q.subject)),
  ];


  const filteredQuestions = (behavioralTest?.questions || []).filter(q => {
    const matchesDifficulty = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    const matchesSubject = selectedSubject === 'ALL' || q.subject === selectedSubject;
    return matchesDifficulty && matchesSubject;
  });

  const highlightSearchTerm = (text) => {
    return text;
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50 min-h-screen">
      
      <div className="mb-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Behavioral Interview Summary
              </h1>
              <p className="text-gray-600">
                Review behavioral interview details and questions
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="ALL">All Subjects</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="ALL">All Levels</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className="text-gray-500 text-sm">
                Created: {behavioralTest ? new Date(behavioralTest.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {behavioralTest && (
        <>
          
          <div className="h-[500px] overflow-y-auto pr-2 space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-lg">
                No questions match your current filters
              </div>
            ) : (
              filteredQuestions.map((question, index) => (
                <div key={question.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs">
                      {question.subject}
                    </span>
                  </div>
                  <p className="text-gray-800">
                    {highlightSearchTerm(question.question)}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div className="mt-8 flex justify-end w-full">
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={handleCheck}>
        {loading ? <LoaderCircle className="animate-spin mx-auto" /> :"Confirm"}
        </button>
      </div>
    </div>
  );
}

export default GeneratedBehavior;