import { useState } from "react";
import { motion } from "framer-motion";
import getToken from "../../../hooks/role.js";

// eslint-disable-next-line react/prop-types
export default function JobCard({ id,title, company, location, tests, description }) {
  const [showFull, setShowFull] = useState(false);

  const form = getToken();
 
  

  const handleClick = async() => {
    if (!form?.isUserDocumentUploaded) {
      alert("Please complete your profile first.");
      return;
    }

    try {
      const response = await fetch("/api/user/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId:id, email: form.email}),
      });

      if (!response.ok) {
        throw new Error("Failed to apply for the job");
      }
      console.log(response);
      
      alert("Successfully applied for the job!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for the job. Please try again later.");
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white shadow-md rounded-2xl p-5 border border-blue-100 w-full sm:w-[350px] flex flex-col justify-between"
    >
      <div>
        <h2 className="text-lg font-semibold text-blue-800">{title}</h2>
        <p className="text-sm text-gray-500">{company}</p>
        <p className="text-xs text-gray-400 mb-3">{location}</p>

        
        <div className="flex flex-wrap gap-2 mb-3">
          {tests?.map((test, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
            >
              {test}
            </span>
          ))}
        </div>

        
        <p className="text-sm text-gray-600">
          {showFull ? description : description.slice(0, 60)}
          {description.length > 60 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="ml-2 text-blue-500 font-medium"
            >
              {showFull ? "show less" : "...more"}
            </button>
          )}
        </p>
      </div>

      
      <div className="relative group mt-4 w-full">
        <button
          disabled={!form?.isUserDocumentUploaded}
          className={`w-full py-2 rounded-xl transition 
            ${form?.isUserDocumentUploaded
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"
            }`}
            onClick={handleClick}
        >
          Apply
        </button>

        
        {!form?.isUserDocumentUploaded && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-black text-white text-xs rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
            Please complete profile first
          </div>
        )}
      </div>
    </motion.div>
  );
}
