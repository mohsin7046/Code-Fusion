import { useState } from "react";

function BehaviorSubject(props) {
  const [selected, setSelected] = useState([]);

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


  const handleCheckboxChange = (title) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };
  console.log(selected);
  

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-black mb-2">Behavioral Categories</h2>
      <p className="text-gray-600 mb-6">
        Select the behavioral categories you want to assess during the AI interview.
        Our AI will generate targeted questions to evaluate these aspects.
      </p>

      <div className=" h-[450px] overflow-y-auto space-y-4">
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

      <div className="mt-8 flex justify-end w-full">
       
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={props.Next}>
          Next ▶️
        </button>
      </div>
    </div>
  );
}

export default BehaviorSubject;
