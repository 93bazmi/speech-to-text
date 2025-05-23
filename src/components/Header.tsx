import React from 'react';
import { Headphones, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full py-6 bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-900 dark:to-purple-900 text-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Headphones className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              VoiceStream
            </h1>
            <p className="text-indigo-200 text-sm">
              Real-time Speech-to-Text Translation
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;