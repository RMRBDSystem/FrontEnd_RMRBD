import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FiUser,
  FiSettings,
  FiHeart,
  FiBookOpen,
  FiBook,
  FiFileText,
  FiBookmark,
} from "react-icons/fi";

const Sidebar = () => {
  const [accountID, setAccountID] = useState(null);
  const [accountData, setAccountData] = useState({});
  const location = useLocation();

  useEffect(() => {
    const userId = Cookies.get("UserId");
    setAccountID(userId);
    if (userId) {
      fetchAccountData(userId);
    }
  }, []);

  const fetchAccountData = async (userId) => {
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/Account/${userId}`,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      const data = response.data;
      setAccountData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const menuItems = [
    {
      path: "/recipe-customer-list",
      label: "Công thức đã đăng",
      icon: <FiBookOpen className="text-orange-500" />,
    },
    {
      path: "/list-saved-recipe",
      label: "Công thức đã lưu",
      icon: <FiHeart className="text-orange-500" />,
    },
    {
      path: "/update-information",
      label: "Thông tin cá nhân",
      icon: <FiUser className="text-orange-500" />,
    },
    {
      path: "/form-updated-role",
      label: "Thông tin đã yêu cầu",
      icon: <FiSettings className="text-orange-500" />,
    },
    {
      path: "/book-list-customer",
      label: "Sách đã đăng",
      icon: <FiBook className="text-orange-500" />,
    },
    {
      path: "/list-ebook-customer",
      label: "Sách điện tử đã đăng",
      icon: <FiFileText className="text-orange-500" />,
    },
    {
      path: "/saved-ebooks",
      label: "Sách điện tử đã lưu",
      icon: <FiBookmark className="text-orange-500" />,
    },
    {
      path: "/orders",
      label: "Lịch sử đơn hàng của sách",
      icon: <FiBook className="text-orange-500" />,
    },
  ];

  return (
    <div className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 shadow-sm min-h-screen">
      <div className="sticky top-0">
        <div className="text-center mb-8">
          <img
            src={accountData.avatar || "/default-avatar.png"}
            alt="User Avatar"
            className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-gray-200"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            {accountData.userName || "User"}
          </h2>
          <p className="text-sm text-gray-500">{accountData.email}</p>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
                    location.pathname === item.path ? "bg-gray-50" : ""
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
