/* eslint-disable react/prop-types */
import { useState } from 'react';
import { systemPrompt } from '../../../../hooks/GeminiApi/geminiPrompt.js';
import { generateResponse } from '../../../../hooks/GeminiApi/gemini.js';
import {getRecruiterToken} from '../../../../hooks/role.js';
import { toast } from 'react-toastify';
import { LoaderCircle } from 'lucide-react';

const predefinedSubjects = [
  'Data Structures', 'Algorithms', 'Computer Networks', 'Operating Systems', 'Database Management Systems', 'Software Engineering', 'Compiler Design', 'Web Development', 'Mobile App Development', 'Machine Learning', 'Artificial Intelligence', 'Cloud Computing', 'Cyber Security', 'Information Security', 'Data Science', 'Big Data', 'Internet of Things (IoT)', 'Blockchain', 'DevOps', 'System Design', 'Digital Electronics', 'Computer Architecture', 'Embedded Systems', 'Math', 'Aptitute', 'DBMS',
  'C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'SQL', 'HTML', 'CSS', 'R', 'MATLAB', 'Shell Scripting',
  'React.js', 'Node.js', 'Express.js', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot', 'Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'Jenkins', 'TensorFlow', 'PyTorch'
];


const MARKS_SCHEME = [
  { label: 'Easy', marks: 1 },
  { label: 'Medium', marks: 2 },
  { label: 'Difficult', marks: 3 }
];


