import React, { useState, useRef, useEffect } from "react";
import { FaSignOutAlt, FaEdit, FaHome, FaShieldAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "../RouterPage/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NavbarModerator = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [accountData, setAccountData] = useState({});
  const userRole = Cookies.get("UserRole");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get("UserId");
    if (userId) {
      fetchAccountData(userId);
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAccountData = async (userId) => {
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/Account/${userId}`,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      setAccountData(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch account data.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://rmrbdapi.somee.com/odata/Login/logout",
        {},
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      setIsLoggedIn(false);
      Cookies.remove("UserRole");
      Cookies.remove("UserName");
      Cookies.remove("UserId");
      Cookies.remove("Coin");

      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-gradient-to-r from-purple-500 via-blue-600 to-blue-800 shadow-lg">
        <div className="flex items-center justify-between w-full md:w-auto">
          <NavLink to="/update-recipe" className="text-white text-2xl font-semibold">
            <span className="text-yellow-400">Moderator</span> Dashboard
          </NavLink>
        </div>

        <div className="flex space-x-6 mt-4 md:mt-0">
          {isLoggedIn && (
            <div ref={dropdownRef} className="relative">
              <div
                onClick={toggleDropdown}
                className="flex items-center cursor-pointer space-x-3"
              >
                <img
                  src={accountData.avatar || "https://via.placeholder.com/50"}
                  alt="User Avatar"
                  className="w-14 h-14 object-cover rounded-full border-2 border-white"
                />
                <span className="ml-2 text-white font-medium text-lg">
                  {accountData.userName || "No name"}
                </span>
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg text-black z-10 transition-all transform scale-100"
                  onClick={(e) => e.stopPropagation()} // Prevent click propagation to the document
                >
                  {userRole === "Moderator" && (
                    <>
                      <NavLink
                        to="/update-moderator-information"
                        className="block px-4 py-3 hover:bg-gray-200 transition-all flex items-center space-x-2"
                      >
                        <FaEdit className="text-blue-600" />
                        <span>Cập nhật tài khoản</span>
                      </NavLink>

                      <NavLink
                        to="/"
                        className="block px-4 py-3 hover:bg-gray-200 transition-all flex items-center space-x-2"
                      >
                        <FaHome className="text-blue-600" />
                        <span>Trang chủ</span>
                      </NavLink>

                      <NavLink
                        to="/update-recipe"
                        className="block px-4 py-3 hover:bg-gray-200 transition-all flex items-center space-x-2"
                      >
                        <FaShieldAlt className="text-blue-600" />
                        <span>Trang quản trị</span>
                      </NavLink>

                      <div
                        className="block px-4 py-3 hover:bg-gray-200 transition-all cursor-pointer flex items-center space-x-2"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="text-red-600" />
                        <span>Đăng xuất</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavbarModerator;
