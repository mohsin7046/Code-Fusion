import { useState, useEffect } from "react";
import JobCard from "./JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/jobs");
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch jobs:", data.message);
          return;
        }

        console.log("Fetched jobs:", data);

        
        const mappedJobs = data.jobs.map((job) => ({
          id: job.id,
          title: job.interviewRole,
          company: job.companyName,
          location: job.location,
          tests: job.tags || [],
          description: job.companyDescription,
        }));

        setJobs(mappedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchData();
  }, []);


  const uniqueTitles = [...new Set(jobs.map((job) => job.title))];

  const filteredJobs = selectedTitle
    ? jobs.filter((job) => job.title === selectedTitle)
    : jobs;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-center text-3xl font-bold text-blue-900 mb-6">
        ALL JOBS
      </h1>

      <div className="flex justify-end mb-6">
        <select
          value={selectedTitle}
          onChange={(e) => setSelectedTitle(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">All Titles</option>
          {uniqueTitles.map((title, idx) => (
            <option key={idx} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, idx) => <JobCard  key={idx} {...job} />)
        ) : (
          <p className="text-gray-600 text-center col-span-full">
            No jobs found
          </p>
        )}
      </div>
    </div>
  );
}
