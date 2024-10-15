import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import { IoMdSearch } from 'react-icons/io';
import { AiOutlineUser } from "react-icons/ai";

const Navbar = () => {
  const buttonNames = ['Meals', 'Dinners', 'Ingredients', 'Cuisines', 'Kitchen Tips', 'Features'];
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleMouseLeave = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.relatedTarget) &&
      profileButtonRef.current &&
      !profileButtonRef.current.contains(event.relatedTarget)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseLeave);
    return () => {
      document.removeEventListener('mousedown', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed w-full z-50">
      <div className="bg-primary/100">
        <div className="container mx-auto flex justify-between items-center">
          {/* Content for Navbar */}
        </div>
      </div>

      <div className="bg-gray-200 shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <div className="flex">
            <Link to="/">
              <img src={Logo} alt="Logo" className="w-32" />
            </Link>
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
                  <Link to={`/${name.toLowerCase()}`} className="bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-400 hover:text-white transition-all">
                    {name}
                  </Link>
                  {index < buttonNames.length - 1 && <div className="border-l border-gray-400 h-8 mx-2" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Profile Button with Dropdown */}
          <div className="relative flex-shrink-0">
            <button
              ref={profileButtonRef}
              onClick={toggleDropdown}
              className="border-4 border-gray-300 bg-gray-300 rounded-full p-3 hover:bg-gray-400 hover:border-gray-400 transition-all"
            >
              <AiOutlineUser className="w-5 h-5 text-gray-700" />
            </button>
            {/* Dropdown Menu */}
            <div
              ref={dropdownRef}
              className={`absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-20 transition-opacity duration-300 ${isDropdownOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setIsDropdownOpen(true)}
            >
              <ul className="py-1">
                <li>
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                </li>
                <li>
                  <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</Link>
                </li>
                <li>
                  <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
