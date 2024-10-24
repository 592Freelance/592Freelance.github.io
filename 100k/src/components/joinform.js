import React, { useState } from 'react';

function JoinForm({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registered successfully. Please log in.');
        onClose();
      } else {
        alert(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Join</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition duration-200">
        Join
      </button>
    </form>
  );
}

export default JoinForm;
