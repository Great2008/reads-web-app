import React from 'react';
import { User, Lock, AlertCircle, LogOut } from 'lucide-react';

const ProfileModule = ({ user, onLogout }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold dark:text-white">Profile</h2>
      <div className="flex flex-col items-center py-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
        <img src={user.avatar} className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-50" alt="Avatar" />
        <h3 className="text-xl font-bold dark:text-white">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-left dark:text-gray-200 border-b border-gray-100 dark:border-slate-700">
          <User size={20} className="text-gray-400" /> Edit Details
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-left dark:text-gray-200 border-b border-gray-100 dark:border-slate-700">
          <Lock size={20} className="text-gray-400" /> Change Password
        </button>
        <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-left dark:text-gray-200">
          <AlertCircle size={20} className="text-gray-400" /> Help & Support
        </button>
      </div>

      <button onClick={onLogout} className="w-full p-4 flex items-center justify-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl font-bold hover:bg-red-100 transition-colors">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default ProfileModule;