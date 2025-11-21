import React, { useState } from 'react';
import { api } from '../../services/api';

const InputField = ({ label, type, name, value, onChange, placeholder, required = true }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-reads-gold focus:border-reads-gold dark:bg-slate-700 dark:text-white transition-colors"
        />
    </div>
);

const SignupForm = ({ onLoginSuccess, onNavigate }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // This calls the API, which now has the alert() for errors
            await api.auth.signup(formData);
            
            // --- CRITICAL SUCCESS STATE ---
            onLoginSuccess(); 
            // -----------------------------
        } catch (error) {
            console.error('Signup error:', error);
            // The alert is triggered inside api.js. 
            // If the alert shows a 500 error, it means the DB connection failed.
        } finally {
            // This ensures the button state always resets
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
                label="Full Name" 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe" 
            />
            <InputField 
                label="Email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="you@example.com" 
            />
            <InputField 
                label="Password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
            />
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-reads-dark text-white font-semibold rounded-xl hover:bg-reads-gold hover:text-reads-dark transition-all shadow-md disabled:bg-gray-400"
            >
                {isLoading ? 'Creating...' : 'Sign Up'}
            </button>
            
            <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                <button 
                    type="button" 
                    onClick={() => onNavigate('login')}
                    className="text-reads-gold font-medium hover:underline"
                >
                    Log In
                </button>
            </div>
        </form>
    );
};

const LoginForm = ({ onLoginSuccess, onNavigate }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.auth.login(formData.email, formData.password);
            onLoginSuccess();
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
                label="Email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="you@example.com" 
            />
            <InputField 
                label="Password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
            />
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-reads-dark text-white font-semibold rounded-xl hover:bg-reads-gold hover:text-reads-dark transition-all shadow-md disabled:bg-gray-400"
            >
                {isLoading ? 'Logging In...' : 'Log In'}
            </button>
            
            <div className="text-center text-sm">
                <button 
                    type="button" 
                    onClick={() => onNavigate('forgot-password')}
                    className="text-gray-600 dark:text-gray-400 font-medium hover:underline"
                >
                    Forgot Password?
                </button>
            </div>
            <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                <button 
                    type="button" 
                    onClick={() => onNavigate('signup')}
                    className="text-reads-gold font-medium hover:underline"
                >
                    Sign Up
                </button>
            </div>
        </form>
    );
};

const ForgotPasswordForm = ({ onNavigate }) => (
    <div className="space-y-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
            A password reset link will be sent to your email. (Feature not implemented in backend MVP)
        </p>
        <InputField 
            label="Email" 
            type="email" 
            name="email" 
            placeholder="you@example.com" 
            required={false}
        />
        <button
            type="button"
            className="w-full py-3 px-4 bg-reads-dark text-white font-semibold rounded-xl transition-all shadow-md"
            onClick={() => alert("Password reset is not yet supported in the backend MVP.")}
        >
            Send Reset Link
        </button>
        <div className="text-center text-sm">
            <button 
                type="button" 
                onClick={() => onNavigate('login')}
                className="text-reads-gold font-medium hover:underline"
            >
                Back to Login
            </button>
        </div>
    </div>
);


export default function AuthModule({ view, onLoginSuccess, onNavigate, logoUrl }) {
    
    let content;
    let title;

    switch (view) {
        case 'signup':
            content = <SignupForm onLoginSuccess={onLoginSuccess} onNavigate={onNavigate} />;
            title = 'Create Your Account';
            break;
        case 'forgot-password':
            content = <ForgotPasswordForm onNavigate={onNavigate} />;
            title = 'Forgot Password';
            break;
        case 'login':
        default:
            content = <LoginForm onLoginSuccess={onLoginSuccess} onNavigate={onNavigate} />;
            title = 'Welcome Back';
            break;
    }

    return (
        <div className="max-w-md mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <img src={logoUrl} alt="Reads Logo" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg" />
                <h2 className="text-3xl font-extrabold text-reads-dark dark:text-white">{title}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sign in to start learning and earning $READS tokens.
                </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
                {content}
            </div>
        </div>
    );
}

