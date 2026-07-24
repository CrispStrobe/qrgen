import React, { useState } from 'react';
import { FiTrash2, FiStar, FiCopy, FiShare2, FiExternalLink, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { IoQrCodeOutline, IoScanOutline } from 'react-icons/io5';

function History({ history, removeFromHistory, clearHistory, toggleFavorite, darkMode }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shareItem = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code Result',
          text: item.content,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      copyToClipboard(item.content);
    }
  };

  const openUrl = (url) => {
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return item.favorite;
    if (filter === 'generated') return item.type === 'generate';
    if (filter === 'scanned') return item.type === 'scan';
    return true;
  });

  const isUrl = (text) => /^https?:\/\//i.test(text);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">History</h2>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <FiTrash2 size={14} />
            Clear All
          </button>
        )}
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { value: 'all', label: 'All', count: history.length },
          { value: 'favorites', label: 'Favorites', count: history.filter(i => i.favorite).length },
          { value: 'generated', label: 'Generated', count: history.filter(i => i.type === 'generate').length },
          { value: 'scanned', label: 'Scanned', count: history.filter(i => i.type === 'scan').length },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === tab.value
                ? 'bg-blue-600 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <FiFilter size={48} className="mx-auto mb-3 opacity-50" />
          <p>No items in history</p>
          <p className="text-sm mt-2">
            {filter !== 'all' ? 'Try changing the filter' : 'Generate or scan QR codes to see them here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="flex items-start gap-3">
                {/* Type Icon */}
                <div className={`p-2 rounded-lg ${
                  item.type === 'generate' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.type === 'generate' ? <IoQrCodeOutline size={20} /> : <IoScanOutline size={20} />}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-medium truncate ${
                      expandedId === item.id ? 'whitespace-normal' : ''
                    }`}>
                      {item.content}
                    </p>
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className={`flex-shrink-0 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {expandedId === item.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </button>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>{formatDate(item.timestamp)}</span>
                    {item.isUrl && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        URL
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 ml-11">
                <button
                  onClick={() => copyToClipboard(item.content)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                    darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <FiCopy size={14} />
                  Copy
                </button>
                
                <button
                  onClick={() => shareItem(item)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                    darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <FiShare2 size={14} />
                  Share
                </button>
                
                {isUrl(item.content) && (
                  <button
                    onClick={() => openUrl(item.content)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <FiExternalLink size={14} />
                    Open
                  </button>
                )}
                
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                    item.favorite
                      ? 'bg-yellow-500 text-white'
                      : darkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <FiStar size={14} />
                </button>
                
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded text-sm bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
