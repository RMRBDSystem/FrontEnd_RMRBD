import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Banner from "./Banner.jsx";
import BookCard from "./BookCard.jsx";
import { getBooks } from "../../services/BookService.js";

function Book() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };
    fetchBooks();
  }, []);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const displayedBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4">
          {/* Sidebar */}
          <div className="w-full lg:w-4/12 xl:w-3/12 px-4">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-8/12 xl:w-9/12 px-4">
            <Banner />

            {/* Book List */}
            <div className="flex flex-wrap mb-20">
              {displayedBooks.map((book) => (
                <div
                  key={book.bookId}
                  className="w-full sm:w-1/2 xl:w-1/3 mb-4 p-2"
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav>
                <ul className="flex items-center justify-center">
                  <li>
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(currentPage - 1, 1))
                      }
                      className="flex w-9 h-9 items-center justify-center border border-gray-800 text-gray-400 hover:text-yellow-300"
                      aria-label="Previous"
                    >
                      <svg
                        width="7"
                        height="12"
                        viewBox="0 0 7 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 10.6666L1.33333 5.99992L6 1.33325"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1}>
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`flex w-9 h-9 items-center justify-center ${
                          currentPage === index + 1
                            ? "bg-gradient-to-br from-yellow-500 via-green-300 to-blue-500 text-black font-bold"
                            : "text-gray-400 hover:text-yellow-300 border border-gray-800 font-bold"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() =>
                        handlePageChange(Math.min(currentPage + 1, totalPages))
                      }
                      className="flex w-9 h-9 items-center justify-center border border-gray-800 text-gray-400 hover:text-yellow-300"
                      aria-label="Next"
                    >
                      <svg
                        width="7"
                        height="12"
                        viewBox="0 0 7 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1.33341L5.66667 6.00008L1 10.6667"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Book;
