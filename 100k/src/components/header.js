import React from 'react';

function Header({ onLoginClick, onJoinClick }) {
  return (
    <header className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">592Freelance</div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#home" className="hover:text-teal-300 transition duration-200">Home</a></li>
            <li><a href="#jobs" className="hover:text-teal-300 transition duration-200">Find Jobs</a></li>
            <li><a href="#freelancers" className="hover:text-teal-300 transition duration-200">Find Talent</a></li>
            <li><a href="#post-job" className="hover:text-teal-300 transition duration-200">Post a Job</a></li>
            <li><button onClick={onLoginClick} className="hover:text-teal-300 transition duration-200">Login</button></li>
            <li><button onClick={onJoinClick} className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-teal-300 hover:text-white transition duration-200">Join</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
