import React, { useEffect, useState } from "react";
import axios from "axios";

function Banner({ onFilterChange }) {
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

  return (
    <div className="flex flex-col sm:flex-row items-center p-4 rounded-lg shadow-md bg-white mb-8">
      {/* Loại Sách */}
      <div className="mb-3 sm:mb-0 sm:mr-5 w-full sm:w-auto">
        <label className="font-bold mb-2 block">Loại Sách</label>
        <div className="flex space-x-4">
          {categories.map((category) => (
            <label key={category.categoryId} className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 rounded"
                checked={filters.categories === category.categoryId}
                onChange={() => handleFilterChange("categories", category.categoryId)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="mb-3 sm:mb-0 sm:mr-5 w-full sm:w-auto">
        <label className="font-bold mb-2 block">Giá</label>
        <div className="flex space-x-4">
          {[
            { label: "0đ - 150,000đ", value: "0-150000" },
            { label: "150,000đ - 300,000đ", value: "150000-300000" },
            { label: "300,000đ - 500,000đ", value: "300000-500000" },
          ].map((priceRange, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 rounded"
                onChange={() => handleFilterChange("priceRanges", priceRange.value)}
              />
              <span>{priceRange.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Đánh Giá */}
      <div className="mb-3 sm:mb-0 sm:mr-5 w-full sm:w-auto">
        <label className="font-bold mb-2 block">Đánh Giá</label>
        <div className="flex space-x-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 rounded"
                onChange={() => handleFilterChange("ratings", rating)}
              />
              <span>{rating} sao</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
