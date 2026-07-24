import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { FiDownload, FiCopy, FiShare2, FiImage, FiCheck, FiX, FiDroplet, FiStar, FiZap, FiCheckCircle, FiAlertCircle, FiActivity } from 'react-icons/fi';

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
  const [isDragging, setIsDragging] = useState(false);
  
  // AI Art Mode
  const [artMode, setArtMode] = useState(false);
  const [artStyle, setArtStyle] = useState('rounded');
  const [artVariant, setArtVariant] = useState(0);
  const [artVariants, setArtVariants] = useState([]);
  
  // Verification/Testing
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(null);
  const [decodedContent, setDecodedContent] = useState(null);
  const [verificationDetails, setVerificationDetails] = useState(null);
  
  const fileInputRef = useRef(null);
  const logoCanvasRef = useRef(null);
  const dropZoneRef = useRef(null);

  const artStyles = [
    { id: 'rounded', name: 'Rounded', desc: 'Smooth rounded corners' },
    { id: 'dots', name: 'Dots', desc: 'Circular modules' },
    { id: 'liquid', name: 'Liquid', desc: 'Fluid organic shapes' },
    { id: 'geometric', name: 'Geometric', desc: 'Diamond patterns' },
    { id: 'neon', name: 'Neon Glow', desc: 'Glowing cyberpunk style' },
    { id: 'minimal', name: 'Minimal', desc: 'Clean thin lines' },
    { id: 'graffiti', name: 'Graffiti', desc: 'Street art style' },
    { id: 'watercolor', name: 'Watercolor', desc: 'Soft painted effect' },
  ];

  // Drag and drop handlers
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragEnter = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    };

    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target.result);
      setColorPickerActive(false);
    };
    reader.readAsDataURL(file);
  };

  // Artistic QR module shapes
  const drawArtisticModule = (ctx, x, y, moduleSize, style, isDark) => {
    if (!isDark) return;
    
    ctx.fillStyle = fgColor;
    
    switch (style) {
      case 'rounded':
        const radius = moduleSize * 0.4;
        ctx.beginPath();
        ctx.roundRect(x, y, moduleSize, moduleSize, radius);
        ctx.fill();
        break;
        
      case 'dots':
        // Use filled circles with proper spacing for better detection
        const dotRadius = moduleSize / 2 * 0.85; // 85% of module for good spacing
        ctx.beginPath();
        ctx.arc(x + moduleSize / 2, y + moduleSize / 2, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'liquid':
        ctx.beginPath();
        const cx = x + moduleSize / 2;
        const cy = y + moduleSize / 2;
        const r = moduleSize / 2;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const px = cx + r * Math.cos(angle) * (0.8 + Math.random() * 0.2);
          const py = cy + r * Math.sin(angle) * (0.8 + Math.random() * 0.2);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'geometric':
        ctx.beginPath();
        ctx.moveTo(x + moduleSize / 2, y);
        ctx.lineTo(x + moduleSize, y + moduleSize / 2);
        ctx.lineTo(x + moduleSize / 2, y + moduleSize);
        ctx.lineTo(x, y + moduleSize / 2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'neon':
        // Glow effect - reduced blur for better edge detection
        ctx.shadowColor = fgColor;
        ctx.shadowBlur = moduleSize * 0.5; // Reduced from full size to 50%
        ctx.fillRect(x, y, moduleSize, moduleSize);
        ctx.shadowBlur = 0;
        break;
        
      case 'minimal':
        // Increased module size for reliable scanning
        const lineSize = moduleSize * 0.4; // Increased from 30% to 40%
        ctx.fillRect(x + (moduleSize - lineSize) / 2, y + (moduleSize - lineSize) / 2, lineSize, lineSize);
        break;
        
      case 'graffiti':
        // Reduced randomness to maintain QR alignment
        ctx.save();
        ctx.translate(x + moduleSize / 2, y + moduleSize / 2);
        ctx.rotate((Math.random() - 0.5) * 0.15); // Reduced from ±0.3 to ±0.15 radians
        ctx.scale(1 + Math.random() * 0.1, 1 + Math.random() * 0.1); // Reduced scale variance
        ctx.fillRect(-moduleSize / 2, -moduleSize / 2, moduleSize, moduleSize);
        ctx.restore();
        break;
        
      case 'watercolor':
        // Increased minimum opacity for better contrast
        ctx.globalAlpha = 0.8 + Math.random() * 0.2; // Raised from 0.7-1.0 to 0.8-1.0
        ctx.beginPath();
        ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2 * (0.85 + Math.random() * 0.15), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
        
      default:
        ctx.fillRect(x, y, moduleSize, moduleSize);
    }
  };

  // Generate artistic QR
  const generateArtisticQR = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    setArtVariants([]);
    
    // Enforce minimum size for artistic styles (400px minimum for reliable scanning)
    const effectiveSize = Math.max(size, 400);
    if (size < 400) {
      setSize(400);
    }
    
    try {
      // Generate base QR as image
      const baseQRUrl = await QRCode.toDataURL(content, {
        width: effectiveSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });
      
      // Load the base QR image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = baseQRUrl;
      });
      
      // Create canvas for artistic rendering
      const canvas = document.createElement('canvas');
      canvas.width = effectiveSize;
      canvas.height = effectiveSize;
      const ctx = canvas.getContext('2d');
      
      // Draw base QR to get module data
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, effectiveSize, effectiveSize);
      
      // Clear and draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, effectiveSize, effectiveSize);
      
      // Calculate module size (estimate from QR structure)
      const moduleSize = Math.max(3, Math.floor(effectiveSize / 45));
      
      // Scan and draw artistic modules
      for (let y = 0; y < effectiveSize; y += moduleSize) {
        for (let x = 0; x < effectiveSize; x += moduleSize) {
          const idx = (y * effectiveSize + x) * 4;
          const brightness = imageData.data[idx];
          const isDark = brightness < 128;
          
          if (isDark) {
            drawArtisticModule(ctx, x, y, moduleSize, artStyle, true);
          }
        }
      }
        
      // Add logo if present
      if (logo) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          logoImg.onload = () => {
            const logoX = (effectiveSize - logoSize) / 2;
            const logoY = (effectiveSize - logoSize) / 2;
            
            // White background for logo
            ctx.fillStyle = bgColor;
            ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
            
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            resolve();
          };
          logoImg.onerror = reject;
          logoImg.src = logo;
        });
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      setQrImage(dataUrl);
      setArtVariants([dataUrl]);
      
      // Reset verification on new generation
      setVerified(null);
      setDecodedContent(null);
      setVerificationDetails(null);
      
      // Add to history
      addToHistory({
        type: 'generate',
        content: content,
        colors: { fg: fgColor, bg: bgColor },
        hasLogo: !!logo,
        artStyle: artStyle,
      });
      
    } catch (err) {
      console.error('Error generating artistic QR:', err);
      alert('Failed to generate QR code. Please try again.');
    }
    
    setLoading(false);
  };

  // Generate standard QR
  const generateQR = async () => {
    if (artMode) {
      await generateArtisticQR();
      return;
    }
    
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
            
            ctx.fillStyle = bgColor;
            ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
            
            ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
            resolve();
          };
          img.onerror = reject;
          img.src = logo;
        });
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      setQrImage(dataUrl);
      
      // Reset verification on new generation
      setVerified(null);
      setDecodedContent(null);
      setVerificationDetails(null);
      
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

  // Verify QR code is scannable and decodes correctly
  const verifyQR = async () => {
    if (!qrImage) return;
    
    setVerifying(true);
    setVerified(null);
    setDecodedContent(null);
    setVerificationDetails(null);
    
    try {
      // Create image from data URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = qrImage;
      });
      
      // Draw to canvas for analysis
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Attempt to decode
      const startTime = performance.now();
      const decoded = jsQR(imageData.data, imageData.width, imageData.height);
      const decodeTime = performance.now() - startTime;
      
      if (decoded) {
        setDecodedContent(decoded.data);
        
        // Check if decoded content matches original
        const match = decoded.data === content;
        setVerified(match);
        
        setVerificationDetails({
          decodeTime: Math.round(decodeTime * 100) / 100,
          qrVersion: decoded.version,
          location: decoded.location,
          size: { width: imageData.width, height: imageData.height }
        });
        
        // Add to history
        addToHistory({
          type: 'verify',
          content: content,
          decodedContent: decoded.data,
          success: match,
          artStyle: artMode ? artStyle : 'standard'
        });
      } else {
        // Failed to decode
        setVerified(false);
        setDecodedContent(null);
        setVerificationDetails({
          decodeTime: Math.round(decodeTime * 100) / 100,
          error: 'No QR code detected',
          size: { width: imageData.width, height: imageData.height }
        });
        
        addToHistory({
          type: 'verify',
          content: content,
          decodedContent: null,
          success: false,
          artStyle: artMode ? artStyle : 'standard'
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setVerified(false);
      setVerificationDetails({
        error: err.message
      });
    }
    
    setVerifying(false);
  };

  // Run multiple verification tests with simulated distortions
  const runComprehensiveTest = async () => {
    if (!qrImage) return;
    
    setVerifying(true);
    
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = qrImage;
      });
      
      const tests = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Test 1: Standard decode
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded1 = jsQR(imageData1.data, imageData1.width, imageData1.height);
      tests.push({
        name: 'Standard',
        passed: decoded1?.data === content,
        content: decoded1?.data
      });
      
      // Test 2: Slight rotation simulation (5 degrees)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(5 * Math.PI / 180);
      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
      ctx.restore();
      const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded2 = jsQR(imageData2.data, imageData2.width, imageData2.height);
      tests.push({
        name: 'Rotated 5°',
        passed: decoded2?.data === content,
        content: decoded2?.data
      });
      
      // Test 3: Scale down (simulate distance)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8);
      const imageData3 = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded3 = jsQR(imageData3.data, imageData3.width, imageData3.height);
      tests.push({
        name: 'Scaled 80%',
        passed: decoded3?.data === content,
        content: decoded3?.data
      });
      
      // Count passed
      const passed = tests.filter(t => t.passed).length;
      setVerified(passed === tests.length);
      setDecodedContent(tests[0].content);
      setVerificationDetails({
        tests: tests,
        passed: passed,
        total: tests.length,
        successRate: Math.round((passed / tests.length) * 100)
      });
      
    } catch (err) {
      console.error('Test error:', err);
      setVerified(false);
    }
    
    setVerifying(false);
  };

  const downloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement('a');
    link.download = `qr-${artMode ? artStyle : 'code'}-${Date.now()}.png`;
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
    handleFile(file);
  };

  const pickColorFromLogo = (e) => {
    if (!logo || !logoCanvasRef.current) return;
    
    const canvas = logoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const imgX = x * scaleX;
    const imgY = y * scaleY;
    
    const pixel = ctx.getImageData(imgX, imgY, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    
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
    setLogoFileName('');
    setColorPickerActive(false);
    setPickedColor(null);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiZap className="text-yellow-500" />
          Generate QR Code
        </h2>
        
        {/* Art Mode Toggle */}
        <button
          onClick={() => setArtMode(!artMode)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            artMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiStar />
          {artMode ? 'Art Mode ON' : 'Art Mode'}
        </button>
      </div>
      
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
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              rows={3}
              placeholder="Enter URL or text"
            />
          </div>
          
          {/* Art Style Selector */}
          {artMode && (
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FiStar className="text-purple-500" />
                Art Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {artStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setArtStyle(style.id)}
                    className={`p-2 rounded-lg text-left transition-all ${
                      artStyle === style.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : darkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className={`text-xs ${artStyle === style.id ? 'text-purple-100' : 'text-gray-500'}`}>
                      {style.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
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
          {!artMode && (
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
          )}
          
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
              <option value="L">Low (7%) - Standard QR</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%) - Best for Art QR</option>
            </select>
          </div>
          
          {/* Logo Upload */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Logo/Brand Image</label>
              <button
                onClick={() => setShowLogoUpload(!showLogoUpload)}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                {showLogoUpload ? 'Hide' : 'Add Logo'}
              </button>
            </div>
            
            {showLogoUpload && (
              <div className="space-y-3">
                {/* Drag & Drop Zone */}
                <div 
                  ref={dropZoneRef}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? 'border-purple-500 bg-purple-50'
                      : darkMode 
                        ? 'border-gray-600 bg-gray-700'
                        : 'border-gray-300 bg-gray-50'
                  }`}
                >
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
                    <FiImage size={32} className={`mx-auto mb-2 ${isDragging ? 'text-purple-500' : 'opacity-50'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {isDragging ? 'Drop image here' : 'Drag & drop or click to select'}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      PNG, JPG, SVG • All platforms
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
                            colorPickerActive ? 'cursor-crosshair border-purple-500' : darkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}
                          onClick={colorPickerActive ? pickColorFromLogo : undefined}
                        />
                        {colorPickerActive && (
                          <div className="absolute inset-0 bg-purple-500 bg-opacity-20 rounded pointer-events-none animate-pulse" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate mb-2">{logoFileName}</p>
                        
                        <button
                          onClick={() => setColorPickerActive(!colorPickerActive)}
                          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded text-sm transition-colors ${
                            colorPickerActive
                              ? 'bg-purple-600 text-white'
                              : darkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                        >
                          <FiDroplet size={16} />
                          <span className="inline-block w-4 h-4 rounded-full border border-white shadow-sm" 
                            style={{ backgroundColor: pickedColor || fgColor }} 
                          />
                          {colorPickerActive ? 'Click logo to pick' : 'Extract color'}
                        </button>
                        
                        <button
                          onClick={removeLogo}
                          className="w-full mt-2 py-1 px-3 text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-1"
                        >
                          <FiX size={16} />
                          Remove Logo
                        </button>
                      </div>
                    </div>
                    
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
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
              loading || !content.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : artMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                {artMode ? 'Creating Art...' : 'Generating...'}
              </span>
            ) : artMode ? (
              '✨ Create Artistic QR'
            ) : (
              'Generate QR Code'
            )}
          </button>
        </div>
        
        {/* Preview */}
        <div className="flex flex-col items-center justify-center p-4">
          {/* Art Variants */}
          {artMode && artVariants.length > 0 && (
            <div className="mb-4 flex gap-2">
              {artVariants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQrImage(variant);
                    setArtVariant(idx);
                  }}
                  className={`p-1 rounded border-2 transition-all ${
                    artVariant === idx
                      ? 'border-purple-500 shadow-lg'
                      : darkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={variant}
                    alt={`Variant ${idx + 1}`}
                    className="w-16 h-16 object-contain rounded"
                  />
                </button>
              ))}
            </div>
          )}
          
          {qrImage ? (
            <>
              <img 
                src={qrImage} 
                alt="Generated QR Code" 
                className="max-w-full rounded-lg shadow-xl"
                style={{ maxHeight: '400px' }}
              />
              
              {artMode && (
                <div className="mt-2 text-xs text-center text-gray-500">
                  Style: {artStyles.find(s => s.id === artStyle)?.name}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <FiDownload />
                  Download
                </button>
                
                <button
                  onClick={verifyQR}
                  disabled={verifying}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                    verifying
                      ? 'bg-gray-400 cursor-not-allowed'
                      : verified === true
                        ? 'bg-green-600 text-white'
                        : verified === false
                          ? 'bg-red-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {verifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Testing...
                    </>
                  ) : verified !== null ? (
                    <>
                      {verified ? <FiCheckCircle /> : <FiAlertCircle />}
                      {verified ? 'Verified ✓' : 'Failed ✗'}
                    </>
                  ) : (
                    <>
                      <FiActivity />
                      Verify
                    </>
                  )}
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
              
              {/* Verification Status */}
              {verified !== null && (
                <div className={`mt-4 p-4 rounded-lg ${
                  verified
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {verified ? (
                      <FiCheckCircle className="text-green-600 mt-0.5" size={20} />
                    ) : (
                      <FiAlertCircle className="text-red-600 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-medium ${verified ? 'text-green-800' : 'text-red-800'}`}>
                        {verified ? 'QR Code Verified Successfully!' : 'QR Code Verification Failed'}
                      </h4>
                      
                      {decodedContent && (
                        <p className={`text-sm mt-1 break-all ${verified ? 'text-green-700' : 'text-red-700'}`}>
                          Decoded: {decodedContent}
                        </p>
                      )}
                      
                      {verificationDetails && (
                        <div className="text-xs mt-2 space-y-1">
                          {verificationDetails.decodeTime && (
                            <p className={verified ? 'text-green-600' : 'text-red-600'}>
                              Decode time: {verificationDetails.decodeTime}ms
                            </p>
                          )}
                          {verificationDetails.size && (
                            <p className="text-gray-600">
                              Image size: {verificationDetails.size.width}x{verificationDetails.size.height}px
                            </p>
                          )}
                          {verificationDetails.tests && (
                            <div className="mt-2">
                              <p className="font-medium">Test Results: {verificationDetails.passed}/{verificationDetails.total} passed ({verificationDetails.successRate}%)</p>
                              {verificationDetails.tests.map((test, idx) => (
                                <p key={idx} className={test.passed ? 'text-green-600' : 'text-red-600'}>
                                  {test.passed ? '✓' : '✗'} {test.name}: {test.content || 'Failed'}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!verified && !verificationDetails?.tests && (
                        <p className="text-xs text-red-600 mt-1">
                          The QR code could not be decoded. Try increasing the size or using a different style.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`w-full h-64 flex flex-col items-center justify-center rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <FiImage size={48} className="mb-2 opacity-30" />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {artMode ? 'Artistic QR will appear here' : 'QR code will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;
