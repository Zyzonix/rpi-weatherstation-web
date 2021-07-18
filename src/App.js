/*
#
# written by @author ZyzonixDev
# published by ZyzonixDevelopments 
# -
# date      | 25/06/2021
# -
# file      | src/App.js
# project   | rpi-weatherstation-web
# project-v | 1.0.0 (beta)
# 
# This file was created by React
#
*/
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

