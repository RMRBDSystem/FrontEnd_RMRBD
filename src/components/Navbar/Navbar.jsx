import React, { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
import { IoMdSearch } from 'react-icons/io';
import { AiOutlineUser } from "react-icons/ai";

const Navbar = () => {
  const buttonNames = ['Meals', 'Dinners', 'Ingredients', 'Cuisines', 'Kitchen Tips', 'Features'];
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  let lastScrollTop = 0;

  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed w-full z-50 transition-transform duration-300 ${isScrollingDown ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="bg-primary/100">
        <div className="container mx-auto flex justify-between items-center py-4">
          {/* Upper Navbar content */}
        </div>
      </div>

      <div className="bg-gray-200 shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex">
            <a href="#">
              <img src={Logo} alt="Logo" className="w-32" />
            </a>
          </div>

          {/* Search bar & Button Container */}
          <div className="flex flex-col items-center w-full">
            <div className="relative group hidden sm:block mb-2">
              <input
                type="text"
                placeholder="Search your items"
                className="w-[300px] sm:w-[400px] group-hover:w-[500px] transition-all duration-300 rounded-full border border-white px-2 py-1 focus:outline-none focus:border-primary"
              />
              <IoMdSearch className="absolute top-1/2 -translate-y-1/2 right-3 w-7 h-6 rounded-full border-2 bg-orange-400" />
            </div>

            {/* Button Container */}
            <div className="flex space-x-2">
              {buttonNames.map((name, index) => (
                <React.Fragment key={index}>
                  <button className="bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-400 hover:text-white transition-all">
                    {name}
                  </button>
                  {index < buttonNames.length - 1 && <div className="border-l border-gray-400 h-8 mx-2" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Profile Button */}
          <div className="ml-2">
            <button className="border-4 border-gray-300 bg-gray-300 rounded-full p-3 hover:bg-gray-400 hover:border-gray-400 transition-all">
              <AiOutlineUser className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
