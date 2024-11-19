import React from "react";

function Banner() {
  return (
    <div className="flex flex-col sm:flex-row mb-8 sm:items-center bg-gradient-to-br from-blueGray-800 via-blueGray-800 to-blueGray-800 p-4 rounded-lg shadow-md">
      {/* Sort By */}
      <div className="mb-3 sm:mb-0 sm:mr-5 w-full sm:w-auto">
        <div className="relative border border-gray-700 rounded">
          <select
            className="relative w-full pl-4 pr-10 py-2 bg-transparent text-gray-300 font-medium outline-none appearance-none"
            defaultValue="Sort by"
          >
            <option value="Sort by">Sắp xếp</option>
            <option value="Price">Giá</option>
            <option value="Ratings">Đánh giá</option>
            <option value="Popularity">Phổ biến</option>
          </select>
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.96967 0.71967C1.26256 0.426777 1.73744 0.426777 2.03033 0.71967L6 4.68934L9.96967 0.71967C10.2626 0.426777 10.7374 0.426777 11.0303 0.71967C11.3232 1.01256 11.3232 1.48744 11.0303 1.78033L6.53033 6.28033C6.23744 6.57322 5.76256 6.57322 5.46967 6.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.71967Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Category */}
      <div className="mb-3 sm:mb-0 sm:mr-5 w-full sm:w-auto">
        <div className="relative border border-gray-700 rounded">
          <select
            className="relative w-full pl-4 pr-10 py-2 bg-transparent text-gray-300 font-medium outline-none appearance-none"
            defaultValue="Category"
          >
            <option value="Category">Thể loại</option>
            <option value="Cookbooks">Sách nấu ăn</option>
            <option value="Fiction">Sách tiểu thuyết</option>
            <option value="Kids">Sách thiếu nhi</option>
          </select>
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.96967 0.71967C1.26256 0.426777 1.73744 0.426777 2.03033 0.71967L6 4.68934L9.96967 0.71967C10.2626 0.426777 10.7374 0.426777 11.0303 0.71967C11.3232 1.01256 11.3232 1.48744 11.0303 1.78033L6.53033 6.28033C6.23744 6.57322 5.76256 6.57322 5.46967 6.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.71967Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Size */}
      <div className="mb-3 sm:mb-0 sm:mr-5 w-full sm:w-auto">
        <div className="relative border border-gray-200 rounded">
          <select
            className="relative w-full pl-4 pr-10 py-2 bg-transparent text-gray-300 font-medium outline-none appearance-none"
            defaultValue="Size"
          >
            <option value="Size">Kích cỡ</option>
            <option value="Small">Nhỏ</option>
            <option value="Medium">Vừa</option>
            <option value="Large">Lớn</option>
          </select>
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.96967 0.71967C1.26256 0.426777 1.73744 0.426777 2.03033 0.71967L6 4.68934L9.96967 0.71967C10.2626 0.426777 10.7374 0.426777 11.0303 0.71967C11.3232 1.01256 11.3232 1.48744 11.0303 1.78033L6.53033 6.28033C6.23744 6.57322 5.76256 6.57322 5.46967 6.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.71967Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Banner;
