import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

const WalletModule = ({ balance }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.wallet.getHistory().then(setHistory);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold dark:text-white">My Wallet</h2>
      
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Total Balance</p>
        <h3 className="text-4xl font-bold">{balance} <span className="text-yellow-400 text-xl">TKN</span></h3>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
          <Wallet size={120} />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 dark:text-white">History</h3>
        <div className="space-y-3">
          {history.map(tx => (
            <div key={tx.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-600 p-2 rounded-full"><CheckCircle size={16}/></div>
                <div>
                  <p className="font-bold text-sm dark:text-white">{tx.title}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <span className="font-bold text-green-600">+{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletModule;