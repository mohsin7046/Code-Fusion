import React, { useState, useEffect } from "react";
import { useNavigate,useLocation, data } from "react-router-dom";
import Proctoring from "./Detecting";
import axios from "axios";

const JOB_ID = "cmc4os5dh000jv9q0wrkw496p";

const TakeTest = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  console.log(state);

  const formData = state;

  console.log(formData.name);
  console.log(formData.email);
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(null); 

  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/user/onlinetest/getAllQuestions", {
        jobId: formData.JobId || JOB_ID,
      });

      if (res.data.success && res.data.data?.questions) {
        setQuestions(res.data.data.questions);

        const minutes = res.data.data.duration;
        setTimer(minutes * 60); 

        document.documentElement.requestFullscreen().catch((err) => {
          console.error("Fullscreen error:", err);
        });
      } else {
        setError("No questions found for this Job ID.");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (timer === null || cheatingDetected) return;

    if (timer === 0) {
      handleAutoSubmit();
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

  const handleCheatingAndSubmit = (reason = "Unknown reason") => {
    setCheatingDetected(true);
    alert(`Cheating detected: ${reason}. Your test will be submitted and flagged.`);
    setTimeout(() => {
      alert("Test auto-submitted due to cheating.");
      navigate("/");
    }, 1000);
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Your test is being submitted.");
    navigate("/");
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

  const handleSubmit = () => {
    alert("Test submitted successfully!");
    navigate("/");
  };

  const handleCheatingDetected = (reason) => {
    if (!cheatingDetected) {
      handleCheatingAndSubmit(reason);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 relative">
      <div className="bg-white rounded-lg shadow-md p-6">
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
              onClick={handleSubmit}
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
      </div>
    </div>
  );
};

export default TakeTest;
