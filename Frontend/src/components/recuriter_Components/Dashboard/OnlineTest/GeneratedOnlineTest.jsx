/* eslint-disable react/prop-types */
import { useState } from "react";

function GeneratedOnlineTest(props) {
  const questions = [
    {
      question: "Which of the following is used to declare a constant in JavaScript?",
      op1: "var",
      op2: "let",
      op3: "const",
      op4: "define"
    },
    {
      question: "Which method is used to parse a JSON string into a JavaScript object?",
      op1: "JSON.stringify()",
      op2: "JSON.parse()",
      op3: "JSON.objectify()",
      op4: "parseJSON()"
    },
    {
      question: "Which HTML tag is used to link a JavaScript file?",
      op1: "<js>",
      op2: "<script>",
      op3: "<link>",
      op4: "<javascript>"
    },
    {
      question: "What is the output of `typeof null` in JavaScript?",
      op1: "'object'",
      op2: "'null'",
      op3: "'undefined'",
      op4: "'number'"
    },
    {
      question: "Which array method creates a new array with elements that pass a test?",
      op1: "map()",
      op2: "reduce()",
      op3: "filter()",
      op4: "forEach()"
    },
    {
      question: "Which keyword is used to handle asynchronous operations in modern JavaScript?",
      op1: "setTimeout",
      op2: "await",
      op3: "sync",
      op4: "defer"
    },
    {
      question: "What does the DOM stand for?",
      op1: "Data Object Model",
      op2: "Document Object Model",
      op3: "Display Object Model",
      op4: "Dynamic Object Model"
    },
    {
      question: "Which of the following is a JavaScript framework?",
      op1: "Laravel",
      op2: "React",
      op3: "Django",
      op4: "Flask"
    },
    {
      question: "Which CSS property is commonly manipulated via JavaScript to hide an element?",
      op1: "visibility",
      op2: "display",
      op3: "position",
      op4: "opacity"
    },
    {
      question: "What is the default behavior of event bubbling in JavaScript?",
      op1: "Top to bottom",
      op2: "Bottom to top",
      op3: "Left to right",
      op4: "Right to left"
    }
  ];

  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (questionIndex, optionKey) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: optionKey
    }));
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Generated Questions</h2>
      <div className="h-[500px] overflow-y-auto pr-2">
      <ol className="list-decimal pl-5 space-y-4">
        {questions.map((que, index) => (
          <li key={index}>
            <p className="font-semibold mb-2">{que.question}</p>
            <ul className="list-none space-y-2">
              {Object.entries(que)
                .filter(([key]) => key.startsWith("op"))
                .map(([key, value]) => (
                  <li key={key}>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 border-2 rounded-md cursor-pointer ${
                        selectedOptions[index] === key ? "bg-blue-100 border-blue-400" : "border-gray-100"
                      }`}
                      onClick={() => handleOptionChange(index, key)}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={key}
                        checked={selectedOptions[index] === key}
                        onChange={() => handleOptionChange(index, key)}
                      />
                      <label className="cursor-pointer">{value}</label>
                    </div>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ol>
      </div>
      <div className="mt-8 flex justify-end w-full">
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={props.Next}>Confirm</button>
      </div>
    </div>
  );
}

export default GeneratedOnlineTest;
