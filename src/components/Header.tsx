import React from 'react';
import { FaTshirt, FaMoon, FaSun } from 'react-icons/fa';

type HeaderProps = {
  toggleDarkMode?: () => void;
  isDarkMode?: boolean;
};

export default function Header({ toggleDarkMode, isDarkMode }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaTshirt className="text-indigo-600 dark:text-indigo-400 text-2xl" />
          <h1 className="font-bold text-xl text-gray-800 dark:text-white">Outfit Recommender</h1>
        </div>
        
        {toggleDarkMode && (
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        )}
      </div>
    </header>
  );
} 