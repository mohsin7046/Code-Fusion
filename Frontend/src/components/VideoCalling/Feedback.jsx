import  { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';
import { systemPrompt } from "../../hooks/GeminiApi/geminiPrompt.js";
import { generateResponse } from "../../hooks/GeminiApi/gemini.js";

function Feedback() {

    const location = useLocation();
    const formData = location.state || {};

    console.log(formData);


    useEffect(()=>{
    const generateFeedback = async() => {
        try {
          if(!formData.currentCode || !formData.currentOutput ){
            toast.error("Code or output is missing")
          }
    
          const prompt = `
    You are an AI code review assistant for an online technical interview platform. Your job is to analyze the candidate's submitted code and its output, then generate structured, constructive feedback.
    
    Given the following information:
    - Submitted Code:
    \`\`\`
    ${formData.currentCode}
    \`\`\`
    
    - Execution Output:
    \`\`\`
    ${formData.currentOutput}
    \`\`\`
    
    Please analyze the candidate’s performance and generate feedback with the following structured fields in JSON format:
    
    {
      "correctness": "Evaluate if the code produces the correct output based on the provided input and problem. Mention any incorrect logic or mistakes.",
      "codeQuality": "Assess the code style, readability, naming conventions, and maintainability.",
      "efficiency": "Comment on the algorithmic efficiency. Is it optimized? Can time/space complexity be improved?",
      "strengths": "What did the candidate do well? Any notable positives?",
      "weaknesses": "Point out areas where the candidate can improve.",
      "recommendations": "Suggest actionable improvements to enhance the code.",
      "overallScore": "Give an overall rating between 1 to 10."
    }
    
    Rules:
    - The feedback must match the level of the code (beginner/intermediate/advanced).
    - Do not hallucinate information; base your response strictly on the provided code and output.
    - Output must be valid JSON only. No markdown, comments, or additional text.
    `;
    
          
            const fullPrompt =`
            ${systemPrompt}
          
            USER: ${prompt}
            `
    
            const response = await generateResponse(fullPrompt);
            const getResponse = JSON.parse(response);
    
            console.log("Generate Response",getResponse);
            
    
            if(!getResponse){
              toast.error("Error in generating the Feedback")
            }
    
            const createFeedback = await fetch('/api/recruiter/codeFeedback',{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                candidateId:formData.candidateId,
                feedback:getResponse,
              }),
            })
    
            if(!createFeedback){
              toast.error("Error in creating the Feedback")
            }
    
            toast.success("Feedback creating successfully");
    
        } catch (error) {
          toast.error("Failed to Generate Feedback");
          console.log("Error",error);
        }
    }
    generateFeedback();
    },[formData])


   
    

  return (
    <div>Feedback</div>
  )
}

export default Feedback