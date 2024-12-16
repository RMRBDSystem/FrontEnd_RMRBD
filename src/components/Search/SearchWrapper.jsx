import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaSearch } from 'react-icons/fa';

const SearchWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchString('');
      setResults([]);
      setError(null);
    }
  };

  const handleSearch = async (searchString) => {
    window.location.href = `/product/${searchString}`;
  }

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchString(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (!value) {
      setResults([]);
      setError(null);
      return;
    }

    const timeout = setTimeout(() => {
      fetchResults(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const fetchResults = async (query) => {
    try {
      setError(null);

      const [bookResponse, ebookResponse, recipeResponse] = await Promise.allSettled([
        axios.get(`https://rmrbdapi.somee.com/odata/Search/book/${query}`, {
          headers: { 'Token': '123-abc' }
        }),
        axios.get(`https://rmrbdapi.somee.com/odata/Search/ebook/${query}`, {
          headers: { 'Token': '123-abc' }
        }),
        axios.get(`https://rmrbdapi.somee.com/odata/Search/recipe/${query}`, {
          headers: { 'Token': '123-abc' }
        })
      ]);

      const bookResults = bookResponse.status === 'fulfilled' && bookResponse.value.status === 200 ? bookResponse.value.data : [];
      const ebookResults = ebookResponse.status === 'fulfilled' && ebookResponse.value.status === 200 ? ebookResponse.value.data : [];
      const recipeResults = recipeResponse.status === 'fulfilled' && recipeResponse.value.status === 200 ? recipeResponse.value.data : [];

      const combinedResults = [
        ...bookResults,
        ...ebookResults,
        ...recipeResults
      ];

      if (combinedResults.length > 0) {
        setResults(combinedResults);
      } else {
        setError('Không tìm thấy công thức, sách của bạn đang tìm.');
      }
    } catch (error) {
      setError('An error occurred while fetching data');
    }
  };

  return (
    <div>
      <div className="search-btn cursor-pointer text-gray-50 text-xl py-2 px-4 hover:text-custom-orange"
        onClick={toggleSearch}>
        <FaSearch />
      </div>

      <div className={`fixed left-0 w-full h-[80px] z-50 bg-black bg-opacity-50 transition-all duration-700 ${isOpen ? 'top-0' : '-top-20'}`}>
        <div className="close-btn absolute right-0 top-0 w-[70px] h-full bg-black text-white text-center flex items-center justify-center cursor-pointer" onClick={toggleSearch}>
          <FaTimes />
        </div>

        <div className="container mx-auto relative">
          <div className="flex justify-center">
            <form className="relative w-full max-w-[700px] h-[100px] " onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                name="search"
                placeholder="Nhập tên sách, mô tả, hoặc tên công thức"
                className="w-full h-12 rounded-full border-white text-gray-900 text-[24px] placeholder:italic placeholder:text-slate-400 p-4 mt-4 mb-4"
                value={searchString}
                onChange={handleSearchInputChange}
              />
              <button onClick={() => {
                handleSearch(searchString);
              }}
                type="submit"
                className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-transparent border-none cursor-pointer text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                  <path fill="#616161" d="M34.6 28.1H38.6V45.1H34.6z" transform="rotate(-45.001 36.586 36.587)"></path><path fill="#616161" d="M20 4A16 16 0 1 0 20 36A16 16 0 1 0 20 4Z"></path><path fill="#37474F" d="M36.2 32.1H40.2V44.400000000000006H36.2z" transform="rotate(-45.001 38.24 38.24)"></path><path fill="#64B5F6" d="M20 7A13 13 0 1 0 20 33A13 13 0 1 0 20 7Z"></path><path fill="#BBDEFB" d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"></path>
                </svg>
              </button>

              {results.length > 0 && (
                <div className="search-results absolute left-0 w-full bg-white border border-gray-200 rounded-md max-h-[300px] overflow-y-auto shadow-lg">
                  {results.map((item) => (
                    <a
                      href={
                        item.bookId ? `/book-detail/${item.bookId}` :
                          item.recipeId ? `/recipe-detail/${item.recipeId}` :
                            item.ebookId ? `/ebook/${item.ebookId}` :
                              '/'
                      }
                      key={item.id || item.bookId || item.recipeId}
                    >
                      <div key={item.id || item.bookId || item.recipeId} className="result-item p-2 flex items-center hover:bg-gray-300">
                        {item.imageUrl || (item.images && item.images[0] && item.images[0].imageUrl) ? (
                          <img
                            src={item.imageUrl || item.images[0].imageUrl}
                            alt={item.bookName || item.recipeName || item.ebookName}
                            className="w-16 h-24 object-cover mr-4"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-16 h-24 bg-gray-200 mr-4 flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}

                        <div>
                          {item.ebookName && (
                            <>
                              <h3 className="text-lg text-gray-800 font-bold">{item.ebookName}</h3>
                              <p className="text-sm text-gray-400 italic line-clamp-3">{item.description}</p>
                            </>
                          )}
                          {item.bookName && (
                            <>
                              <h3 className="text-lg text-gray-800 font-bold">{item.bookName}</h3>
                              <p className="text-sm text-gray-400 italic line-clamp-3">{item.description}</p>
                            </>
                          )}
                          {item.recipeName && (
                            <>
                              <h3 className="text-lg text-gray-800 font-bold">{item.recipeName}</h3>
                              <p className="text-sm text-gray-400 italic line-clamp-3">{item.ingredient}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-red-500 text-lg mt-2">{error}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWrapper;