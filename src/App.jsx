import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import './index.css';


const App = () => {
  return (
 <div>
  <div className="container mx-auto">
  <Navbar/>
  </div>
  </div>
  );
};

export default App;