import { useState } from "react"

 export function UseCandidateShortlist() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onlineTestShortList = async (onlineResponseId)=>{
        try {
        setLoading(true);
        const res = await fetch('/api/recruiter/updateOnlineTestResponse',{
        method : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id : onlineResponseId
        })
      })
    const data = await res.json();
    setLoading(false);
    if(!res.ok){
        setLoading(false);
        console.error("Error updating online test response:", data.message); 
        setError(data.message || "Failed to shortlist candidate for online test"); 
    }     
    setError(data.message || "Shortlisted candidate for online test successfully");
    return data;
    } catch (error) {
        setLoading(false);
        console.error("Error in online test shortlist:", error.message);
        setError(error.message || "Failed to shortlist candidate for online test");
        return null;
    }

    }
    return { loading, error, onlineTestShortList };
}

