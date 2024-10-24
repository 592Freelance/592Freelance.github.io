import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import JobList from './components/JobList';
import Footer from './components/Footer';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import JoinForm from './components/JoinForm';

function App() {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800 min-h-screen flex flex-col">
      <Header 
        onLoginClick={() => openModal(<LoginForm onClose={closeModal} />)}
        onJoinClick={() => openModal(<JoinForm onClose={closeModal} />)}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Hero />
        <JobList />
      </main>
      <Footer />
      {modalContent && <Modal onClose={closeModal}>{modalContent}</Modal>}
    </div>
  );
}

export default App;
