import React from 'react';
import JobCard from './JobCard';

function JobList() {
  const jobs = [
    {
      title: "Full-Stack Developer",
      description: "Seeking a skilled full-stack developer to build a cutting-edge e-commerce platform.",
      budget: "$5,000 - $7,000"
    },
    {
      title: "UI/UX Designer",
      description: "Looking for a creative UI/UX designer to reimagine our mobile app interface.",
      budget: "$3,000 - $4,500"
    },
    {
      title: "Content Strategist",
      description: "Need an experienced content strategist to develop a comprehensive marketing plan.",
      budget: "$2,500 - $3,500"
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Featured Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </section>
  );
}

export default JobList;
