/* eslint-disable react/prop-types */
import { icons } from "lucide-react"
import { useState } from "react";
import getToken from "../../../hooks/role.js";
import { LoaderCircle } from 'lucide-react';
import { toast } from "react-toastify";

function PhaseSelection(props) {
  const [loading,setLoading] = useState(false);
    const phases = [
        { title : "Online Test", desc : "Automated assessment to evaluate candidates' skills and knowledge.",icon : icons.FileCheck },
        { title : "AI Behavioral Interview", desc : "Ai driven Interview test the communication skills and cultural fit",icon : icons.Brain },
        { title : "Live Coding Interview", desc : "Real time Collaborative Coding Experience that check the problem solving skills and technical abilities",icon : icons.Brackets},
    ]
    const [selectedPhases, setSelectedPhases] = useState([]);

    const tokenData = getToken();
    console.log("userID is: ",tokenData.userId);
    

     const handleCheckboxChange = (phaseTitle) => {
    if (selectedPhases.includes(phaseTitle)) {
      setSelectedPhases(selectedPhases.filter((title) => title !== phaseTitle));
    } else {
      setSelectedPhases([...selectedPhases, phaseTitle]);
    }
  };
  console.log("Selected Phases:", selectedPhases);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log("Selected Phases:", selectedPhases);

   try {
     const formData = localStorage.getItem("jobData");
     const jobData = JSON.parse(formData);
 
     const payload = {
       companyName: jobData.company,
       interviewRole: jobData.role,
         date: jobData.date,
         time: jobData.time,
         description: jobData.description,
         recruiterId: tokenData.userId,
       hasOnlineTest: selectedPhases.includes("Online Test"),
       hasAIInterview: selectedPhases.includes("AI Behavioral Interview"),
       hasCodingTest: selectedPhases.includes("Live Coding Interview"),
     };
 
     setLoading(true);
     const response = await fetch("/api/recruiter/create-job", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(payload),
       });
 
       const data = await response.json();
 
       if (response.ok) {
         setLoading(false);
         toast.success("Job created successfully!");
         console.log("Job created successfully:", data);
         props.refreshToken();
        setTimeout(() => props.Next(), 100);
       } else {
         setLoading(false)
         toast.error(data.message || "Failed to create job.");
       }
   } catch (error) {
      console.error("Error creating job:", error);
      setLoading(false);
      toast.error("Failed to create job.");
   }

  }
  
  return (
  <>
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-auto w-full text-black bg-white border rounded-lg shadow-lg p-6"
    >
      <h2 className="text-black font-bold mb-5">Select Interview Phases</h2>
      <p className="text-gray-500 mb-4">
        Choose which phases you want to include in the interview. You can choose any combination.
      </p>

      {phases.map((phase, index) => (
        <label
          key={index}
          className={`flex items-center gap-4 p-4 border rounded-lg my-2 cursor-pointer transition ${
            selectedPhases.includes(phase.title)
              ? "border-blue-500 ring-2 ring-blue-100"
              : "hover:border-gray-400"
          }`}
        >
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(phase.title)}
            checked={selectedPhases.includes(phase.title)}
            className="w-4 h-4 accent-blue-600"
          />
          <phase.icon className="w-6 h-6 text-blue-500" />
          <div>
            <h4 className="text-lg font-semibold">{phase.title}</h4>
            <p className="text-sm text-gray-600">{phase.desc}</p>
          </div>
        </label>
      ))}

      <div className="mt-8 flex justify-end w-full">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "Next ▶️"}
        </button>
      </div>
    </form>
    </>
  );
}

export default PhaseSelection