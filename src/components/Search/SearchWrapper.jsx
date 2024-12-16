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
            <form className="relative w-full max-w-[700px] " onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                name="search"
                placeholder="Nhập tên sách, mô tả, hoặc tên công thức"
                className="w-full h-12 border-2 border-white text-gray-900 text-[24px] italic p-4 mt-4 mb-4"
                value={searchString}
                onChange={handleSearchInputChange}
              />
              <button onClick={() => {
                handleSearch(searchString);
              }}
                type="submit"
                className="absolute right-5 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] flex items-center justify-center bg-transparent border-none cursor-pointer text-black"
              >
                <FaSearch />
              </button>

              {results.length > 0 && (
                <div className="search-results absolute left-0 w-full bg-white border border-gray-200 rounded-md mt-2 max-h-[300px] overflow-y-auto shadow-lg">
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
