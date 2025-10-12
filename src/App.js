import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { TokenProvider } from './components/TokenContext';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import Wallet from './pages/Wallet';
import Unlock from './pages/Unlock';
import './styles.css';

export default function App() {
  return (
    <TokenProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/unlock" element={<Unlock />} />
        </Routes>
      </Router>
    </TokenProvider>
  );
}