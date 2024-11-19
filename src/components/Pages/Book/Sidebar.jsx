import React from "react";

function Sidebar() {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 text-lg mb-6">
        Nhóm Sản Phẩm
      </h2>

      {/* Loại Sách */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">Loại Sách</label>
        <ul className="space-y-3">
          {["Món Á", "Món Âu", "Món Việt", "Món Hàn", "Món Nhật"].map(
            (category, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                />
                <span className="text-gray-300">{category}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Giá */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">Giá</label>
        <ul className="space-y-3">
          {["0đ - 150,000đ", "150,000đ - 300,000đ", "300,000đ - 500,000đ"].map(
            (priceRange, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                />
                <span className="text-gray-300">{priceRange}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Các bộ lọc khác */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">Nhà Xuất Bản</label>
        <ul className="space-y-3">
          {["NXB Trẻ", "NXB Kim Đồng", "NXB Lao Động", "NXB Tổng Hợp"].map(
            (publisher, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
                />
                <span className="text-gray-300">{publisher}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Bộ lọc bổ sung */}
      <div className="mb-6">
        <label className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 mb-5">Đánh Giá</label>
        <ul className="space-y-3">
          {["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"].map((rating, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 mr-3 text-blue-500 focus:ring-blue-400 rounded"
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
