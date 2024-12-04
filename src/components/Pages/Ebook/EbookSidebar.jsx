import React, { useEffect, useState } from "react";
import axios from "axios";

function EbookSidebar({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    priceRange: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      category: null,
      priceRange: null,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="p-4 rounded-lg shadow-md bg-white">
      <h2 className="font-bold text-lg mb-6">Bộ lọc</h2>

      {/* Categories */}
      <div className="mb-6">
        <label className="font-bold mb-4 block">Thể loại</label>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.categoryId} className="flex items-center">
              <input
                type="radio"
                name="category"
                className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400"
                checked={filters.category === category.categoryId}
                onChange={() => handleFilterChange("category", category.categoryId)}
              />
              <span className="text-gray-600">{category.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Ranges */}
      <div className="mb-6">
        <label className="font-bold mb-4 block">Giá</label>
        <ul className="space-y-3">
          {[
            { label: "0đ - 50,000đ", value: "0-50000" },
            { label: "50,000đ - 100,000đ", value: "50000-100000" },
            { label: "Trên 100,000đ", value: "100000+" },
          ].map((range) => (
            <li key={range.value} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400"
                checked={filters.priceRange === range.value}
                onChange={() => handleFilterChange("priceRange", range.value)}
              />
              <span className="text-gray-600">{range.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

export default EbookSidebar; 