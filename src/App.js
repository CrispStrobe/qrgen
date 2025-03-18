import React from 'react';
import './App.css';
import QRCodeGenerator from './components/QRCodeGenerator';

function App() {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold">QR Code Generator App</h1>
      </header>
      <main className="p-4">
        <QRCodeGenerator />
      </main>
      <footer className="bg-gray-100 p-4 mt-8 text-sm text-gray-600">
        <p>Created with React and qrcode.js</p>
      </footer>
    </div>
  );
}

export default App;