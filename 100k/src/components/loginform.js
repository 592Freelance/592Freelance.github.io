import React, { useState } from 'react';

function LoginForm({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Logged in successfully');
        onClose();
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        Login
      </button>
    </form>
  );
}

export default LoginForm;
