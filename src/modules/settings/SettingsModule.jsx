import React from 'react';
import { Moon, Sun } from 'lucide-react';

const SettingsModule = ({ darkMode, toggleTheme }) => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {darkMode ? <Moon className="text-indigo-500" /> : <Sun className="text-orange-500" />}
        <span className="font-medium dark:text-white">Dark Mode</span>
      </div>
      <button onClick={toggleTheme} className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
      </button>
    </div>
    <div className="p-4 text-center text-gray-400 text-sm">
      Version 1.0.0 MVP
    </div>
  </div>
);

export default SettingsModule;