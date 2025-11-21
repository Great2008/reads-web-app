import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Wallet, User, Settings as SettingsIcon, Menu, X, Sun, Moon } from 'lucide-react';
import { api } from './services/api';
import readsLogo from '../assets/reads-logo.png'; 

import AuthModule from './modules/auth/AuthModule';
import Dashboard from './modules/dashboard/Dashboard';
import LearnModule from './modules/learn/LearnModule';
import WalletModule from './modules/wallet/WalletModule';
import ProfileModule from './modules/profile/ProfileModule';
import SettingsModule from './modules/settings/SettingsModule';

export default function App() {
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [view, setView] = useState('login'); 
  const [subView, setSubView] = useState(''); 
  const [navPayload, setNavPayload] = useState(null);
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check for User Session on App Load
  useEffect(() => {
    const checkSession = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const userData = await api.auth.me();
            if (userData) {
                setUser(userData);
                setView('dashboard');
            } else {
                // Token invalid
                localStorage.removeItem('access_token');
            }
        }
        setIsLoading(false);
    };
    checkSession();
  }, []);

  // 2. Fetch Wallet when User changes
  useEffect(() => {
    if (user) {
        api.wallet.getBalance().then(data => setTokenBalance(data.balance));
    }
  }, [user]);

  // 3. Dark Mode Logic
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  const handleNavigate = (mainView, sub = '', payload = null) => {
    setView(mainView);
    setSubView(sub);
    if (payload) setNavPayload(payload);
    setSidebarOpen(false);
  };

  const handleLoginSuccess = async () => {
      const userData = await api.auth.me();
      setUser(userData);
      setView('dashboard');
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    setView('login');
  }

  const SidebarItem = ({ icon, label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? 'bg-reads-gold text-reads-dark shadow-lg shadow-reads-gold/30' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'}`}
    >
      {icon} <span className="font-medium">{label}</span>
    </button>
  );

  const ThemeToggle = ({ onClick, isDark }) => (
    <button onClick={onClick} className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-card transition-colors hover:ring-2 ring-reads-gold/50">
      {isDark ? <Sun size={20} className="text-white"/> : <Moon size={20} className="text-reads-dark" />}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-background dark:bg-slate-900">
        <div className="text-reads-dark dark:text-white text-lg font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  // Unauthenticated View
  if (!user) {
    return (
      <div className="min-h-screen bg-app-background dark:bg-slate-900 transition-colors duration-300">
        <div className="flex justify-end p-4">
           <ThemeToggle onClick={toggleTheme} isDark={darkMode} />
        </div>
        <AuthModule 
            view={view === 'signup' || view === 'forgot-password' ? view : 'login'} 
            onLoginSuccess={handleLoginSuccess} 
            onNavigate={setView} 
            logoUrl={readsLogo} 
        />
      </div>
    );
  }

  // Authenticated View
  return (
    <div className="min-h-screen bg-app-background dark:bg-slate-900 text-reads-dark dark:text-gray-100 font-sans transition-colors duration-300 flex">
      
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <img src={readsLogo} alt="Reads Logo" className="w-8 h-8 rounded-full" />
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
        
        <div className="absolute bottom-6 w-full pr-12">
            <button 
                onClick={handleLogout}
                className="w-full py-2 px-3 rounded-xl text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
            >
                <User size={18} /> Log Out
            </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="p-4 flex justify-between items-center bg-white dark:bg-slate-800 md:hidden border-b border-gray-200 dark:border-slate-700">
          <button onClick={() => setSidebarOpen(true)}><Menu /></button>
          <span className="font-bold">$READS</span>
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
          
          {view === 'profile' && <ProfileModule user={user} onLogout={handleLogout} />}
          
          {view === 'settings' && <SettingsModule darkMode={darkMode} toggleTheme={toggleTheme} />}
        </div>
      </main>
    </div>
  );
}