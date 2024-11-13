import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import BackgroundImage from '/images/Background.jpg';
import Logo from '../../../assets/Logo.png';
import { IoMdSearch } from 'react-icons/io';
import { AiOutlineUser } from "react-icons/ai";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error logged from ErrorBoundary:', error, info);
    this.setState({ errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          {this.state.errorInfo && <details>{this.state.errorInfo.componentStack}</details>}
        </div>
      );
    }
    return this.props.children;
  }
}

// AddBook Component
const AddBook = () => {
  const [bookName, setBookName] = useState('');
  const [description, setDescription] = useState('');
  const [unitsInStock, setUnitsInStock] = useState('');
  const [price, setPrice] = useState('');
  const [censorId, setCensorId] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const profileButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonNames = ['Home', 'About', 'Services', 'Contact'];

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const categoryIdMapping = {
      "Appetizers": 1,
      "Soups": 2,
      "Salads": 3,
      "Vegetables": 4,
      "Main Dishes": 5,
      "Breads": 6,
      "Desserts": 7,
      "Miscellaneous": 8,
    };
  
    const payload = {
      BookName: bookName,
      Description: description,
      UnitsInStock: parseInt(unitsInStock, 10) || 0,
      Price: parseFloat(price) || 0,
      CensorID: censorId,
      ISBN: isbn,
      CategoryId: categoryIdMapping[category] || null,
      ImageUrl: imageUrl,
      book: { // Ensure to include a book field if required
        BookName: bookName,
        // Include other necessary fields here as per API requirements
      }
    };
  
    console.log('Payload:', JSON.stringify(payload, null, 2));
  
    try {
      const response = await fetch('https://rmrbdapi.somee.com/odata/Book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Response Error:', errorResponse);
        throw new Error(`Failed to add book: ${errorResponse.title || response.statusText}`);
      }
  
      console.log('Book added successfully');
      // Reset form after successful submission
      setBookName('');
      setDescription('');
      setUnitsInStock('');
      setPrice('');
      setCensorId('');
      setIsbn('');
      setCategory('');
      setImageUrl('');
  
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error to be caught by ErrorBoundary
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="fixed w-full z-50">
        <div className="bg-primary/100">
          <div className="container mx-auto flex justify-between items-center">
            {/* Additional Header Content (if needed) */}
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
                  id="searchItems"
                  name="searchItems"
                  type="text"
                  placeholder="Search your items"
                  className="w-[300px] sm:w-[400px] group-hover:w-[500px] transition-all duration-300 rounded-full border border-white px-2 py-1 focus:outline-none focus:border-primary"
                />
                <IoMdSearch className="absolute top-1/2 -translate-y-1/2 right-3 w-7 h-6 rounded-full border-2 bg-orange-400" />
              </div>

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

      {/* Background and Form Section */}
      <div className="flex-grow" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="bg-white mx-4 p-4 shadow-md mt-20" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <h2 className="text-2xl font-bold ml-4" style={{ fontFamily: 'Roboto, sans-serif' }}>Add new book</h2>
          <div className="border-b border-black w-auto mx-auto mt-1" />

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Book Name */}
              <div>
                <label className="block text-gray-700" htmlFor="bookName">Book Name</label>
                <input
                  id="bookName"
                  name="bookName"
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="w-full border border-gray-300 p-2"
                  placeholder="Enter book name"
                  required
                />
              </div>

              {/* Photo URL */}
              <div className="col-span-2">
                <label className="block text-gray-700" htmlFor="imageUrl">Photo URL</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="w-full border border-gray-300 p-2"
                  placeholder="Enter image URL"
                  required
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-gray-700" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 p-2"
                  placeholder="Enter description"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Units In Stock */}
              <div>
                <label className="block text-gray-700" htmlFor="unitsInStock">Units In Stock</label>
                <input
                  id="unitsInStock"
                  name="unitsInStock"
                  type="number"
                  value={unitsInStock}
                  onChange={(e) => setUnitsInStock(e.target.value)}
                  className="w-full border border-gray-300 p-2"
                  placeholder="Enter units in stock"
                  required
                />
              </div>

              {/* Censor ID */}
              <div>
                <label className="block text-gray-700" htmlFor="censorId">Censor ID</label>
                <input
                  id="censorId"
                  name="censorId"
                  type="text"
                  value={censorId}
                  onChange={(e) => setCensorId(e.target.value)}
                  className="w-full border border-gray-300 p-2"
                  placeholder="Enter Censor ID"
                  required
                />
              </div>

              {/* ISBN */}
              <div>
                <label className="block text-gray-700" htmlFor="isbn">ISBN</label>
                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full border border-gray-300 p-2"
                  placeholder="Enter ISBN"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Soups">Soups</option>
                  <option value="Salads">Salads</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Main Dishes">Main Dishes</option>
                  <option value="Breads">Breads</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-4 flex space-x-4">
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setBookName('');
                  setDescription('');
                  setUnitsInStock('');
                  setPrice('');
                  setCensorId('');
                  setIsbn('');
                  setCategory('');
                  setImageUrl('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 transition-colors text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 flex-grow-0">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
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

// App Component wrapping AddBook with ErrorBoundary
const App = () => (
  <ErrorBoundary>
    <AddBook />
  </ErrorBoundary>
);

export default App;
