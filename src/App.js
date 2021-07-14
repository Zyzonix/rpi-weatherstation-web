import WebCore from './WebCore';
import React, { useEffect } from 'react';
import './WebCore.css';

// core function
function App() {
  
  useEffect (() => {
    document.title = "rpi-weatherstation-web";
  }, []);
  
  return (
    <WebCore />
  );
}

export default App;

