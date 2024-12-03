import React from 'react';
import '../../assets/styles/Components/LoadingPage.scss';

const LoadingPage = () => {
  return (
    <div id="preloader">
      <img src="/images/loader.gif" alt="Loading..." />
      <div className="circle-preloader"></div>
    </div>
  );
};

export default LoadingPage; 