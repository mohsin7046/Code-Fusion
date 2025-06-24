import  { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Proctoring from "./Detecting";
import axios from "axios";
import { toast } from "react-toastify";

const JobId = "cmc67rdko0001v9vszi97iyp5";
const email = "datardimohsinali7046@gmail.com";

const TakeTest = () => {
  const navigate = useNavigate();

  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [cheatingReasons, setCheatingReasons] = useState(new Set());
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(null);
  const [durationInSec, setDurationInSec] = useState(0);
  const [onlineTestId, setOnlineTestId] = useState("");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/user/onlinetest/getAllQuestions", {
        jobId: JobId,
      });

      if (res.data.success && res.data.data?.questions) {
        toast.success("Questions fetched successfully!");
        setQuestions(res.data.data.questions);
        setOnlineTestId(res.data.data.id);

        const minutes = res.data.data.duration;
        const seconds = minutes * 60;
        setTimer(seconds);
        setDurationInSec(seconds);
      } else {
        toast.error("No questions found for this Job ID.");
        setError("No questions found for this Job ID.");
      }
    } catch (err) {
      toast.error("Error fetching questions. Please try again later.");
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
    setTestStarted(true);
    fetchQuestions();
  };

  useEffect(() => {
    if (timer === null || cheatingDetected) return;
    if (timer === 0) {
      handleSubmit(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, cheatingDetected]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const addCheatingReason = (reason) => {
    setCheatingReasons((prev) => new Set(prev).add(reason));
  };

  const handleCheatingAndSubmit = (reason = "Unknown reason") => {
    if (!cheatingDetected) {
      setCheatingDetected(true);
      addCheatingReason(reason);
      alert(`Cheating detected: ${reason}. Your test will be submitted and flagged.`);
      handleSubmit(true, reason,true);
   
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && questions.length > 0) {
        handleCheatingAndSubmit("Tab is switched");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [questions]);


  const handleAnswerChange = (index, selectedOption) => {
    setAnswers({ ...answers, [index]: selectedOption });
  };

  const handleSubmit = async (isAuto = false,reason = "",forceCheating= false) => {
    setLoading(true);
    try {
      const finalAnswers = questions.map((q, index) => ({
        questionId: q.id,
        selectedOption: answers[index] !== undefined ? answers[index] : null,
      }));

      const totalAttemptedAnswer = finalAnswers.filter((q) => q.selectedOption !== null);

      console.log(finalAnswers);
      

      const payload = {
        onlineTestId,
        email,
        jobId: JobId,
        answers: finalAnswers,
        totalQuestions: totalAttemptedAnswer.length,
        cheatingDetected : forceCheating || cheatingDetected,
        reason,
        cheatingReason: Array.from(cheatingReasons).join(", "),
        timeTaken: durationInSec - timer,
      };
      console.log(payload);
      

      const res = await axios.post("/api/user/onlinetest/response", payload);

      if (res.data.success) {
        alert(
          `${isAuto ? "Auto-submission" : "Submission"} successful!\nScore: ${
            res.data.data.score
          }, Correct: ${res.data.data.totalCorrectAnswers}, Passed: ${
            res.data.data.passed ? "Yes" : "No"
          }`
        );
        navigate("/");
      } else {
        alert("Failed to submit test.");
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheatingDetected = (reason) => {
    addCheatingReason(reason);
    handleCheatingAndSubmit(reason);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 relative">
      <div className="bg-white rounded-lg shadow-md p-6">
        {!testStarted ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Start your test</h2>
            <button
              onClick={startTest}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
            >
              Start Test
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Online Test</h1>
              {timer !== null && !cheatingDetected && (
                <div className="text-red-600 font-bold text-xl">
                  ⏳ {formatTime(timer)}
                </div>
              )}
            </div>

            {loading ? (
              <p>Loading questions...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <>
                <div className="fixed bottom-4 right-4 w-40 h-40 bg-black rounded-lg shadow-lg overflow-hidden">
                  <Proctoring onCheatingDetected={handleCheatingDetected} />
                </div>

                {cheatingDetected && (
                  <p className="text-red-600 font-bold mt-4">
                    Cheating detected! Your test is being submitted automatically.
                  </p>
                )}

                {questions.map((q, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">
                      Q{index + 1}. {q.question}
                    </p>
                    {q.options.map((option, optIdx) => (
                      <label key={optIdx} className="block">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optIdx}
                          checked={answers[index] === optIdx}
                          onChange={() => handleAnswerChange(index, optIdx)}
                          className="mr-2"
                          disabled={cheatingDetected}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ))}

                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading || cheatingDetected}
                  className={`text-white px-4 py-2 rounded mt-4 ${
                    cheatingDetected ? "bg-gray-500" : "bg-green-600"
                  }`}
                >
                  {loading
                    ? "Submitting..."
                    : cheatingDetected
                    ? "Test Being Submitted..."
                    : "Submit Test"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TakeTest;
