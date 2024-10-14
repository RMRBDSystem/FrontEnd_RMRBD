import React from 'react';
import Navbar from '../Navbar/Navbar.jsx'; // Đảm bảo đường dẫn chính xác
import BackgroundImage from '../../assets/Background.jpg'; // Hình nền (nếu có)

const HomePage = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center bg-gray-100 p-6">
        {/* Banner Area */}
        <div 
          className="w-full h-64 bg-cover bg-center mb-6" 
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
          <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
            <h1 className="text-white text-3xl font-bold">Welcome to RecipeCook</h1>
          </div>
        </div>

        {/* Article Section */}
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            16 Caramel-Apple Desserts to Indulge in This Fall
          </h2>
          <p className="text-gray-700 mb-6">
            Caramel and apple. A flavor pairing that dates back to the 1950s when caramel apples were invented by a Kraft Foods employee. Today, this flavor combination has gone well beyond apples on a stick and is associated with fall festivals and country hayrides.
          </p>

          <h3 className="text-xl font-semibold mb-3">Favorite Recipe</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-4">
                <img 
                  src={`https://via.placeholder.com/150`} 
                  alt="Recipe" 
                  className="w-full h-32 object-cover rounded-md mb-2" 
                />
                <h4 className="text-lg font-medium">The Secret to the Best Banana Cake Ever</h4>
                <button className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded">
                  ❤️ Add to Favorites
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-2 md:mb-0">
            <a href="#" className="hover:text-gray-400 transition">Home</a>
            <a href="#" className="hover:text-gray-400 transition">About</a>
            <a href="#" className="hover:text-gray-400 transition">Services</a>
            <a href="#" className="hover:text-gray-400 transition">Contact</a>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} FPT Education
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
