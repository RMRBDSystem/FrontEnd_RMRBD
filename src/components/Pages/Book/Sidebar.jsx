import React, { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ onFilterChange }) {
  const [categories, setCategories] = useState([]); // Danh mục loại sách
  const [filters, setFilters] = useState({
    categories: null, // Chỉ lưu trữ một category
    priceRanges: [], // Lọc theo giá
    ratings: [], // Lọc theo đánh giá
  });

  // Fetch danh mục sách từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://rmrbdapi.somee.com/odata/BookCategory",
          {
            headers: { token: "123-abc" },
          }
        );
        const activeCategories = response.data.filter(
          (category) => category.status === 1
        );
        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filterType === "categories") {
        updatedFilters.categories = updatedFilters.categories === value ? null : value;
      } else {
        if (updatedFilters[filterType].includes(value)) {
          updatedFilters[filterType] = updatedFilters[filterType].filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[filterType].push(value);
        }
      }

      // Gửi bộ lọc được cập nhật về component cha
      onFilterChange(updatedFilters);

      return updatedFilters;
    });
  };

  // Hàm xử lý "Bỏ chọn" category
  const clearCategoryFilter = () => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, categories: null };
      onFilterChange(updatedFilters); // Gửi lại bộ lọc
      return updatedFilters;
    });
  };

  return (
    <div className="p-4 rounded-lg shadow-md">
      <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 text-lg mb-6">
        Nhóm Sản Phẩm
      </h2>

      {/* Loại Sách */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">
          Loại Sách
        </label>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.categoryId} className="flex items-center">
              <input
                type="radio"
                name="category"
                className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                checked={filters.categories === category.categoryId}
                onChange={() =>
                  handleFilterChange("categories", category.categoryId)
                }
              />
              <span className="text-gray-300">{category.name}</span>
            </li>
          ))}
        </ul>
        {/* Nút Bỏ chọn */}
        <button
          className="mt-4 px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-yellow-500 via-red-300 to-blue-500 rounded"
          onClick={clearCategoryFilter}
        >
          Clear Selection
        </button>
      </div>

      {/* Giá */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">
          Giá
        </label>
        <ul className="space-y-3">
          {[
            { label: "0đ - 150,000đ", value: "0-150000" },
            { label: "150,000đ - 300,000đ", value: "150000-300000" },
            { label: "300,000đ - 500,000đ", value: "300000-500000" },
          ].map((priceRange, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                onChange={() =>
                  handleFilterChange("priceRanges", priceRange.value)
                }
              />
              <span className="text-gray-300">{priceRange.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Đánh Giá */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">
          Đánh Giá
        </label>
        <ul className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <li key={rating} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                onChange={() => handleFilterChange("ratings", rating)}
              />
              <span className="text-gray-300">{rating} sao</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
