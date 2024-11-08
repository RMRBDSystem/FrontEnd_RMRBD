import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Sẽ hiển thị các trang con tại đây */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
