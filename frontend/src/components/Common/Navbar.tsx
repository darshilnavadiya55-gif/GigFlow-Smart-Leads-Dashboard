import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import AppLogo from './AppLogo';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md theme-transition ${
      theme === 'dark'
        ? 'bg-slate-900/80 border-b border-slate-700/50'
        : 'bg-white/80 border-b border-gray-200/60 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-3">
          <AppLogo size="sm" className="shadow-lg shadow-blue-500/20" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Smart Leads
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* User badge */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border theme-transition ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-gray-100/80 border-gray-200/80'
          }`}>
            <div className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'}`}></div>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
              {user?.email} <span className={theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}>({user?.role})</span>
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-600 hover:border-slate-500 text-yellow-400 hover:bg-slate-700'
                : 'bg-gray-100 border-gray-200 hover:border-gray-300 text-slate-700 hover:bg-gray-200'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
