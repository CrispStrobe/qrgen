import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

function Header({ darkMode, setDarkMode }) {
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-6`}>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              QR Tool
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generate, Scan, Share
            </p>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
