import { useState } from "react"

export function UseCandidateCodingTest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const codingTestShortList = async (codingResponseId) => {
        try {
            setLoading(true);
            const res = await fetch('/api/recruiter/shortlistCandidate_Coding', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: codingResponseId
                })
            });
            const data = await res.json();
            setLoading(false);
            if (!res.ok) {
                setLoading(false);
                console.error("Error updating behavioural test response:", data.message);
                setError(data.message || "Failed to shortlist candidate for behavioural test");
            }
            setError(data.message || "Shortlisted candidate for behavioural test successfully");
            return data;
        } catch (error) {
            setLoading(false);
            console.error("Error in behavioural test shortlist:", error.message);
            setError(error.message || "Failed to shortlist candidate for behavioural test");
            return null;
        }
    }

    return { loading, error, codingTestShortList };
}
