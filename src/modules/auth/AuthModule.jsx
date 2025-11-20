import React, { useState } from 'react';
import { api } from '../../services/api';

const AuthModule = ({ view, onLoginSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPass: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.auth.login(formData.email, formData.password);
      onLoginSuccess(response.user);
    } catch (err) {
      // Use a custom message box instead of alert()
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPass) {
        // Use a custom message box instead of alert()
        console.error("Passwords do not match");
        return;
    }
    setLoading(true);
    try {
      const response = await api.auth.signup(formData);
      onLoginSuccess(response.user);
    } finally {
      setLoading(false);
    }
  };

  const AuthInput = ({ label, name, type = "text", placeholder }) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      <input 
        name={name} 
        type={type} 
        placeholder={placeholder} 
        onChange={handleChange} 
        value={formData[name] || ''} // <-- FIX: Added value prop
        required
        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
      />
    </div>
  );

  if (view === 'forgot-password') {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your email to recover your account.</p>
        <AuthInput label="Email Address" name="email" type="email" />
        <button 
          disabled={loading} 
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-4 disabled:opacity-50" 
          onClick={() => {
            setLoading(true);
            api.auth.resetPassword(formData.email).finally(() => setLoading(false));
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <button onClick={() => onNavigate('login')} className="w-full text-gray-500 text-sm">Back to Login</button>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">Create Account</h2>
        <form onSubmit={handleSignup}>
          <AuthInput label="Full Name" name="name" placeholder="John Doe" />
          <AuthInput label="Email" name="email" type="email" placeholder="john@example.com" />
          <AuthInput label="Password" name="password" type="password" placeholder="••••••" />
          <AuthInput label="Confirm Password" name="confirmPass" type="password" placeholder="••••••" />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
             {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <button onClick={() => onNavigate('login')} className="text-indigo-600 font-bold">Login</button>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Welcome Back</h1>
        <p className="text-gray-500">Login to your dashboard</p>
      </div>
      <form onSubmit={handleLogin}>
        <AuthInput label="Email" name="email" type="email" placeholder="user@example.com" />
        <AuthInput label="Password" name="password" type="password" placeholder="••••••" />
        <div className="flex justify-end mb-6">
          <button type="button" onClick={() => onNavigate('forgot-password')} className="text-sm text-indigo-500">Forgot Password?</button>
        </div>
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
             {loading ? 'Processing...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        New here? <button onClick={() => onNavigate('signup')} className="text-indigo-600 font-bold">Create Account</button>
      </p>
    </div>
  );
};

export default AuthModule;