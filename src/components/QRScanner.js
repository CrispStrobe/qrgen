import React, { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiCamera, FiStopCircle, FiCopy, FiShare2, FiExternalLink, FiCheckCircle } from 'react-icons/fi';

function QRScanner({ addToHistory, darkMode }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop();
      }
    };
  }, []);

  const startScanning = async () => {
    setError(null);
    setResult(null);
    
    try {
      html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setResult(decodedText);
          stopScanning();
          
          // Add to history
          const isUrl = /^https?:\/\//i.test(decodedText);
          addToHistory({
            type: 'scan',
            content: decodedText,
            isUrl,
          });
        },
        (errorMessage) => {
          // Ignore scan errors (no QR code found)
        }
      );
      
      setScanning(true);
    } catch (err) {
      setError(`Camera error: ${err.message}`);
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop();
      await html5QrCodeRef.current.clear();
    }
    setScanning(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code Result',
          text: result,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const openUrl = () => {
    if (/^https?:\/\//i.test(result)) {
      window.open(result, '_blank', 'noopener,noreferrer');
    }
  };

  const isUrl = result && /^https?:\/\//i.test(result);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
      
      {/* Scanner Area */}
      <div 
        id="qr-reader" 
        ref={scannerRef}
        className={`w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden ${
          scanning ? 'block' : 'hidden'
        }`}
      />
      
      {!scanning && !result && (
        <div className={`w-full max-w-md mx-auto h-64 flex items-center justify-center rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="text-center">
            <FiCamera size={48} className="mx-auto mb-3 opacity-50" />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Click "Start Scanning" to begin
            </p>
          </div>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border`}>
          <div className="flex items-start gap-2">
            <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-medium mb-1">QR Code Detected:</p>
              <p className={`break-all ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {result}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={copyToClipboard}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                copied
                  ? 'bg-green-600 text-white'
                  : darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {copied ? <FiCheckCircle /> : <FiCopy />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={shareResult}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <FiShare2 />
              Share
            </button>
            
            {isUrl && (
              <button
                onClick={openUrl}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <FiExternalLink />
                Open
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Control Button */}
      <div className="flex justify-center">
        {!scanning ? (
          <button
            onClick={startScanning}
            className="flex items-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <FiCamera />
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex items-center gap-2 py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <FiStopCircle />
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
}

export default QRScanner;
