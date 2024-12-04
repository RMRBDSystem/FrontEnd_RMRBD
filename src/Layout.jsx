import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Breadcrumb from './components/Breadcrumb/Breadcrumb';
import heroVideo from '/images/hero-video.mp4';
function Layout() {
  return (
    <>
      <Navbar />
      <Breadcrumb />
      <main className='min-h-screen'>
        <Outlet/>
      </main>
      <Footer />
    </>
  );
}

export default Layout;
