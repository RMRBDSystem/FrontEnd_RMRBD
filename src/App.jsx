import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/LandingPage/Landing'; // Ensure this path is correct
import HomePage from './components/Homepage/HomePage';
import Meals from './components/Pages/Meals';
import CustomerList from './components/API Test/CustomerList';
import CRUDTemp from './CRUDTemp';
import EBookList from './components/API Test/EBookList'
//import CustomerCrud from './CustomerCrud';// //Remove if wanted to test CRUD//



const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/meals" element={<Meals />} />
      </Routes>
    </Router>
      {/* <EBookList/> */}
    </div>
  );
};

export default App;