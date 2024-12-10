import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FiUser,
  FiSettings,
  FiHeart,
  FiBookOpen,
  FiBook,
  FiFileText,
} from "react-icons/fi";
import { getAccountData } from "../services/CustomerService/api";
const Sidebar = () => {
  const [accountData, setAccountData] = useState({});
  const location = useLocation();
  const isFetchCalled = useRef(false);
  useEffect(() => {
    const userId = Cookies.get("UserId");
    console.log("Gọi useEffect Sidebar");
    if (userId && !isFetchCalled.current) {
      fetchAccountData(userId);
      isFetchCalled.current = true;
    }
  }, []);

  const fetchAccountData = async (userId) => {
    try {
      const response = await getAccountData(userId);
      setAccountData(response);
    } catch (error) {
      console.error(error);
    }
  };

  const userRole = accountData.role?.roleName;
  const menuItems = [
    {
      path: "/recipe-list-seller",
      label: "Công thức đã đăng",
      icon: <FiBookOpen />,
      visibleFor: ["Seller"],
    },
    {
      path: "/list-saved-recipe",
      label: "Công thức đã lưu",
      icon: <FiHeart />,
      visibleFor: ["Customer", "Seller"],
    },
    {
      path: "/update-information",
      label: "Thông tin cá nhân",
      icon: <FiUser />,
      visibleFor: ["Customer", "Seller"],
    },
    {
      path: "/form-updated-role",
      label: "Thông tin đã yêu cầu",
      icon: <FiSettings />,
      visibleFor: ["Customer", "Seller"],
    },
    {
      path: "/book-list-customer",
      label: "Sách đã đăng",
      icon: <FiBook />,
      visibleFor: ["Seller"],
    },
    {
      path: "/list-ebook-customer",
      label: "Sách điện tử đã đăng",
      icon: <FiFileText />,
      visibleFor: ["Seller"],
    },
  ];

  return (
    <div className="w-full md:w-1/6 bg-white p-3 shadow-md">
      <div className="text-center">
        <img
          src={accountData.avatar || "/images/avatar.png"}
          alt="User Avatar"
          className="w-16 h-16 mx-auto mb-2 object-cover border border-gray-300 rounded-full"
        />
        <h3 className="font-bold text-lg text-gray-800">
          {accountData.userName || "User"}
        </h3>
        <p className="text-sm text-gray-500">{accountData.email}</p>
      </div>
      <div className="mt-4">
        <ul className="space-y-3">
          {menuItems
            .filter((item) => item.visibleFor.includes(userRole)) // Kiểm tra vai trò
            .map((item) => (
              <li key={item.path} className="border-b border-gray-300 pb-2">
                <Link
                  to={item.path}
                  className={`flex items-center transition duration-300 ease-in-out ${
                    location.pathname === item.path
                      ? "text-orange-800 font-bold"
                      : "text-orange-600"
                  } hover:text-orange-800 hover:translate-x-2`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
