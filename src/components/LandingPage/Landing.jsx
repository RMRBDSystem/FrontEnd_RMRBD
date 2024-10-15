import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import backgroundImage from '../../assets/Landing Background.png';
import logo from '../../assets/Logo.png';
import { RiStarFill } from "react-icons/ri";

const Landing = () => {
  const [boxWidth, setBoxWidth] = useState('0%');
  const [stars, setStars] = useState([false, false, false, false, false]);
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [bigTextVisible, setBigTextVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const timer = setTimeout(() => {
      setBoxWidth('50%');
    }, 100);
  
    stars.forEach((_, index) => {
      setTimeout(() => {
        setStars(prev => {
          const newStars = [...prev];
          newStars[index] = true;
          return newStars;
        });
      }, index * 300);
    });
  
    const textTimers = [
      { delay: stars.length * 300 + 100, action: () => setIsVisible(true) },     //Star//
      { delay: stars.length * 300 + 500, action: () => setTextVisible(true) },   //More than 100k text//
      { delay: stars.length * 300 + 700, action: () => setBigTextVisible(true) }, // From a meal text//
    ];
  
    textTimers.forEach(({ delay, action }) => {
      setTimeout(action, delay);
    });
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="bg-white h-24 w-full flex items-center justify-between px-5 shadow-md z-10">
        <img src={logo} alt="Logo" className="h-24" />
        <button 
          className="bg-orange-500 text-black rounded-lg px-4 py-2 transition-all duration-300 transform hover:bg-black hover:scale-105 font-roboto group hover:text-white hover:shadow-lg hover:shadow-orange-500/50"
          onClick={() => navigate('/home')} // Navigate to HomePage on click
        >
          <span className="transition-all duration-100 group-hover:font-bold">
            Search Your Own List Today!
          </span>
        </button>
      </div>

      {/* Plain Box */}
      <div className={`absolute top-24 left-0 h-1/2 bg-teal-600 z-0 opacity-75 transition-all duration-700`} 
        style={{ width: boxWidth }}>
        {/* Stars and Text */}
        <div className={`flex items-center pl-10 space-x-3 text-white text-lg font-bold h-full transition-transform duration-700 
          ${isVisible ? 'transform translate-y-[-140px]' : 'transform translate-y-0'}`}>
            {stars.map((isVisible, index) => (
              <div key={index} className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <RiStarFill color={index === 4 ? "black" : "gold"} size={30} />
              </div>
            ))}
            <span className={`transition-opacity duration-700 ${textVisible ? 'opacity-100' : 'opacity-0'}`} 
                style={{ color: 'white' }}>
              More than 100,000 satisfied customers!
            </span>
          </div>
      </div>

      {/* Big Text And Small Paragraph*/}
      <div className={`absolute top-48 left-20 text-black text-4xl font-bold z-10 transition-opacity duration-700 ${bigTextVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="font-bold drop-shadow-lg">
          From a meal to a <br />
          <span className='drop-shadow-lg'>Michelin Plates Quality!</span> 
        </span>
        <div className={`mt-4 text-sm drop-shadow-md p-1 rounded-lg max-w-md transition-opacity duration-700 ${bigTextVisible ? 'opacity-100' : 'opacity-0'}`}>
          Our website's purpose is to share new and good quality products of recipes, books, and ebooks for people to see and purchase for improving their cooking quality or looking for more unique flavors in contrasts!
        </div>
      </div>

      <div className="flex-grow" />
      {/* Footer Section */}
      <footer className="bg-[#14213D] text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} FPT Education.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;