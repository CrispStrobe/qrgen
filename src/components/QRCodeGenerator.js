import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('https://www.example.com');
  const [size, setSize] = useState(300);
  const [foregroundColor, setForegroundColor] = useState('#0E2136');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [logoSize, setLogoSize] = useState(60);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('H');
  const [qrImage, setQrImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const fileInputRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [defaultLogoLoaded, setDefaultLogoLoaded] = useState(false);
  const canvasRef = useRef(null);

  // Load default logo on component mount
  useEffect(() => {
    // Check if we already tried to load the default logo
    if (!logo && !defaultLogoLoaded) {
      setDefaultLogoLoaded(true);
      
      // Try to load the default logo (akademie.png)
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          setLogo(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => {
          console.error('Error loading default logo:', err);
        };
        // Set the source to the akademie.png file in the public folder
        img.src = process.env.PUBLIC_URL + '/akademie.png';
      } catch (err) {
        console.error('Error setting up default logo:', err);
      }
    }
  }, [logo, defaultLogoLoaded]);

  // Function to generate QR code with QRCode library
  const generateQRCode = async () => {
    setIsLoading(true);
    setIsGenerated(false);
    
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      
      // Generate QR code using qrcode library
      await QRCode.toCanvas(canvas, url, {
        width: size,
        margin: 1,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        errorCorrectionLevel: errorCorrectionLevel
      });
      
      const ctx = canvas.getContext('2d');
      
      // Function to finalize QR code with or without logo
      const finalizeQRCode = () => {
        const dataUrl = canvas.toDataURL('image/png');
        setQrImage(dataUrl);
        setIsLoading(false);
        setIsGenerated(true);
      };
      
      // Add logo if present
      if (logo) {
        const logoImg = new Image();
        logoImg.onload = () => {
          // Calculate logo position (center)
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;
          
          // Create white background for logo
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
          
          // Draw logo
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          
          finalizeQRCode();
        };
        logoImg.onerror = () => {
          console.error('Fehler beim Laden des Bildes');
          finalizeQRCode(); // Still generate the QR code even if logo fails
        };
        logoImg.src = logo;
      } else {
        finalizeQRCode();
      }
    } catch (error) {
      console.error('Fehler beim Erzeugen des QR Codes:', error);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrImage) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = 'qrcode.png';
    
    // This is important for the download to work
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Trigger click and remove
    setTimeout(() => {
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    }, 100);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">QR Code Generator</h1>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Internetadresse oder Text:</label>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Größe (Pixel):</label>
            <input 
              type="range" 
              min="100" 
              max="500" 
              value={size} 
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
            <span>{size}px</span>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Vordergrund-Farbe:</label>
            <div className="flex items-center space-x-2">
              <input 
                type="color" 
                value={foregroundColor} 
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-10 h-10"
              />
              <input 
                type="text" 
                value={foregroundColor} 
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Hintergrund-Farbe:</label>
            <div className="flex items-center space-x-2">
              <input 
                type="color" 
                value={backgroundColor} 
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10"
              />
              <input 
                type="text" 
                value={backgroundColor} 
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Korrekturniveau:</label>
            <select 
              value={errorCorrectionLevel} 
              onChange={(e) => setErrorCorrectionLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="L">Niedrig (7%)</option>
              <option value="M">Mittel (15%)</option>
              <option value="Q">Viertel (25%)</option>
              <option value="H">Hoch (30%)</option>
            </select>
            <p className="text-xs text-gray-500">Höhere Werte ermöglichen größere Grafikgrößen</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Logo Größe (Pixel):</label>
            <input 
              type="range" 
              min="20" 
              max={size / 3}
              value={logoSize} 
              onChange={(e) => setLogoSize(parseInt(e.target.value))}
              className="w-full"
            />
            <span>{logoSize}px</span>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Logo hochladen:</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button 
              onClick={triggerFileInput}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Upload Image
            </button>
            {logo && (
              <div className="flex items-center mt-2">
                <img 
                  src={logo} 
                  alt="Logo preview" 
                  className="w-8 h-8 mr-2 object-contain"
                />
                <button
                  onClick={() => setLogo(null)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => {
                // Reset state before generating a new QR code
                setQrImage('');
                setIsGenerated(false);
                setTimeout(generateQRCode, 10);
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate QR Code'}
            </button>
            
            <button 
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={!isGenerated}
            >
              Download QR Code
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
              <p>Generating...</p>
            </div>
          ) : isGenerated && qrImage ? (
            <div className="flex flex-col items-center">
              <img 
                src={qrImage} 
                alt="QR Code" 
                style={{ width: `${size}px`, height: `${size}px` }}
              />
              <p className="mt-4 text-sm text-gray-500">
                Scan to test
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
              <p className="text-gray-500">Klicke "Erzeuge QR Code" zum aktualisieren.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default QRCodeGenerator;