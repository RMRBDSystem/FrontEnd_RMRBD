import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Kiểm tra nếu ở trang Home (đường dẫn /home)
  if (location.pathname === "/home" || location.pathname === "/") {
    return null; // Không hiển thị breadcrumb khi ở trang Home
  }

  // Từ điển ánh xạ đường dẫn thành tên hiển thị
  const breadcrumbNames = {
    book: "Sách Nấu Ăn",
    recipe: "Công Thức Nấu Ăn",
    ebook: "Thư Viện Ebook",
    recharge: "Nạp Xu",
    coinTransaction: "Lịch Sử Nạp Xu",
    termsofpurchase: "Điều khoản và điều kiện mua tiền xu",
    faq: "Frequently Asked Questions"
  };
  return (
      <nav className="min-h-52 flex items-end w-full p-4 bg-gray-900">
        <ol className="pl-96 inline-flex space-x-1 md:space-x-2 rtl:space-x-reverse">
          {/* Link đầu tiên luôn là Home */}
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-50 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>

          {/* Tạo các link dựa trên đường dẫn hiện tại */}
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            // Kiểm tra xem có tên hiển thị tương ứng cho đường dẫn hiện tại không
            const name = breadcrumbNames[value] || value.replace("-", " ");

            return (
              <li key={to} aria-current={isLast ? "page" : undefined}>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  {isLast ? (
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                      {name}
                    </span>
                  ) : (
                    <Link
                      to={to}
                      className="ms-1 text-sm font-medium text-gray-300 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      {name}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
  );
};

export default Breadcrumb;
