import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, User, LogOut, Home, Trophy } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white dark:bg-indigo-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-indigo-600 dark:text-white font-extrabold text-2xl">C</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">
              CrosswordGen
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-white hover:text-yellow-300 font-medium transition-colors"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-white hover:text-yellow-300 font-medium transition-colors"
                >
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center space-x-1 text-white hover:text-yellow-300 font-medium transition-colors"
                >
                  <Trophy size={20} />
                  <span>Leaderboard</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors border border-white/30"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={22} className="text-yellow-300" /> : <Moon size={22} className="text-indigo-600" />}
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white font-semibold drop-shadow">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:text-red-300 font-medium transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-300 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-300 hover:bg-yellow-400 text-indigo-900 font-bold px-4 py-2 rounded-lg shadow transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;