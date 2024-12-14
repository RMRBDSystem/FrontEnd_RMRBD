import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaSearch, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAuth } from '../../RouterPage/AuthContext';
import { decryptData } from "../../Encrypt/encryptionUtils";

const AdminLayout = ({ children, title }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [accountData, setAccountData] = useState({});
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  
  useEffect(() => {
    const userId = decryptData(Cookies.get("UserId"));
    if (userId) {
      fetchAccountData(userId);
    }
    
    // Only allow "Admin" role
    const userRole = decryptData(Cookies.get("UserRole"));
    if (!["Admin"].includes(userRole)) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAccountData = async (userId) => {
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/Account/${userId}`,
        {
          headers: { 'Content-Type': 'application/json', Token: '123-abc' },
        }
      );
      setAccountData(response.data);
    } catch (error) {
      console.error('Failed to fetch account data:', error);
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
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              <div ref={dropdownRef} className="relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center cursor-pointer"
                >
                  <img
                    src={accountData.avatar || "https://via.placeholder.com/50"}
                    alt="User Avatar"
                    className="w-14 h-14 object-cover rounded-full border-2 border-white"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg font-semibold text-black z-10">
                    <NavLink
                      to="/"
                      className="block px-4 py-3 hover:bg-gray-200 transition-all flex items-center space-x-2"
                    >
                      <FaHome className="text-blue-600" />
                      <span>Trang chủ</span>
                    </NavLink>
                    <div
                      className="block px-4 py-3 hover:bg-gray-200 transition-all cursor-pointer flex items-center space-x-2"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="text-red-600" />
                      <span>Đăng xuất</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 