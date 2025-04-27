import React from 'react';

export default function Footer() {
  const currentYear = 2025; // Hardcoded to 2025 as requested
  
  return (
    <footer className="bg-white dark:bg-gray-900 py-4 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {currentYear} Outfit Recommender. All rights reserved to MOHAN MAHESH.
        </p>
      </div>
    </footer>
  );
} 