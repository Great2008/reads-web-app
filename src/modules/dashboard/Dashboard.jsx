import React from 'react';
import { PlayCircle, Wallet } from 'lucide-react';

const Dashboard = ({ user, wallet, onNavigate }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <img src={user.avatar} className="w-14 h-14 rounded-full border-2 border-white/30" alt="Profile" />
            <div>
              <p className="text-indigo-100 text-sm">Welcome back,</p>
              <h2 className="text-2xl font-bold">{user.name}</h2>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 flex-1">
              <p className="text-xs uppercase opacity-75 mb-1">Balance</p>
              <p className="text-2xl font-bold">{wallet.balance} <span className="text-sm">TKN</span></p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 flex-1">
              <p className="text-xs uppercase opacity-75 mb-1">Lessons</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate('learn')} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PlayCircle size={24} />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-white">Start Learning</h3>
          <p className="text-xs text-gray-500 mt-1">Continue your course</p>
        </button>

        <button onClick={() => onNavigate('wallet')} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Wallet size={24} />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-white">Wallet</h3>
          <p className="text-xs text-gray-500 mt-1">View transactions</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;