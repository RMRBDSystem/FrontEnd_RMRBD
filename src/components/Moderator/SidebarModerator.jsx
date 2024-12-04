import { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { FiBookOpen, FiUsers, FiBook, FiList } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom"; // Import useLocation

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility
  const location = useLocation(); // Get current location

  const menuItems = [
    {
      id: "update-role",
      label: "Cập nhật vai trò",
      icon: <FiUsers />,
      path: "/update-role",
    },
    {
      id: "update-recipe",
      label: "Cập nhật công thức",
      icon: <FiList />,
      path: "/update-recipe",
    },
    {
      id: "update-book",
      label: "Cập nhật sách",
      icon: <FiBook />,
      path: "/update-book",
    },
    {
      id: "update-ebook",
      label: "Cập nhật sách điện tử",
      icon: <FiBookOpen />,
      path: "/update-ebook",
    },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-72" : "w-20"
      } bg-[#5c6ae7] text-white transition-all duration-300 flex flex-col items-start p-4 min-h-screen`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between w-full mb-4">
        {sidebarOpen && (
          <div className="flex justify-center items-center w-full">
            <img
              src="/images/LogoA.png"
              alt="Logo"
              className="w-20 h-20 transition-all duration-300"
            />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar menu */}
      {sidebarOpen && (
        <div className="space-y-6 text-base w-full overflow-auto">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center hover:text-orange-400 cursor-pointer py-3 border-b border-gray-700 ${
                  location.pathname === item.path
                    ? "border-r-4 border-yellow-500"
                    : ""
                }`} // Highlight based on pathname
              >
                {item.icon}
                <Link to={item.path} className="ml-3">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
