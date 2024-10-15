import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/LandingPage/Landing'; // Ensure this path is correct
import HomePage from './components/Homepage/HomePage';
import Meals from './components/Pages/Meals';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/meals" element={<Meals />} />
      </Routes>
    </Router>
  );
};

export default App;