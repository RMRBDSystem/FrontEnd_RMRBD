import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/LandingPage/Landing';
import HomePage from './components/Homepage/HomePage';
import Meals from './components/Pages/Meals';
import FAQ from './components/Pages/FAQ';
import AccountManagement from './components/Admin/AccountManagement';
import Feedback from './components/Admin/Feedback';
import Dashboard from './components/Admin/Dashboard';
import Report from './components/Admin/Reports';
import IncomeManagement from './components/Admin/IncomeManagement';
import CategoryManagement from './components/Admin/CategoryManagement';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoadingPage from './components/Loader/LoadingPage';
import './components/Style/Global.scss';

function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/admin/account-management" element={<AccountManagement />} />
        <Route path="/admin/feedback&comments" element={<Feedback />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/reports" element={<Report />} />
        <Route path="/admin/income-management" element={<IncomeManagement />} />
        <Route path="/admin/category-management" element={<CategoryManagement />} />
      </Routes>
      <Footer />
    </>
  );
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/*" element={<Layout />} /> {/* Catch all paths under Layout */}
          <Route path="*" element={<Error />} /> {/* Catch-all for undefined routes */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
