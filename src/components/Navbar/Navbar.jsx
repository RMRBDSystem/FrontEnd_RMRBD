import React from 'react';
import Logo from '../../assets/Logo.png';
import { IoMdSearch } from 'react-icons/io';
import { AiOutlineUser } from "react-icons/ai";

const Navbar = () => {
  // Array of button names
  const buttonNames = ['Meals', 'Dinners', 'Ingredients', 'Cuisines', 'Kitchen Tips', 'Features'];

  return (
    <div> 
        {/* Upper Navbar */}
        <div className='bg-primary/100'>
             <div className='container flex justify-between items-center py-4'>
             </div>
        </div>
        <div className='bg-gray-200'>
            <div className='container flex justify-between items-center shadow-lg p-4 bg-gray-200 rounded-lg'>
                <div className='flex justify-start'>
                    <a href="#">
                        <img src={Logo} alt="Logo" className='w-32 uppercase' />
                    </a>
                </div>
                {/* Search bar & Button Container */}
                <div className='flex flex-col items-center w-full'>
                    <div className='relative group hidden sm:block mb-2'>
                        <input 
                            type="text" 
                            placeholder='Search your items'
                            className='w-[300px] sm:w-[400px] group-hover:w-[500px]
                            transition-all duration-300
                            rounded-full border border-white px-2 py-1 
                            focus:outline-none focus:border-1
                            focus:border-primary'
                            style={{
                                boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)' // Inner shadow
                            }}
                        />
                        <IoMdSearch className='absolute top-1/2 -translate-y-1/2 right-3 w-7 h-6 rounded-full border-2 
                            bg-orange-400 shadow-inner' 
                        />
                    </div>

                    {/* Button Container */}
                    <div className="flex items-center justify-center space-x-2">
                        {buttonNames.map((name, index) => (
                            <React.Fragment key={index}>
                                <button
                                    className="bg-gray-200 px-4 py-2 text-gray-700 
                                               hover:bg-gray-400 hover:text-white transition-all"
                                >
                                    {name}
                                </button>
                                {/* Add a vertical line after each button except the last one */}
                                {index < buttonNames.length - 1 && (
                                    <div className="border-l border-gray-400 h-8 mx-2" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                {/* Profile Button */}
                <div className="ml-2"> {/* Adjust the margin here */}
                    <button className="border-4 border-gray-300 bg-gray-300 rounded-full p-3 flex items-center 
                                    justify-center hover:bg-gray-400 hover:border-gray-400 transition-all">
                        <span className='text-gray-700 relative z-10 hover:text-orange-400 transition-colors'>
                            <AiOutlineUser className="w-5 h-5 text-gray-700" />
                        </span> 
                    </button>
                </div>
            </div>
        </div>
        {/* Lower Navbar */}
        <div className="flex flex-col min-h-screen bg-navbar-bg bg-cover bg-center">
            <main className="flex-grow">
            </main>
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
    </div>
  );
}

export default Navbar;