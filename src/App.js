import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';
import History from './components/History';
import Header from './components/Header';
import './App.css';

const STORAGE_KEY = 'qr-history';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('dark-mode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Save history to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    // Save dark mode preference
    localStorage.setItem('dark-mode', JSON.stringify(darkMode));
    // Apply to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addToHistory = (item) => {
    const newHistory = [
      { id: uuidv4(), ...item, timestamp: Date.now() },
      ...history,
    ].slice(0, 50); // Keep last 50 items
    setHistory(newHistory);
  };

  const removeFromHistory = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleFavorite = (id) => {
    setHistory(history.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'generate'
                ? 'bg-blue-600 text-white shadow-lg'
                : darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'scan'
                ? 'bg-blue-600 text-white shadow-lg'
                : darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Scan
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-lg'
                : darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            History ({history.length})
          </button>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'generate' && (
            <QRGenerator addToHistory={addToHistory} darkMode={darkMode} />
          )}
          {activeTab === 'scan' && (
            <QRScanner addToHistory={addToHistory} darkMode={darkMode} />
          )}
          {activeTab === 'history' && (
            <History
              history={history}
              removeFromHistory={removeFromHistory}
              clearHistory={clearHistory}
              toggleFavorite={toggleFavorite}
              darkMode={darkMode}
            />
          )}
        </div>
      </main>

      <footer className={`py-4 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
        <p>QR Code Generator & Scanner - PWA Ready</p>
      </footer>
    </div>
  );
}

export default App;
