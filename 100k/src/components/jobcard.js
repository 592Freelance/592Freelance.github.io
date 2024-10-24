import React from 'react';

function JobCard({ _id, title, description, budget }) {
  const handleRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit a bid');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: _id,
          amount: budget,
          proposal: "I'm interested in this job"
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      alert('Your bid has been submitted successfully.');
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Failed to submit bid. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition transform hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-red-500 mb-2">{title}</h3>
      <p className="mb-4 text-gray-600">{description}</p>
      <p className="font-bold text-teal-500 mb-4">Budget: ${budget}</p>
      <div className="flex space-x-2">
        <a href={`#job-details/${_id}`} className="flex-1 bg-teal-500 text-white px-4 py-2 rounded-full text-center hover:bg-teal-600 transition duration-200">View Details</a>
        <button onClick={handleRequest} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-200">Submit Bid</button>
      </div>
    </div>
  );
}

export default JobCard;
