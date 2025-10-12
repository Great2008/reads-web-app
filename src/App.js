import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firestore, createUserDocIfNotExists, getUserDoc } from './firebase';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Earn from './pages/Earn';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await createUserDocIfNotExists(u);
        const doc = await getUserDoc(u.uid);
        setUserDoc(doc);
      } else {
        setUser(null);
        setUserDoc(null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div>
      <NavBar user={user} userDoc={userDoc} onLogout={handleLogout} />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin user={user} userDoc={userDoc} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;