import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { FiDownload, FiCopy, FiShare2, FiImage, FiCheck, FiX } from 'react-icons/fi';

function QRGenerator({ addToHistory, darkMode }) {
  const [content, setContent] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#0E2136');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [errorLevel, setErrorLevel] = useState('H');
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(60);
  const [colorPickerActive, setColorPickerActive] = useState(false);
  const [pickedColor, setPickedColor] = useState(null);
  const [logoFileName, setLogoFileName] = useState('');
  const fileInputRef = useRef(null);
  const logoCanvasRef = useRef(null);

  const generateQR = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      
      await QRCode.toCanvas(canvas, content, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });
      
      const ctx = canvas.getContext('2d');
      
      if (logo) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = () => {
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            
            // White background for logo
            ctx.fillStyle = bgColor;
            ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
            
            // Draw logo
            ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
            resolve();
          };
          img.onerror = reject;
          img.src = logo;
        });
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      setQrImage(dataUrl);
      
      // Add to history
      addToHistory({
        type: 'generate',
        content: content,
        colors: { fg: fgColor, bg: bgColor },
        hasLogo: !!logo,
      });
    } catch (err) {
      console.error('Error generating QR:', err);
    }
    setLoading(false);
  };

  const downloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrImage;
    link.click();
  };

  const copyQR = async () => {
    if (!qrImage) return;
    try {
      const response = await fetch(qrImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shareQR = async () => {
    if (!qrImage) return;
    try {
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'QR Code',
          files: [file],
        });
      } else {
        copyQR();
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target.result);
      setColorPickerActive(false);
    };
    reader.readAsDataURL(file);
  };

  const pickColorFromLogo = (e) => {
    if (!logo || !logoCanvasRef.current) return;
    
    const canvas = logoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get click position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale to actual image size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const imgX = x * scaleX;
    const imgY = y * scaleY;
    
    // Get pixel data
    const pixel = ctx.getImageData(imgX, imgY, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    
    // Convert to hex
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    
    setPickedColor(hex);
    setFgColor(hex);
    setColorPickerActive(false);
  };

  useEffect(() => {
    if (logo && logoCanvasRef.current) {
      const canvas = logoCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = logo;
    }
  }, [logo]);

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <h2 className="text-xl font-bold mb-4">Generate QR Code</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-4">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Content (URL or Text)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              rows={3}
              placeholder="Enter URL or text"
            />
          </div>
          
          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Size: {size}px
            </label>
            <input
              type="range"
              min="200"
              max="600"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Foreground</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className={`flex-1 px-2 py-1 rounded border text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className={`flex-1 px-2 py-1 rounded border text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>
          
          {/* Error Correction */}
          <div>
            <label className="block text-sm font-medium mb-1">Error Correction</label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
          
          {/* Logo Upload */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Logo/Brand Image</label>
              <button
                onClick={() => setShowLogoUpload(!showLogoUpload)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showLogoUpload ? 'Hide' : 'Add Logo'}
              </button>
            </div>
            
            {showLogoUpload && (
              <div className="space-y-3">
                {/* File Picker */}
                <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                }`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer"
                  >
                    <FiImage size={32} className="mx-auto mb-2 opacity-50" />
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {logoFileName || 'Click to select image'}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      PNG, JPG, SVG supported
                    </p>
                  </label>
                </div>
                
                {/* Logo Preview with Color Picker */}
                {logo && (
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <canvas
                          ref={logoCanvasRef}
                          src={logo}
                          alt="Logo preview"
                          className={`w-24 h-24 object-contain rounded border ${
                            colorPickerActive ? 'cursor-crosshair border-blue-500' : darkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}
                          onClick={colorPickerActive ? pickColorFromLogo : undefined}
                        />
                        {colorPickerActive && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded pointer-events-none animate-pulse" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate mb-2">{logoFileName}</p>
                        
                        {/* Color Picker Button */}
                        <button
                          onClick={() => setColorPickerActive(!colorPickerActive)}
                          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded text-sm transition-colors ${
                            colorPickerActive
                              ? 'bg-blue-600 text-white'
                              : darkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                        >
                          <span className="inline-block w-4 h-4 rounded-full border border-white shadow-sm" 
                            style={{ backgroundColor: pickedColor || fgColor }} 
                          />
                          {colorPickerActive ? 'Click on logo to pick color' : 'Extract color from logo'}
                        </button>
                        
                        {/* Remove Logo */}
                        <button
                          onClick={() => {
                            removeLogo();
                            setLogoFileName('');
                            setColorPickerActive(false);
                          }}
                          className="w-full mt-2 py-1 px-3 text-sm text-red-600 hover:text-red-700"
                        >
                          Remove Logo
                        </button>
                      </div>
                    </div>
                    
                    {/* Logo Size Slider */}
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <label className="block text-xs mb-1">Logo size: {logoSize}px</label>
                      <input
                        type="range"
                        min="20"
                        max={size / 3}
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Generate Button */}
          <button
            onClick={generateQR}
            disabled={loading || !content.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              loading || !content.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>
        
        {/* Preview */}
        <div className="flex flex-col items-center justify-center p-4">
          {qrImage ? (
            <>
              <img 
                src={qrImage} 
                alt="Generated QR Code" 
                className="max-w-full rounded-lg shadow-md"
                style={{ maxHeight: '400px' }}
              />
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <FiDownload />
                  Download
                </button>
                
                <button
                  onClick={copyQR}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                    copied
                      ? 'bg-green-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                
                <button
                  onClick={shareQR}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <FiShare2 />
                  Share
                </button>
              </div>
            </>
          ) : (
            <div className={`w-full h-64 flex items-center justify-center rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                QR code will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;
