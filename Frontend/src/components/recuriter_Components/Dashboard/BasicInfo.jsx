
import { useState } from "react";

function BasicInfo(props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); 
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [test_visibility, setTestVisibility] = useState("");
  const [jobDeadline, setJobDeadline] = useState(0);

  const formData = {
    company: company,
    role: role,
    date: date,
    time: time,
    description: description,
    test_visibility: test_visibility,
    deadline: jobDeadline
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    localStorage.setItem("jobData", JSON.stringify(formData));
    props.Next();
  }
  

  return (
    <div className="flex flex-col h-auto w-full text-black bg-white border rounded-lg shadow-lg p-6">
      <h1 className="font-semibold text-3xl text-gray-800 mb-8">
        Basic Information about Interview
      </h1>
      <form onSubmit={(e)=>{handleSubmit(e)}}>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="company">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="role">
              Interview Role
            </label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
      
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            </div>
            <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="date">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="desc">
              Description
            </label>
            <textarea
              id="desc"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of the interview"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>
        </div>
        <div className="mt-8 flex justify-end items-center w-full gap-4">
  <div className="flex items-center gap-2">
    <label
      htmlFor="testVisibility"
      className="block text-gray-700 font-medium"
    >
      Test Visibility:
    </label>
    <select
      id="testVisibility"
      value={test_visibility}
      onChange={(e) => setTestVisibility(e.target.value)}
      required
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="" disabled>
        ---Select visibility---
      </option>
      <option value="public">Public</option>
      <option value="private">Private</option>
    </select>
  </div>
  {test_visibility === "public" && <div>
    <label>Job Deadline(in days): </label>
    <input
      type="number"
      value={jobDeadline}
      onChange={(e) => setJobDeadline(e.target.value) }
      min="1"
      max="30"
      placeholder="Enter deadline in days"
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
}

  <button
    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
    type="submit"
  >
    Next ▶️
  </button>
</div>

        </form>
    </div>
  );
}

export default BasicInfo;
