/* eslint-disable react/prop-types */
import { useState,useEffect } from "react";
import { generateResponse } from "../../../../hooks/GeminiApi/gemini.js";
import { systemPrompt } from "../../../../hooks/GeminiApi/geminiPrompt.js";
import {getRecruiterToken} from "../../../../hooks/role.js";

function BehaviorSubject(props) {
  const [selected, setSelected] = useState([]);
  const [passingScore,setPassingScore] = useState(0);
  const [totalQuestion,settotalQuestion] = useState(0);
  const [duration,setDuration] = useState(0);
  const [selectedKeyword,setSelectedKeyword] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const tokenData = getRecruiterToken();
  

useEffect(()=>{
  const selectedKeywords = keywordData.filter((item) =>
    selected.includes(item.name)
  ).map((item) => ({
    name: item.name,
    subKeywords: item.subKeywords
  }));
  setSelectedKeyword(selectedKeywords);
},[selected]);

const behaviors = [
  {
    title: "Communication",
    desc: "Assess verbal communication skills, clarity, and ability to articulate complex ideas",
  },
  {
    title: "Leadership",
    desc: "Evaluate leadership potential, team management, and decision-making abilities",
  },
  {
    title: "Problem Solving",
    desc: "Assess analytical thinking, creative solutions, and approach to challenges",
  },
  {
    title: "Adaptability",
    desc: "Evaluate how well a candidate handles change, learns new skills, and navigates uncertainty",
  },
  {
    title: "Teamwork",
    desc: "Assess ability to collaborate effectively, resolve conflicts, and contribute to group success",
  },
  {
    title: "Time Management",
    desc: "Evaluate ability to prioritize tasks, meet deadlines, and manage workload efficiently",
  },
  {
    title: "Initiative",
    desc: "Assess willingness to take ownership, act proactively, and go beyond assigned duties",
  },
  {
    title: "Work Ethic",
    desc: "Evaluate reliability, responsibility, and dedication to consistently delivering quality work",
  },
  {
    title: "Creativity",
    desc: "Assess ability to think outside the box, generate novel ideas, and innovate in complex scenarios",
  },
  {
    title: "Emotional Intelligence",
    desc: "Evaluate self-awareness, empathy, and ability to manage interpersonal relationships thoughtfully",
  }
];

const keywordData = [
  {
    name: "Communication",
    subKeywords: [
      "clarity of thought",
      "active listening",
      "explaining complex ideas",
      "audience awareness",
      "non-verbal cues",
      "asking clarifying questions"
    ]
  },
  {
    name: "Problem Solving",
    subKeywords: [
      "critical thinking",
      "root cause analysis",
      "logical reasoning",
      "troubleshooting",
      "debugging under pressure"
    ]
  },
  {
    name: "Teamwork",
    subKeywords: [
      "collaboration",
      "respecting diverse opinions",
      "constructive feedback",
      "supporting teammates",
      "peer programming"
    ]
  },
  {
    name: "Leadership",
    subKeywords: [
      "decision making",
      "delegation",
      "motivating team",
      "vision sharing",
      "leading by example"
    ]
  },
  {
    name: "Accountability",
    subKeywords: [
      "owning mistakes",
      "meeting deadlines",
      "reliable commitments",
      "transparency",
      "work ethic"
    ]
  }
];



const prompt = `
You are an AI question generation assistant for a professional interview platform. Based on the provided configuration, generate a set of behavioral interview questions.
Requirements:

Use the following configuration:
• Title: ${title}.
• Description: ${description}.
• TotalQuestions: ${totalQuestion}
• Keywords : ${JSON.stringify(selected)}
• SubKeywords: ${JSON.stringify(selectedKeyword)}

Generate exactly the total number of behavioral questions as specified by TotalQuestions.

For Generating the questions you have to use the description and title to know on which topics you have to include in the generating questions but generate the questions based on the keywords and sub-keywords provided and add difficulty level from EASY,MEDIUM,HARD for each question response and also add subject for that generated question.

Also give the evaluation criteria for the overall questions generated based on the keywords and sub-keywords provided and give the evaluation criteria in comma seperated a string not in array and name it as  evaluationCriteria. 

Each question should be original, professional, and incorporate the behavioral aspects outlined in the keyword data. Focus on areas such as Communication, Problem Solving, and Teamwork, using the associated sub-keywords (e.g., "clarity of thought", "critical thinking", "collaboration", etc.) to inspire the questions.

Not generate the keywords and sub-keywords in the questions, just use them to generate the questions.

Do not provide questions that exceed or fall short of the given total number.

Output must be a valid raw JSON array of question strings with no markdown, code fences, or extra formatting.
`


const fullPrompt = `
${systemPrompt}
USER : ${prompt}
`



const handleSubmit = async() => {
  try {
    const response = await generateResponse(fullPrompt);
    const questions = JSON.parse(response);
    const generatedQuestions = questions.questions || [];
    console.log("Generated Questions:", generatedQuestions);
    const evaluatedCriteria = questions.evaluationCriteria || "";
    
    console.log(questions);

    const res=  await fetch("/api/recruiter/create-behaviour-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId:tokenData.jobId,
        recruiterId:tokenData.recruiterId,
        totalQuestions: parseInt(totalQuestion),
        passingScore: parseInt(passingScore),
        duration : parseInt(duration),
        questions: generatedQuestions.map((question) => ({
          question : question.question,
          subject: question.subject,
          difficulty: question.difficulty || "EASY", 
        })),
        keyWords : selectedKeyword.map((kw) => ({
          name: kw.name,
          subKeywords: kw.subKeywords || [],
        })),
        evaluationCriteria: evaluatedCriteria,
        onlineTestId: tokenData.onlineTestId || null,
      }),
    })

    const data = await res.json();
    if (res.ok) {
      console.log("Behavioral Test Created Successfully:", data);
      props.Next();
    } else {
      console.error("Error creating behavioral test:", data.message);
      alert(data.message || "Failed to create behavioral test");
    }

  } catch (error) {
    console.error("Error generating questions:", error);
  }
}


  const handleCheckboxChange = (title) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };
  console.log(selected);
  console.log(totalQuestion);
  
  

  return (
    <div className="mx-auto p-6 max-w-full bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-black mb-2">Behavioral Categories</h2>
      <p className="text-gray-600 mb-6">
        Select the behavioral categories you want to assess during the AI interview.
        Our AI will generate targeted questions to evaluate these aspects.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Title</label>
    <input
      type="text"
      onChange={(e) => setTitle(e.target.value)}
      placeholder="e.g., Leadership Assessment"
      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <input
      type="text"
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Short description of the interview"
      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</div>


      <div className=" h-[280px] overflow-y-auto space-y-4">
        {behaviors.map((behavior, index) => (
          <label
            key={index}
            className={`flex items-start p-4 border rounded-lg cursor-pointer transition ${
              selected.includes(behavior.title)
                ? "border-indigo-500 ring-2 ring-indigo-100"
                : "hover:border-gray-400"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(behavior.title)}
              onChange={() => handleCheckboxChange(behavior.title)}
              className="mt-1 mr-4"
            />
            <div>
              <h4 className="text-lg font-semibold">{behavior.title}</h4>
              <p className="text-gray-600 text-sm">{behavior.desc}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
    <input
      type="number"
      value={totalQuestion}
      onChange={(e) => settotalQuestion(e.target.value)}
      placeholder="e.g., 10"
      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score</label>
    <input
      type="number"
      value={passingScore}
      onChange={(e) => setPassingScore(e.target.value)}
      placeholder="e.g. Out of 100"
      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Test Duration (mins)</label>
    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      placeholder="e.g., 30"
      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>

      <div className="mt-8 flex justify-end w-full">
       
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={ 
    handleSubmit

  } >
          Next ▶️
        </button>
      </div>
    </div>
  );
}

export default BehaviorSubject;
