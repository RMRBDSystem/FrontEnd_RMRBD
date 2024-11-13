import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '/images/LandingBackground.png';
import { RiStarFill } from "react-icons/ri";

const Landing = () => {
  const [boxWidth, setBoxWidth] = useState('0%');
  const [stars, setStars] = useState([false, false, false, false, false]);
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [bigTextVisible, setBigTextVisible] = useState(false);
  const navigate = useNavigate();

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
      { delay: stars.length * 300 + 100, action: () => setIsVisible(true) },
      { delay: stars.length * 300 + 500, action: () => setTextVisible(true) },
      { delay: stars.length * 300 + 700, action: () => setBigTextVisible(true) },
    ];

    textTimers.forEach(({ delay, action }) => {
      setTimeout(action, delay);
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="h-24 w-full flex items-center justify-between px-5 z-10">
      <img src="/images/Logo.png" alt="Logo" className="w-24 ml-16 h-auto object-contain"/>
        <button 
          className="bg-custom-orange text-black rounded-lg px-4 py-2 transition-all duration-300 transform hover:bg-black hover:scale-105 font-roboto group hover:text-white hover:shadow-lg hover:shadow-orange-500/50 animate-tada"
          onClick={() => navigate('/home')}
        >
          <span className="transition-all duration-100 group-hover:font-bold">
            Search Your Own List Today!
          </span>
        </button>
      </div>

      {/* Single Plain Box */}
      <div className={`absolute top-24 left-0 h-1/2 bg-gradient-to-b to-teal-500 from-indigo-900 z-0 opacity-75 transition-all duration-700`} 
        style={{ width: boxWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Stars and Customer Text */}
        <div className={`flex items-center space-x-3 text-white text-lg font-bold transition-transform duration-700 z-15 
          ${isVisible ? 'transform translate-y-[-50px]' : 'transform translate-y-0'}`}>
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

        {/* Michelin Text */}
        <div className={`text-center text-white text-4xl font-bold transition-opacity duration-700 ${bigTextVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-bold drop-shadow-lg">
            From a meal to a <br />
            <span className='drop-shadow-lg'>Michelin Plates Quality!</span> 
          </span>
          <div className={`mt-4 text-sm drop-shadow-md p-1 rounded-lg max-w-md transition-opacity duration-700 ${bigTextVisible ? 'opacity-100' : 'opacity-0'}`}>
            Our website purpose is to share new and good quality products of recipes, books, and 
            ebooks for people to see and purchase for improving their cooking quality or looking for more 
            unique flavors in contrasts!
          </div>
        </div>
      </div>

      <div className="flex-grow" />
      <footer className="bg-[#14213D] text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
          FPT University &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
