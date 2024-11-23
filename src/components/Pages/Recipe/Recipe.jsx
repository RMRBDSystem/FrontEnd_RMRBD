import React, { useEffect, useState } from 'react';
import Sidebar from '../Recipe/Sidebar.jsx';
import Banner from '../Book/Banner.jsx';
import RecipeCard from './RecipeCard.jsx';
import { getRecipes, getRecipesByTags } from '../../services/RecipeService.js';
function Recipe() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái đang tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [selectedFilters, setSelectedFilters] = useState({ tags: null });
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const recipesPerPage = 6;

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            setError(null);

            try {
                let recipesData;
                if (selectedFilters.tags) {
                    // Nếu có bộ lọc danh mục, lấy sách theo danh mục
                    recipesData = await getRecipesByTags(selectedFilters.tags);
                } else {
                    // Nếu không có bộ lọc, lấy tất cả sách
                    recipesData = await getRecipes();
                }
                setRecipes(recipesData || []); // Đảm bảo booksData là mảng
            } catch (err) {
                console.error("Failed to fetch books:", err);
                setError("Không thể tải danh sách sách. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [selectedFilters]);

    const totalPages = Math.ceil(recipes.length / recipesPerPage);
    const displayedrecipes = recipes.slice(
        (currentPage - 1) * recipesPerPage,
        currentPage * recipesPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const applyFilters = (filters) => {
        setSelectedFilters(filters);
        setCurrentPage(1); // Reset về trang đầu khi áp dụng bộ lọc
    };


    return (
        <section className="py-20">
            <div className="flex justify-center p-4">
                {/* Giới hạn độ rộng tối đa và căn giữa nội dung */}
                <div className="max-w-screen-lg w-full flex flex-col lg:flex-row">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 p-4">
                        <Sidebar onFilterChange={applyFilters} />
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4 p-4">
                        <Banner />

                        {loading ? (
                            <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : recipes.length === 0 ? (
                            <p className="text-center text-gray-500">
                                Không tìm thấy sách nào.
                            </p>
                        ) : (
                            <div className="flex flex-wrap mb-20">
                                {displayedrecipes.map((recipe) => (
                                    <div
                                        key={recipe.recipeId}
                                        className="w-full sm:w-1/2 xl:w-1/3 mb-4 p-2"
                                    >
                                        <RecipeCard recipe={recipe} />
                                    </div>
                                ))}
                            </div>
                        )}

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
                                                className={`flex w-9 h-9 items-center justify-center ${currentPage === index + 1
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

export default Recipe;

