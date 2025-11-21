import React, { useState } from 'react';
import { api } from '../../services/api';
import readsLogo from '../../../assets/reads-logo.png'; // Updated path for the image from AuthModule

const AuthModule = ({ view, onLoginSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPass: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Custom Gradient Button Component
  const GoldButton = ({ children, onClick, disabled, className = '', type = 'button' }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-lg font-semibold text-reads-dark transition-all disabled:opacity-50
                  bg-gradient-to-t from-reads-gold/90 to-reads-gold hover:from-reads-gold/80 hover:to-reads-gold/90
                  shadow-smooth hover:shadow-lg ${className}`}
    >
      {children}
    </button>
  );


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.auth.login(formData.email, formData.password);
      // In a real Firebase setup, onLoginSuccess is often not needed, but we keep it for simplicity.
      // The onAuthStateChanged listener in App.jsx will handle navigation.
      console.log("Mock login successful.");
      onNavigate('dashboard');
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
      // The onAuthStateChanged listener in App.jsx will handle navigation.
      console.log("Mock signup successful.");
      onNavigate('dashboard');
    } finally {
      setLoading(false);
    }
  };

  // New clean input style matching the design
  const AuthInput = ({ label, name, type = "text", placeholder }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">{label}</label>
      <input 
        name={name} 
        type={type} 
        placeholder={placeholder} 
        onChange={handleChange} 
        value={formData[name] || ''}
        required
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-reads-gold outline-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
      />
    </div>
  );

  // Layout container matching the main design structure
  const AuthLayout = ({ title, children }) => (
    <div className="max-w-xs sm:max-w-sm mx-auto p-4 pt-10">
      {/* Top Logo and Slogan */}
      <div className="flex flex-col items-center mb-10">
        <img src={readsLogo} alt="$READS Logo" className="w-12 h-12 mb-2" />
        <h1 className="text-3xl font-bold text-reads-dark dark:text-white">$READS</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Learn. Earn. Excel.</p>
      </div>

      {/* Login/Signup Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-smooth p-6 sm:p-8">
        <h2 className="text-xl font-bold text-reads-dark dark:text-white mb-6 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );

  if (view === 'forgot-password') {
    return (
      <AuthLayout title="Reset Password">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email to recover your account.</p>
        <AuthInput label="Email" name="email" type="email" placeholder="user@example.com" />
        <GoldButton
          type="button"
          disabled={loading} 
          onClick={() => {
            setLoading(true);
            api.auth.resetPassword(formData.email).finally(() => setLoading(false));
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </GoldButton>
        <button onClick={() => onNavigate('login')} className="w-full text-gray-500 dark:text-gray-400 text-sm mt-4">Back to Login</button>
      </AuthLayout>
    );
  }

  if (view === 'signup') {
    return (
      <AuthLayout title="Create Account">
        <form onSubmit={handleSignup}>
          <AuthInput label="Full Name" name="name" placeholder="John Doe" />
          <AuthInput label="Email" name="email" type="email" placeholder="john@example.com" />
          <AuthInput label="Password" name="password" type="password" placeholder="••••••" />
          <AuthInput label="Confirm Password" name="confirmPass" type="password" placeholder="••••••" />
          <GoldButton type="submit" disabled={loading}>
             {loading ? 'Creating...' : 'Sign Up'}
          </GoldButton>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <button onClick={() => onNavigate('login')} className="text-reads-gold font-semibold">Login</button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleLogin}>
        <AuthInput label="Email" name="email" type="email" placeholder="user@example.com" />
        <AuthInput label="Password" name="password" type="password" placeholder="••••••" />
        <div className="flex justify-end mb-6">
          <button type="button" onClick={() => onNavigate('forgot-password')} className="text-sm text-reads-gold font-medium hover:text-reads-gold/80 transition-colors">Forgot password?</button>
        </div>
        <GoldButton type="submit" disabled={loading}>
             {loading ? 'Logging in...' : 'Login'}
        </GoldButton>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <p>Don't have an account? <button onClick={() => onNavigate('signup')} className="text-reads-gold font-semibold">Sign up</button></p>
      </div>
    </AuthLayout>
  );
};

export default AuthModule;