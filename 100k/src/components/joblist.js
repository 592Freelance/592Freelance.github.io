import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Featured Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} {...job} />
        ))}
      </div>
    </section>
  );
}

export default JobList;
