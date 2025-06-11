/* eslint-disable react/prop-types */
import {useState} from 'react'

const predefinedSubjects = [
 'Data Structures',
  'Algorithms',
  'Computer Networks',
  'Operating Systems',
  'Database Management Systems',
  'Software Engineering',
  'Compiler Design',
  'Web Development',
  'Mobile App Development',
  'Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cyber Security',
  'Information Security',
  'Data Science',
  'Big Data',
  'Internet of Things (IoT)',
  'Blockchain',
  'DevOps',
  'System Design',
  'Digital Electronics',
  'Computer Architecture',
  'Embedded Systems',
  'Math',
  'Aptitute',
  'DBMS',


  // Programming Languages & Technologies
  'C',
  'C++',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'Kotlin',
  'Swift',
  'PHP',
  'Ruby',
  'SQL',
  'HTML',
  'CSS',
  'R',
  'MATLAB',
  'Shell Scripting',

  // Frameworks & Tools
  'React.js',
  'Node.js',
  'Express.js',
  'Angular',
  'Vue.js',
  'Django',
  'Flask',
  'Spring Boot',
  'Firebase',
  'MongoDB',
  'MySQL',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'Git',
  'GitHub',
  'Jenkins',
  'TensorFlow',
  'PyTorch'
];

function OnlineTest_Subject(props) {
  const [subject, setSubject] = useState([
    { name: 'Math', questions: 5 },
  ]);
  
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputIndex, setInputIndex] = useState(null);

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
    newsub[index] = { ...newsub[index], [fieldname]: value };
    setSubject(newsub);
  };

  const removeSubject = (index) => {
    const remaining = subject.filter((_, i) => i !== index);
    setSubject(remaining);
  };

  const increaseSubject = () => {
    setSubject([...subject, { name: '', questions: 0 }]);
  };

  const handleSuggestionClick = (suggestion) => {
    if (inputIndex !== null) {
      updateInput(inputIndex, 'name', suggestion);
      setFilteredSuggestions([]);
      setInputIndex(null);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Online Test Phase</h2>

      {subject.map((sub, index) => (
        <div key={index} className="flex items-start gap-2 mb-4 relative">
          <div className="w-full">
            <input
              type="text"
              value={sub.name}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Subject name"
              className="w-full p-2 border rounded-lg"
            />
            {inputIndex === index && sub.name && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 top-full w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto z-10">
                {filteredSuggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="number"
            value={sub.questions}
            onChange={(e) => updateInput(index, 'questions', e.target.value)}
            className="w-24 p-2 border rounded-lg"
            placeholder="Qs"
          />

          <button
            onClick={() => removeSubject(index)}
            className="text-red-500 text-xl"
          >
            🗑️
          </button>
        </div>
      ))}

      <button
        className="text-purple-600 hover:underline mb-6"
        onClick={increaseSubject}
      >
        + Add Subject
      </button>

      <button className="bg-indigo-600 text-white w-full py-3 rounded-lg shadow hover:bg-indigo-700 transition" onClick={props.Next}>
        Generate Test
      </button>
    </div>
  );
}

export default OnlineTest_Subject