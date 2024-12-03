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
} from "react-icons/fi"; // Import icons

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
      path: "/update-information",
      label: "Thông tin cá nhân",
      icon: <FiUser />,
    },
    {
      path: "/form-updated-role",
      label: "Thông tin đã yêu cầu",
      icon: <FiSettings />,
    },
    {
      path: "/list-saved-recipe",
      label: "Công thức đã lưu",
      icon: <FiHeart />,
    },
    {
      path: "/recipe-customer-list",
      label: "Công thức đã đăng",
      icon: <FiBookOpen />,
    },
    { path: "/book-list-customer", label: "Sách đã đăng", icon: <FiBook /> },
  ];

  return (
    <div className="w-full md:w-1/6 bg-white p-3 shadow-md">
      <div className="text-center">
        <img
          src={accountData.avatar || "/default-avatar.png"}
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
          {menuItems.map((item) => (
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
