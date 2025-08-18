/* eslint-disable react/prop-types */
import { useState } from "react";
import { getRecruiterToken } from "../../../../hooks/role.js";
import useCreateSummary from "../../../../hooks/useCreateSummary";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";


export default function CodingTest(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

   const tokenData = getRecruiterToken();
  const { createSummary } = useCreateSummary();


  const handleCheck = async ()=>{
    setLoading(true);
    try {
      const response = await fetch('/api/recruiter/createCodingTest',{
        method : 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          jobId :  tokenData.jobId,
          recruiterId : tokenData.recruiterId,
          title : title,
          description :  description,
          duration :  parseInt(duration),
          onlineTestId :  tokenData.onlineTestId,
          behaviourTestId  : tokenData.behaviourTestId,
        })

      })
      setLoading(false);
      const data = await response.json();
      if(!response.ok){
        console.log("Error Creating Coding Test",data.message);
        toast.error(data.message || "Error Creating Coding Test");
        throw new Error("Error creating Coding Test");
      }
      console.log("Coding Test Created Successfully",data);
      toast.success(data.message || "Coding Test Created Successfully");
      setLoading(true);

      console.log(tokenData);
      
     const resp = await createSummary(
        tokenData.jobId,
        tokenData.recruiterId,
        tokenData.onlineTestId,
        tokenData.behaviourTestId,
        data?.data?.id
      )

  if(resp.success){
    setLoading(false);
    toast.success(resp.message)
    props.Next();
  }else{
   setLoading(false);
   toast.success(resp.message);
  }
    } catch (error) {
      setLoading(false)
      toast.error("Error creating Coding Test")
      console.log("Error creating Coding Test",error.message)
    }
    
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="max-w-full mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-indigo-700">Coding Test Configuration</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 p-3 border rounded-lg"
            placeholder="Enter test title"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 p-3 border rounded-lg resize-none"
            placeholder="Test description"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Duration (in minutes)</label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            type="number"
            className="w-full p-2 border rounded-lg"
            placeholder="60"
            required
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end w-full">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" type="submit" onClick={handleCheck}>
               {loading ?  <LoaderCircle /> :  "Next ▶️"  } 
            </button>
        </div>

    </form>
  );
}
