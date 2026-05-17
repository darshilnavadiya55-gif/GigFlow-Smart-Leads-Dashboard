import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by context
    }
  };

  const dark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden theme-transition ${
      dark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Decorative background blobs */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${
        dark ? 'bg-blue-600/20' : 'bg-blue-400/20'
      }`}></div>
      <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${
        dark ? 'bg-purple-600/20' : 'bg-purple-400/20'
      }`}></div>

      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 z-20 ${
          dark
            ? 'bg-slate-800 border-slate-600 hover:border-slate-500 text-yellow-400'
            : 'bg-white border-gray-200 hover:border-gray-300 text-slate-700 shadow-sm'
        }`}
        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {dark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        )}
      </button>

      <div className={`rounded-2xl p-10 w-full max-w-md relative z-10 transition-all duration-500 theme-transition ${
        dark
          ? 'glass-card-dark hover:shadow-blue-900/20 hover:shadow-2xl'
          : 'glass-card-light hover:shadow-lg'
      }`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h2 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h2>
          <p className={`mt-2 font-light ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Sign in to your Smart Leads dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start text-sm">
            <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-colors ${
                dark ? 'bg-slate-800/50 text-white' : 'bg-gray-50 text-gray-900'
              } ${validationErrors.email
                ? 'border-red-500/50 focus:ring-red-500'
                : dark ? 'border-slate-700/50' : 'border-gray-200'
              }`}
              placeholder="name@company.com"
            />
            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1.5">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                Password
              </label>
              <a href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-colors ${
                dark ? 'bg-slate-800/50 text-white' : 'bg-gray-50 text-gray-900'
              } ${validationErrors.password
                ? 'border-red-500/50 focus:ring-red-500'
                : dark ? 'border-slate-700/50' : 'border-gray-200'
              }`}
              placeholder="••••••••"
            />
            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1.5">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:shadow-none flex justify-center items-center mt-2"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className={`text-center mt-8 text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 font-medium hover:text-blue-400 transition-colors">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
