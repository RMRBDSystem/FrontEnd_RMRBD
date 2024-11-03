import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/LandingPage/Landing';
import HomePage from './components/Homepage/HomePage';
import Meals from './components/Pages/Meals';
import AccountManagement from './components/Admin/AccountManagement';
import Feedback from './components/Admin/Feedback';
import Dashboard from './components/Admin/Dashboard';
import Report from './components/Admin/Reports';
import IncomeManagement from './components/Admin/IncomeManagement';
import CategoryManagement from './components/Admin/CategoryManagement';
import ErrorBoundary from "./ErrorBoundary";

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/admin/account-management" element={<AccountManagement />} />
          <Route path="/admin/feedback&comments" element={<Feedback />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/reports" element={<Report />} />
          <Route path="/admin/income-management" element={<IncomeManagement />} />
          <Route path="/admin/category-management" element={<CategoryManagement />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
