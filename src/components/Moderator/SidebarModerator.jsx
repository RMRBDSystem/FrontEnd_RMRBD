import { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { FiHome, FiBookOpen, FiUsers, FiBook, FiList } from "react-icons/fi"; // Add more icons as needed
import { Link } from "react-router-dom"; // Import Link for navigation

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility
  const [selectedItem, setSelectedItem] = useState(""); // State to track selected item

  const handleSelect = (item) => {
    setSelectedItem(item); // Set the selected item when a menu item is clicked
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-72" : "w-20"
      } bg-[#5c6ae7] text-white transition-all duration-300 flex flex-col items-start p-4 min-h-screen`} // Darker background and white text
    >
      {/* Sidebar header with logo */}
      <div className="flex items-center justify-between w-full mb-4">
        {sidebarOpen && (
          <div className="flex justify-center items-center w-full">
            <img
              src="/images/LogoA.png"
              alt="Logo"
              className="w-20 h-20 transition-all duration-300" // Keep the hover effect for logo neutral
            />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl" // White color for close button
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar menu */}
      {sidebarOpen && (
        <div className="space-y-6 text-base w-full overflow-auto">
          <ul>
            <li
              onClick={() => handleSelect("update-role")}
              className={`flex items-center hover:text-orange-400 cursor-pointer py-3 border-b border-gray-700 ${
                selectedItem === "update-role" ? "border-r-4 border-yellow-500" : ""
              }`} // Hover color and active item border
            >
              <FiUsers className="mr-3" />
              <Link to="/update-role">Cập nhật vai trò</Link>
            </li>
            <li
              onClick={() => handleSelect("update-recipe")}
              className={`flex items-center hover:text-orange-400 cursor-pointer py-3 border-b border-gray-700 ${
                selectedItem === "update-recipe" ? "border-r-4 border-yellow-500" : ""
              }`}
            >
              <FiList className="mr-3" />
              <Link to="/update-recipe">Cập nhật công thức</Link>
            </li>
            <li
              onClick={() => handleSelect("update-book")}
              className={`flex items-center hover:text-orange-400 cursor-pointer py-3 border-b border-gray-700 ${
                selectedItem === "update-book" ? "border-r-4 border-yellow-500" : ""
              }`}
            >
              <FiBook className="mr-3" />
              <Link to="/update-book">Cập nhật sách</Link>
            </li>
            <li
              onClick={() => handleSelect("update-ebook")}
              className={`flex items-center hover:text-orange-400 cursor-pointer py-3 border-b border-gray-700 ${
                selectedItem === "update-ebook" ? "border-r-4 border-yellow-500" : ""
              }`}
            >
              <FiBookOpen className="mr-3" />
              <Link to="/update-ebook">Cập nhật sách điện tử</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
