import React from 'react';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
        <p className="mt-4 text-lg">Something went wrong. Please try again later.</p>
        <p className="mt-2 text-sm">If the problem persists, contact support.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
