import React, { createContext, useState, useEffect } from 'react';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem('readsTokens');
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('readsTokens', JSON.stringify(tokens));
  }, [tokens]);

  const addTokens = (amount) => setTokens(prev => prev + amount);
  const spendTokens = (amount) => setTokens(prev => Math.max(prev - amount, 0));

  return (
    <TokenContext.Provider value={{ tokens, addTokens, spendTokens }}>
      {children}
    </TokenContext.Provider>
  );
};