function OnlineTest_Subject(props) {
  const [subject, setSubject] = useState([
    { name: 'Math', easy: 0, medium: 0, difficult: 0 }
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputIndex, setInputIndex] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60); 
  const [passingScore, setPassingScore] = useState(40); 
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    setInputIndex(index);
    updateInput(index, 'name', value);

    const suggestions = predefinedSubjects.filter((subj) =>
      subj.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(suggestions);
  };

  const updateInput = (index, fieldname, value) => {
    const newsub = [...subject];
    newsub[index] = { ...newsub[index], [fieldname]: fieldname === 'name' ? value : Math.max(0, Number(value)) };
    setSubject(newsub);
  };

  const removeSubject = (index) => {
    const remaining = subject.filter((_, i) => i !== index);
    setSubject(remaining);
  };

  const increaseSubject = () => {
    setSubject([...subject, { name: '', easy: 0, medium: 0, difficult: 0 }]);
  };

  const handleSuggestionClick = (suggestion) => {
    if (inputIndex !== null) {
      updateInput(inputIndex, 'name', suggestion);
      setFilteredSuggestions([]);
      setInputIndex(null);
    }
  };

  const totalQuestions = subject.reduce(
    (acc, sub) => acc + (sub.easy || 0) + (sub.medium || 0) + (sub.difficult || 0),
    0
  );
  const totalMarks = subject.reduce(
    (acc, sub) =>
      acc +
      (sub.easy || 0) * 1 +
      (sub.medium || 0) * 2 +
      (sub.difficult || 0) * 3,
    0
  );

const prompt = `
You are an AI question generation assistant for an online interview platform. Based on the provided configuration, generate subject-wise multiple-choice questions.
Requirements:

* Total questions per subject = easy + medium + difficult
* Each question must have:

  * 4 distinct options
  * Fields:
    * question: string
    * options: array of 4 strings
    * correctAnswer: number (0–3)
    * subject: string
    * difficulty: "EASY" | "MEDIUM" | "HARD"
    * points: 1 (easy), 2 (medium), 3 (hard)
  
  Subjects and their difficulty wise questions:
    ${JSON.stringify(subject)},

  Given the questions on the subjects mentioned above with the following distribution easy ,medium, and difficult. Not Give the improper distribution of questions like for example if react has total of 6 questions so  give more than 6 questions of react or do not give less than of it in response.

  Total Questions: ${totalQuestions},
  Total Marks: ${totalMarks},
Constraints:
* Follow the subject names and difficulty distribution exactly.
* Questions must be original, relevant, and match the difficulty.
* Output strictly valid JSON with no markdown, comments, or formatting.
  `

  const fullPrompt =`
  ${systemPrompt}

  USER: ${prompt}
  `


  const tokenData = getRecruiterToken();
 
  const handleSubmit = async (e) => {
    let generateRes;
    e.preventDefault();
    console.log(prompt);
    try {
      setLoading(true);
      const response = await generateResponse(fullPrompt);
      generateRes = JSON.parse(response);

      const generatedQuestions = generateRes.questions;
      console.log(generatedQuestions);

    const payload = {
      jobId: tokenData.jobId,
      recruiterId: tokenData.recruiterId,
      title: title, 
      description: description, 
      password: Math.random().toString(36).slice(-8), 
      duration: parseInt(duration), 
      totalQuestions: parseInt(totalQuestions),
      passingScore: parseInt(passingScore), 
      subjects:
         subject.map((sub) => ({
          name: sub.name,
          easyQuestions: sub.easy,
          hardQuestions: sub.difficult,
          mediumQuestions: sub.medium,
          totalQuestions: sub.easy + sub.medium + sub.difficult,
        })),
      questions: 
       generatedQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: parseInt(q.correctAnswer),
        subject: q.subject,
        difficulty: q.difficulty,
        points: parseInt(q.points)
      })),
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), 
    };

    console.log("Payload to be sent:", payload);
    const res = await fetch('/api/recruiter/create-online-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(payload),
    });
    console.log("Response from server:", res);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { 
      toast.error(data.message || 'Failed to create online test');
      throw new Error(data.message || 'Failed to create online test');
    }
    toast.success(data.message || 'Online test created successfully');
    props.Next(); 
    } catch (error) {
      setLoading(false);
      toast.error('Error generating questions');
      console.error("Error generating questions:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto bg-white p-8 rounded-xl shadow-md space-y-4"
    >
      <div className="flex justify-end">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm flex gap-4">
          <span className="font-semibold text-indigo-700">Marking Scheme:</span>
          {MARKS_SCHEME.map((s, i) => (
            <span key={i} className="text-gray-700">
              <span className={`font-semibold ${s.label === 'Easy' ? 'text-green-600' : s.label === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                {s.label}
              </span>: {s.marks} mark{s.marks > 1 ? 's' : ''}
            </span>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-indigo-700">Online Test Configuration</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-12 p-3 border rounded-lg" placeholder="Enter test title" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 p-3 border rounded-lg resize-none" placeholder="Test description" required />
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 font-semibold text-gray-700">
          <div className="col-span-4">Subject</div>
          <div className="col-span-2 text-center text-green-600">Easy</div>
          <div className="col-span-2 text-center text-yellow-600">Medium</div>
          <div className="col-span-2 text-center text-red-600">Difficult</div>
          <div className="col-span-2 text-center">Remove</div>
        </div>

        {subject.map((sub, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center relative">
            <div className="col-span-4 relative">
              <input
                type="text"
                value={sub.name}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Subject name"
                className="w-full p-2 border rounded-lg"
              />
              {inputIndex === index && sub.name && filteredSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 z-10 w-full bg-white border rounded max-h-48 overflow-y-auto shadow">
                  {filteredSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {['easy', 'medium', 'difficult'].map((level, i) => (
              <input
                key={i}
                type="number"
                min={0}
                value={sub[level]}
                onChange={(e) => updateInput(index, level, e.target.value)}
                className="col-span-2 p-2 border rounded-lg text-center"
                placeholder={level}
              />
            ))}
            <button
              type="button"
              onClick={() => removeSubject(index)}
              className="col-span-2 text-center text-red-600 hover:text-red-800 text-lg"
              title="Remove subject"
            >
              🗑️
            </button>
          </div>
        ))}

        <button
          type="button"
          className="text-purple-600 hover:underline mt-2"
          onClick={increaseSubject}
        >
          + Add Subject
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">Duration (in minutes)</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" className="w-full p-2 border rounded-lg" placeholder="60" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Passing Score</label>
          <input value={passingScore} onChange={(e) => setPassingScore(e.target.value)} type="number" className="w-full p-2 border rounded-lg" placeholder="40" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">Total Questions</label>
          <input  type="number"  className="w-full p-2 border rounded-lg bg-gray-100" value={totalQuestions} disabled />
        </div>
        <div>
          <label className="block font-medium mb-1">Total Marks</label>
          <input  type="number" value={totalMarks} className="w-full p-2 border rounded-lg bg-gray-100" disabled />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
      >
       {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "Generate Test"}
      </button>
    </form>
  );
}

export default OnlineTest_Subject;