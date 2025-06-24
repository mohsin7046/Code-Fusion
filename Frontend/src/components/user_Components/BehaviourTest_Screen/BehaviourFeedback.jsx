import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {systemPrompt} from '../../../hooks/GeminiApi/geminiPrompt.js';
import {generateResponse} from '../../../hooks/GeminiApi/gemini.js';

function BehaviourFeedback() {
    const location  = useLocation();
    const formData = location.state;

    console.log("Form Data:", formData);
    
    const prompt = `
    You are an AI interview evaluator. Given the following behavioral interview data, assess the candidate strictly based on the number and quality of responses to each question. Ensure that scores are awarded only for questions that have been clearly answered in the transcript and align well with the evaluation criteria and keyword and subKeyword expectations.

Inputs:
1. Transcript: ${JSON.stringify(formData.transcript)}.
2. Evaluation Criteria: ${formData.evaluationCriteria}.
3. Keywords and Subkeywords:
- keywords: ${JSON.stringify(formData.keywords.map(keyword => keyword.name))}.
- subkeywords: ${JSON.stringify(formData.keywords.map(keyword => keyword.subKeywords))}
4. Questions (comma-separated): ${formData.questions}.

Evaluation Logic:
- Carefully parse the transcript to detect whether each of the provided questions has been addressed.
- For each question found in the transcript, check how well it aligns with the evaluation criteria and how well the user’s response reflects the related keyword and subkeyword skills.
- Award points only if a question is explicitly answered. If a question was skipped or not answered in the transcript, it should receive no score.
- For subjectiveScore, break down per keyword and give:
  - score (0–10),
  - remarks justifying the score.
- For overallScore, aggregate total score considering only answered questions and evaluation depth, and return a value between 0–100.
- Provide actionable, concise:
  - strengths: comma-separated
  - weaknesses: comma-separated
  - recommendations: comma-separated
  - feedback: A one-paragraph holistic summary of performance.

Respond only with a valid JSON object in the format:

{
  "overallScore": number (0-100),
  "subjectiveScore": {
    "Communication": { "score": number, "remarks": string },
    "Problem Solving": { "score": number, "remarks": string },
    "Leadership": { "score": number, "remarks": string }
  },
  "strengths": "string",
  "weaknesses": "string",
  "recommendations": "string",
  "feedback": "string"
}
    `
    console.log("Prompt:", prompt);
    const fullPrompt = `
        ${systemPrompt}
        User: ${prompt}
    `
    
    useEffect(()=>{
        const generateFeedback = async ()=>{
            try {
                const response = await generateResponse(fullPrompt);
                console.log("Generated feedback:", JSON.parse(response));

                if (!response) {
                    console.error("No response received from AI");
                    throw new Error("No response received from AI");
                }
                const data = JSON.parse(response);
                updateFeedback(data);
                
            } catch (error) {
                console.error("Error generating feedback:", error);
            }
        }
        generateFeedback();
        const updateFeedback = async (data) => {
            try {
                const response = await fetch('/api/user/behaviouraltest/updateBehaviorTestResponse',{
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',                    
                    },
                    body : JSON.stringify({
                        aiInterviewResponseId: formData.aiInterviewResponseId,
                        overallScore: data.overallScore,
                        subjectiveScore: data.subjectiveScore,
                        strengths: data.strengths,
                        weaknesses: data.weaknesses,
                        recommendations: data.recommendations,
                        feedback: data.feedback,
                        passingScore: formData.passingScore
                    })

                })
                const result = await response.json();
                if (!result.success) {
                  console.log("Error updating feedback:", result.message);
                    throw new Error(result.message || "Failed to update feedback");
                }
                console.log("Feedback updated successfully:", result);
            } catch (error) {
                console.error("Error updating feedback:", error);
            }
        }
        
    },[]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-blue-50 rounded-lg shadow-md p-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-blue-900 font-bold text-2xl mb-2">
          Behaviour Feedback
        </h1>
        <h3 className="text-green-700 font-semibold mb-4">
          You have successfully completed the Behaviour Test!
        </h3>
        <ul className="list-disc list-inside text-blue-800 mb-4 text-left w-full">
          <li>Our team will review your responses.</li>
          <li>You will receive detailed feedback soon.</li>
          <li>Track your progress and feedback in your candidate dashboard.</li>
        </ul>
        <p className="mb-2 text-blue-700">
          <span className="font-semibold">Want to see your brief feedback?</span>
        </p>
        <Link
          to="/user-signup"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Sign up as a Candidate
        </Link>
        <p className="mt-4 text-gray-600">Thank you for your participation!</p>
      </div>
    </div>
  );
}

export default BehaviourFeedback;

