import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/LandingPage/Landing'; // Ensure this path is correct
import HomePage from './components/Homepage/HomePage';
import Meals from './components/Pages/Meals';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoadingPage from './components/Loader/LoadingPage';
import './components/Style/Global.scss'

function Layout(){
  return (
    <>
      <Navbar/>
        <HomePage/>
      <Footer/>
    </>
  )
}
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  if (isLoading) {
    return <LoadingPage/>;
  }
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/home" element={<Layout/>} />
        <Route path="/meals" element={<Meals/>} />
      </Routes>
    </Router>
      {/* <EBookList/>  */}
      {/* <RecipeList/> */}
      {/* <Navbar/> */}
    </div>
  );
};

export default App;