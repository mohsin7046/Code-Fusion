
import { useState } from "react";

function BasicInfo(props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); 
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const formData = {
    company: company,
    role: role,
    date: date,
    time: time,
    description: description
  }

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <div className="mt-8 flex justify-end w-full">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" type="submit">
                Next ▶️
            </button>
        </div>
        </form>
    </div>
  );
}

export default BasicInfo;
