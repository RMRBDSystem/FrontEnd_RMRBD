import React, { useEffect, useState } from "react";
import Sidebar from "../Ebook/Sidebar.jsx";
import Banner from '../Ebook/Banner.jsx';
import EbookCard from "./EbookCard.jsx";
import { getEbooks, getEbooksByCategory } from "../../services/EBookService.js";

function Ebook() {
  const [ebooks, setEbooks] = useState([]); // Danh sách ebook
  const [loading, setLoading] = useState(false); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [selectedFilters, setSelectedFilters] = useState({ categories: null }); // Bộ lọc từ Sidebar
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const ebooksPerPage = 6; // Số ebook hiển thị mỗi trang

  // Fetch ebooks theo bộ lọc
  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true);
      setError(null);

      try {
        let ebooksData;

        if (selectedFilters.categories) {
          ebooksData = await getEbooksByCategory(selectedFilters.categories);
        } else {
          ebooksData = await getEbooks();
        }

        // Kiểm tra xem ebooksData có phải là mảng
        if (Array.isArray(ebooksData)) {
          const filteredEbooks = ebooksData.filter((ebook) => {
            // Đảm bảo các trường luôn là mảng, kể cả khi chưa chọn gì
            const priceRanges = selectedFilters.priceRanges || [];
            const ratings = selectedFilters.ratings || [];

            // Lọc theo giá
            const matchesPrice =
              priceRanges.length === 0 ||
              priceRanges.some((range) => {
                const [min, max] = range.split("-").map(Number);
                return ebook.price >= min && ebook.price <= max;
              });

            // Lọc theo đánh giá
            const matchesRating =
              ratings.length === 0 ||
              ratings.includes(Math.round(ebook.ebookRate || 0));

            return matchesPrice && matchesRating;
          });

          setEbooks(filteredEbooks);
        } else {
          console.error("Dữ liệu không hợp lệ:", ebooksData);
          setError("Dữ liệu không hợp lệ.");
        }
      } catch (err) {
        console.error("Failed to fetch ebooks:", err);
        setError("Không thể tải danh sách ebook. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, [selectedFilters]);

  // Tính tổng số trang và ebooks hiển thị trên trang hiện tại
  const totalPages = Math.ceil(ebooks.length / ebooksPerPage);
  const displayedEbooks = ebooks.slice(
    (currentPage - 1) * ebooksPerPage,
    currentPage * ebooksPerPage
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
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4">
          {/* Sidebar */}
          <div className="w-full lg:w-4/12 xl:w-3/12 px-4">
            <Sidebar onFilterChange={applyFilters} />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-8/12 xl:w-9/12 px-4">
            <Banner />

            {/* Trạng thái dữ liệu */}
            {loading ? (
              <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : ebooks.length === 0 ? (
              <p className="text-center text-gray-500">
                Không tìm thấy ebook nào.
              </p>
            ) : (
              <div className="flex flex-wrap mb-20">
                {displayedEbooks.map((ebook) => (
                  <div
                    key={ebook.ebookId}
                    className="w-full sm:w-1/2 xl:w-1/3 mb-4 p-2"
                  >
                    <EbookCard ebook={ebook} />
                  </div>
                ))}
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <nav>
                <ul className="flex items-center justify-center">
                  {/* Nút Previous */}
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

                  {/* Số trang */}
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

                  {/* Nút Next */}
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

export default Ebook;
