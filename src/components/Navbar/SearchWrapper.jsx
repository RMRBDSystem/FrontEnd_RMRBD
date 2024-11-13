import React, { useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';

const SearchWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Search Button */}
      <div
        className="search-btn ml-[80px] cursor-pointer duration-500 hover:text-custom-orange text-xl py-2 px-4"
        onClick={toggleSearch}
      >
        <FaSearch />
      </div>

      {/* Search Wrapper */}
      <div
        className={`fixed left-0 w-full h-[80px] z-50 bg-[#fca311] transition-all duration-700 ${
          isOpen ? 'top-0' : '-top-20'
        }`}
      >
        {/* Close Button */}
        <div
          className="close-btn absolute right-0 top-0 w-[70px] h-full bg-black text-white text-center flex items-center justify-center cursor-pointer"
          onClick={toggleSearch}
        >
          <FaTimes />
        </div>

        <div className="container mx-auto">
          <div className="flex justify-center">
            <form className="relative w-full max-w-[700px]">
              <input
                type="search"
                name="search"
                placeholder="Type any keywords..."
                className="w-[10%] md:w-[80%] h-[10px] border-2 border-white text-custom-orange text-[24px] italic p-4 mt-4 mb-4"
              />
              <button
                type="submit"
                className="absolute right-[10%] md:right-[20%] top-[15px] w-[60px] h-[70px] flex items-center justify-center bg-transparent border-none cursor-pointer text-black"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWrapper;