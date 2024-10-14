import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import CustomerList from './components/API Test/CustomerList';
import './index.css';


const App = () => {
  return (
 <div>
    <div className="container mx-auto">
    <CustomerList />
  </div>
  </div>
  );
};

export default App;