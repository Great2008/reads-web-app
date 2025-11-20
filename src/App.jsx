import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Wallet, User, Settings as SettingsIcon, Menu, X, Sun, Moon } from 'lucide-react';
import { api } from './services/api';

// Import Modules
import AuthModule from './modules/auth/AuthModule';
import Dashboard from './modules/dashboard/Dashboard';
import LearnModule from './modules/learn/LearnModule';
import WalletModule from './modules/wallet/WalletModule';
import ProfileModule from './modules/profile/ProfileModule';
import SettingsModule from './modules/settings/SettingsModule';

// Placeholder URL for the logo until you place it in assets/reads-logo.png
const LOGO_URL = "https://placehold.co/40x40/F5BE4E/1F2937?text=$R";

export default function App() {
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [view, setView] = useState('login'); // 'login' | 'dashboard' | 'learn' | 'wallet' | 'profile' | 'settings'
  const [subView, setSubView] = useState(''); 
  const [navPayload, setNavPayload] = useState(null);
  // Initialize dark mode based on system preference or local storage (if we were using it)
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle dark mode
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // Apply 'dark' class to the root element when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      api.wallet.getBalance().then(data => setTokenBalance(data.balance));
    }
  }, [user]);

  const handleNavigate = (mainView, sub = '', payload = null) => {
    setView(mainView);
    setSubView(sub);
    if (payload) setNavPayload(payload);
    setSidebarOpen(false);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    handleNavigate('dashboard');
  };

  const SidebarItem = ({ icon, label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? 'bg-reads-gold text-reads-dark shadow-lg shadow-reads-gold/30' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'}`}
    >
      {icon} <span className="font-medium">{label}</span>
    </button>
  );

  // Theme Toggle Button Component (reusable)
  const ThemeToggle = ({ onClick, isDark }) => (
    <button onClick={onClick} className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-card transition-colors hover:ring-2 ring-reads-gold/50">
      {isDark ? <Sun size={20} className="text-white"/> : <Moon size={20} className="text-reads-dark" />}
    </button>
  );

  // Unauthenticated View
  // Changed background to soft app-background
  if (!user) {
    return (
      <div className="min-h-screen bg-app-background dark:bg-slate-900 transition-colors duration-300">
        <div className="flex justify-end p-4">
           <ThemeToggle onClick={toggleTheme} isDark={darkMode} />
        </div>
        {/* AuthModule will contain the main card design */}
        <AuthModule view={view} onLoginSuccess={handleAuthSuccess} onNavigate={setView} logoUrl={LOGO_URL} />
      </div>
    );
  }

  // Authenticated View
  // Changed background and sidebar colors
  return (
    <div className="min-h-screen bg-app-background dark:bg-slate-900 text-reads-dark dark:text-gray-100 font-sans transition-colors duration-300 flex">
      
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Reads Logo" className="w-8 h-8 rounded-full" />
            <h1 className="text-xl font-bold text-reads-dark dark:text-white tracking-tighter">$READS</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X /></button>
        </div>
        
        <nav className="space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={view === 'dashboard'} onClick={() => handleNavigate('dashboard')} />
          <SidebarItem icon={<BookOpen size={20} />} label="Learn & Earn" active={view === 'learn'} onClick={() => handleNavigate('learn', 'categories')} />
          <SidebarItem icon={<Wallet size={20} />} label="Wallet" active={view === 'wallet'} onClick={() => handleNavigate('wallet')} />
          <SidebarItem icon={<User size={20} />} label="Profile" active={view === 'profile'} onClick={() => handleNavigate('profile')} />
          <SidebarItem icon={<SettingsIcon size={20} />} label="Settings" active={view === 'settings'} onClick={() => handleNavigate('settings')} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="p-4 flex justify-between items-center bg-white dark:bg-slate-800 md:hidden border-b border-gray-200 dark:border-slate-700">
          <button onClick={() => setSidebarOpen(true)}><Menu /></button>
          <span className="font-bold">Learn2Earn</span>
          <ThemeToggle onClick={toggleTheme} isDark={darkMode} />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full pb-20">
          {view === 'dashboard' && <Dashboard user={user} wallet={{balance: tokenBalance}} onNavigate={handleNavigate} />}
          
          {view === 'learn' && (
            <LearnModule 
              subView={subView} 
              activeData={navPayload} 
              onNavigate={handleNavigate} 
              onUpdateWallet={(amt) => setTokenBalance(b => b + amt)} 
            />
          )}
          
          {view === 'wallet' && <WalletModule balance={tokenBalance} />}
          
          {view === 'profile' && <ProfileModule user={user} onLogout={() => setUser(null)} />}
          
          {view === 'settings' && <SettingsModule darkMode={darkMode} toggleTheme={toggleTheme} />}
        </div>
      </main>
    </div>
  );
}