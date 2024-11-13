import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Breadcrumb from './components/Breadcrumb/Breadcrumb';

function Layout() {
  return (
    <>
      <Navbar />
          <Breadcrumb/>
      <main>
        <Outlet /> {/* Sẽ hiển thị các trang con tại đây */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
