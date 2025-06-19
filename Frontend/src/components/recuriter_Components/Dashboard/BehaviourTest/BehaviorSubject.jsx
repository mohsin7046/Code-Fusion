/* eslint-disable react/prop-types */
import { useState } from "react";

function BehaviorSubject(props) {
  const [selected, setSelected] = useState([]);
  const [maxScore,setmaxScore] = useState(0);
  const [totalQuestion,settotalQuestion] = useState(0);
  const [duration,setDuration] = useState(0);
  

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


const allQuestions = [
  "Describe a time when your communication helped avoid a major misunderstanding in a project.",
  "How do you ensure that non-technical stakeholders understand the implications of technical decisions?",
  "Tell me about a time when you had to debug a critical issue under pressure. How did you approach it?",
  "Give an example of how you managed conflicting priorities in a fast-paced development cycle.",
  "Tell me about a technical challenge you faced that required you to learn something new quickly.",
  "Describe a situation where you disagreed with a teammate's technical approach. How did you resolve it?",
  "Can you describe a situation where you mentored a junior developer or onboarded a new team member?",
  "Tell me about a time you missed a deadline. What happened, and how did you handle it with your team or client?",
  "Have you ever received negative feedback on your code during a code review? How did you handle it?",
  "Can you share an experience where you had to refactor legacy code? What was your approach, and what were the outcomes?"
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


const evaluationCriteria = "clarity of thought, active listening, explaining complex ideas, audience awareness, non-verbal cues, asking clarifying questions"


const handleSubmit = async() => {
  const data = {
    jobId: 1234,
    recruiterId: 1234,
    totalQuestion: totalQuestion,
    subjects : selected,
    maxScore: maxScore,
    duration: duration,
    questions: allQuestions,
    evaluationCriteria: evaluationCriteria,
    keyWords: keywordData,
  }
  const res = await fetch('/api//create-behaviour-test',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({data})
  })

  const resdata = res.json();
  if (!resdata) {
    console.error("Failed to create behavioral test");
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
    <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
    <input
      type="number"
      value={maxScore}
      onChange={(e) => setmaxScore(e.target.value)}
      placeholder="e.g., 100"
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
       
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={() => {
    handleSubmit();
    props.Next
  }} >
          Next ▶️
        </button>
      </div>
    </div>
  );
}

export default BehaviorSubject;
