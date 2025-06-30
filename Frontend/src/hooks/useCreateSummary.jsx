function useCreateSummary() {
    const createSummary = async (jobId,recruiterId,onlineTestId,behavioralInterviewId,codingTestId)=>{

        try {
            const response = await fetch('/api/recruiter/create-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId : jobId,
                    recruiterId : recruiterId,
                    onlineTestId : onlineTestId || null,
                    behavioralInterviewId : behavioralInterviewId || null,
                    codingTestId : codingTestId || null
                }),
            });
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create summary");
            }
            const data = await response.json();
            return { success: true, message: "Summary created successfully", summary: data.summary };
        } catch (error) {
            console.error("Error in creating summary:", error);
            return { success: false, message: "Failed to create summary" };
        }
    }
    return { createSummary };
}

export default useCreateSummary;