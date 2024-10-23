import React from 'react';

function JobCard({ title, description, budget }) {
  const handleRequest = () => {
    alert('Your request has been submitted and is being processed.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition transform hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-red-500 mb-2">{title}</h3>
      <p className="mb-4 text-gray-600">{description}</p>
      <p className="font-bold text-teal-500 mb-4">Budget: {budget}</p>
      <div className="flex space-x-2">
        <a href="#job-details" className="flex-1 bg-teal-500 text-white px-4 py-2 rounded-full text-center hover:bg-teal-600 transition duration-200">View Details</a>
        <button onClick={handleRequest} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-200">Request</button>
      </div>
    </div>
  );
}

export default JobCard;
