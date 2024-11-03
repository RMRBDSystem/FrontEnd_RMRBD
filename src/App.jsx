import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/LandingPage/Landing'; // Ensure this path is correct
import HomePage from './components/Homepage/HomePage';
import Meals from './components/Pages/Meals';
import CustomerList from './components/API Test/CustomerList';



const App = () => {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Landing />} />
    //     <Route path="/home" element={<HomePage />} />
    //     <Route path="/meals" element={<Meals />} />
    //   </Routes>
    // </Router>
    <div>
      <CustomerList/>
    </div>
  );
};

export default App;