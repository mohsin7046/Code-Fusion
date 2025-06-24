/* eslint-disable react/prop-types */
import { useState,useEffect } from "react";
import {getRecruiterToken} from "../../../../hooks/role.js";
import useCreateSummary from "../../../../hooks/useCreateSummary.jsx";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";

function GeneratedOnlineTest(props) {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenData = getRecruiterToken();

  const { createSummary } = useCreateSummary();

  const data = {
    jobId: tokenData.jobId,
    recruiterId: tokenData.recruiterId,
  }
  console.log(data);
  

  useEffect(() => {
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response  = await fetch('/api/recruiter/get-online-test',{
        method : 'POST',
        headers :{
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(data)
      })
      const result = await response.json();
      setLoading(false);
      if(!response.ok) {
        toast.error(result.message || "Failed to fetch online test");
        throw new Error(result.message || "Failed to fetch online test");
      }
      toast.success(result.message || "Online test fetched successfully");
      setGeneratedQuestions(result.test[0].questions);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting online test:", error);
      toast.error("An error occurred while fetching online test");
    }
  }
    handleSubmit();
  }, []);


  const handleCheck = async ()=>{
    if(tokenData.hasAiInterview){
      props.Next();
    }else{
      const response = await createSummary(
        tokenData.jobId,
        tokenData.recruiterId,
        tokenData.onlineTestId,
        tokenData.behaviourTestId
      )
      if(response.success){
        alert(response.message);
        props.Next();
      }
      else{
        alert(response.message);
      }
    }
  }
  return (
  <div className="mx-auto p-6 bg-white rounded-xl shadow-md">
  <h2 className="text-2xl font-bold mb-6">Generated Questions</h2>
  <div className="h-[500px] overflow-y-auto pr-2">
    <ol className="list-decimal pl-5 space-y-6">
  {Array.isArray(generatedQuestions) && generatedQuestions.length > 0 ? (
    generatedQuestions.map((que, index) => (
      <li key={index} className="relative">
        <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-bl-lg">
          {que.points} point{que.points > 1 ? 's' : ''}
        </div>
        <p className="font-semibold mb-2 pr-24">{que.question}</p>
        <ul className="list-none space-y-2">
          {que.options.map((value, optIndex) => (
            <li key={optIndex}>
              <div
                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-md ${
                  que.correctAnswer === optIndex
                    ? "bg-green-100 border-green-400"
                    : "border-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={optIndex}
                  checked={que.correctAnswer === optIndex}
                  readOnly
                  disabled
                />
                <label className="cursor-default">{value}</label>
              </div>
            </li>
          ))}
        </ul>
      </li>
    ))
  ) : (
    <p className="text-gray-500 text-sm">No questions available or still loading...</p>
  )}
</ol>
  </div>
  <div className="mt-8 flex justify-end w-full">
    <button
      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      onClick={
        handleCheck
      }
    >
      {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "Confirm" }
    </button>
  </div>
</div>

  );
}

export default GeneratedOnlineTest;
