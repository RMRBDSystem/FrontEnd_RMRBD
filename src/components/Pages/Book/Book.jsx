import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import BookCard from "./BookCard.jsx";
import { getBooks, getBooksByCategory } from "../../services/BookService.js";

function Book() {
  const [books, setBooks] = useState([]); // Danh sách sách
  const [loading, setLoading] = useState(false); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [selectedFilters, setSelectedFilters] = useState({ categories: null }); // Bộ lọc từ Sidebar
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const booksPerPage = 6; // Số sách hiển thị mỗi trang

  // Fetch sách theo bộ lọc
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        let booksData;

        if (selectedFilters.categories) {
          booksData = await getBooksByCategory(selectedFilters.categories);
        } else {
          booksData = await getBooks();
        }

        // Kiểm tra xem booksData có phải là mảng
        if (Array.isArray(booksData)) {
          const filteredBooks = booksData.filter((book) => {
            // Đảm bảo các trường luôn là mảng, kể cả khi chưa chọn gì
            const priceRanges = selectedFilters.priceRanges || [];
            const ratings = selectedFilters.ratings || [];

            // Lọc theo giá
            const matchesPrice =
              priceRanges.length === 0 ||
              priceRanges.some((range) => {
                const [min, max] = range.split("-").map(Number);
                return book.price >= min && book.price <= max;
              });

            // Lọc theo đánh giá
            const matchesRating =
              ratings.length === 0 ||
              ratings.includes(Math.round(book.bookRate || 0));

            return matchesPrice && matchesRating;
          });

          setBooks(filteredBooks);
        } else {
          console.error("Dữ liệu không hợp lệ:", booksData);
          setError("Dữ liệu không hợp lệ.");
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Không thể tải danh sách sách. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedFilters]);




  // Tính tổng số trang và sách hiển thị trên trang hiện tại
  const totalPages = Math.ceil(books.length / booksPerPage);
  const displayedBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Nhận bộ lọc từ Sidebar
  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    setCurrentPage(1); // Reset về trang đầu khi áp dụng bộ lọc
  };

  return (
    <section className="section-center">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between -mx-4">
          {/* Sidebar */}
          <div className="flex w-full lg:w-auto lg:flex-row px-4 items-center space-x-4">
            <Sidebar onFilterChange={applyFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1 px-4 rounded-lg shadow-md bg-gray-300 ">
            {/* Nội dung sách */}
            {loading ? (
              <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : books.length === 0 ? (
              <p className="text-center text-gray-500">Không tìm thấy sách nào.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayedBooks.map((book) => (
                  <BookCard key={book.bookId} book={book} />
                ))}
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="flex justify-center space-x-2">
                  {/* Nút Previous */}
                  <li>
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      className="w-9 h-9 flex items-center justify-center border border-gray-800 text-gray-400 hover:text-yellow-300"
                    >
                      &lt;
                    </button>
                  </li>
                  {/* Số trang */}
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1}>
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-9 h-9 flex items-center justify-center ${currentPage === index + 1
                            ? "bg-gradient-to-br from-yellow-500 via-green-300 to-blue-500 text-black font-bold"
                            : "border border-gray-800 text-gray-400 hover:text-yellow-300"
                          }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  {/* Nút Next */}
                  <li>
                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      className="w-9 h-9 flex items-center justify-center border border-gray-800 text-gray-400 hover:text-yellow-300"
                    >
                      &gt;
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
