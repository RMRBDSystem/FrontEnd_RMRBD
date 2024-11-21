import React, { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ onFilterChange }) {
  const [categories, setCategories] = useState([]); // Danh mục loại sách
  const [filters, setFilters] = useState({
    categories: null, // Chỉ lưu trữ một category
    priceRanges: [],
    publishers: [],
    ratings: [],
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
        // Chỉ cho phép chọn một danh mục
        updatedFilters.categories = updatedFilters.categories === value ? null : value;
      } else {
        // Xử lý các bộ lọc khác (đa chọn)
        if (updatedFilters[filterType].includes(value)) {
          updatedFilters[filterType] = updatedFilters[filterType].filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[filterType].push(value);
        }
      }

      // Gửi bộ lọc được cập nhật về trang cha
      onFilterChange(updatedFilters);

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
                name="category" // Đảm bảo chỉ chọn một
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
      </div>

      {/* Giá */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">
          Giá
        </label>
        <ul className="space-y-3">
          {["0đ - 150,000đ", "150,000đ - 300,000đ", "300,000đ - 500,000đ"].map(
            (priceRange, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                  onChange={() =>
                    handleFilterChange("priceRanges", priceRange)
                  }
                />
                <span className="text-gray-300">{priceRange}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Nhà Xuất Bản */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">
          Nhà Xuất Bản
        </label>
        <ul className="space-y-3">
          {["NXB Trẻ", "NXB Kim Đồng", "NXB Lao Động", "NXB Tổng Hợp"].map(
            (publisher, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                  onChange={() =>
                    handleFilterChange("publishers", publisher)
                  }
                />
                <span className="text-gray-300">{publisher}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Đánh Giá */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">
          Đánh Giá
        </label>
        <ul className="space-y-3">
          {["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"].map((rating, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                onChange={() => handleFilterChange("ratings", rating)}
              />
              <span className="text-gray-300">{rating}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
