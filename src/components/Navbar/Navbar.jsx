import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Collapse, Typography, Button, IconButton } from "@material-tailwind/react";
import SearchWrapper from "./SearchWrapper";
import { Widgets, ArrowDropDown } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../RouterPage/AuthContext";

const categoriesContent = {
  "Công Thức Nấu Ăn": (
    <div className="grid grid-cols-3 gap-6 text-gray-700">
      <div>
        <h3 className="font-semibold text-base">MÓN CHÍNH</h3>
        <ul className="space-y-1 text-sm">
          <li>Thịt Kho Tàu</li>
          <li>Cá Kho Tộ</li>
          <li>Gà Nướng Mật Ong</li>
          <li>Phở Bò</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">MÓN CANH</h3>
        <ul className="space-y-1 text-sm">
          <li>Canh Chua Cá Lóc</li>
          <li>Canh Khổ Qua Nhồi Thịt</li>
          <li>Canh Bắp Cải Cuộn</li>
          <li>Canh Rong Biển</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">MÓN ĂN NHẸ</h3>
        <ul className="space-y-1 text-sm">
          <li>Bánh Cuốn</li>
          <li>Chả Giò</li>
          <li>Bánh Xèo</li>
          <li>Bánh Khọt</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
    </div>
  ),
  "Sách Nấu Ăn": (
    <div className="grid grid-cols-3 gap-6 text-gray-700">
      <div>
        <h3 className="font-semibold text-base">ẨM THỰC VIỆT NAM</h3>
        <ul className="space-y-1 text-sm">
          <li>Phở và các món bún</li>
          <li>Đặc sản miền Trung</li>
          <li>Món quê hương</li>
          <li>Món tráng miệng Việt</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">ẨM THỰC QUỐC TẾ</h3>
        <ul className="space-y-1 text-sm">
          <li>Món Nhật</li>
          <li>Ẩm Thực Hàn Quốc</li>
          <li>Món Ý</li>
          <li>Món Pháp</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">MÓN CHAY & SỨC KHỎE</h3>
        <ul className="space-y-1 text-sm">
          <li>Món chay cơ bản</li>
          <li>Salad & nước ép</li>
          <li>Chế độ ăn khỏe mạnh</li>
          <li>Công thức ít calorie</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
    </div>
  ),
  "Thư Viện E-Book": (
    <div className="grid grid-cols-3 gap-6 text-gray-700">
      <div>
        <h3 className="font-semibold text-base">SÁCH CÔNG THỨC</h3>
        <ul className="space-y-1 text-sm">
          <li>Công Thức Việt Nam</li>
          <li>Công Thức Châu Á</li>
          <li>Công Thức Châu Âu</li>
          <li>Công Thức Tráng Miệng</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">KỸ THUẬT NẤU ĂN</h3>
        <ul className="space-y-1 text-sm">
          <li>Nấu Món Nướng</li>
          <li>Kỹ Thuật Chiên Xào</li>
          <li>Thực Hành Làm Bánh</li>
          <li>Chuẩn Bị Nguyên Liệu</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">SỨC KHỎE & DINH DƯỠNG</h3>
        <ul className="space-y-1 text-sm">
          <li>Dinh Dưỡng Hàng Ngày</li>
          <li>Thực Đơn Giảm Cân</li>
          <li>Chế Độ Ăn Cho Trẻ Em</li>
          <li>Dinh Dưỡng Thể Thao</li>
          <li className="text-blue-500">Xem tất cả</li>
        </ul>
      </div>
    </div>
  ),
};

export function StickyNavbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Sách Trong Nước");
  const navigate = useNavigate();
  const userRole = Cookies.get("UserRole");
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "Sách Nấu Ăn") {
      navigate("/book")
    }
    if (category == "Công Thức Nấu Ăn") {
      navigate("/recipe")
    }
    if (category == "Thư Viện Ebook") {
      navigate("/ebook")
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://rmrbdapi.somee.com/odata/Login/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Token: "123-abc",
          },
        }
      );
      setIsLoggedIn(false);
      Cookies.remove("UserRole");
      Cookies.remove("UserName");
      localStorage.removeItem("isLoggedIn");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const dropdownRef = React.useRef(null); // Khởi tạo ref
  //Sửa dropdowwn trên avater
  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navItems = ["home", "pages", "meals", "recharge", "faq", "features"];

  return (
    <Navbar
      className={`sticky top-0 z-10 h-max max-w-full rounded-none border-0 px-4 transition-all duration-300 lg:px-4 ${isScrolled
          ? "bg-transparent backdrop-blur-md"
          : "bg-gradient-to-r from-purple-700 to-blue-700"
        }`}
    >
      <div className={`flex items-center justify-between ${isScrolled ? "text-black" : "text-white"} px-4`}>
        <NavLink to="/">
          <img
            src="/images/LogoA.png"
            alt="LogoA"
            className="w-20 h-auto object-contain transition-transform duration-500 ease-in-out hover:scale-110"
          />
        </NavLink>

        <div className="relative">
          <Button
            variant="text"
            size="sm"
            className="flex items-center gap-1 text-white hover:text-gray-300"
            onMouseEnter={() => setShowDropdown(true)}
          >
            <Widgets className="w-5 h-5" />
            <ArrowDropDown className="w-5 h-5" />
          </Button>
          {showDropdown && (
            <div
              className="absolute left-0 top-full mt-2 w-[1000px] bg-white text-black shadow-lg rounded-md p-6 z-50"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="flex">
                <div className="w-1/4 pr-6 border-r">
                  <h2 className="font-semibold text-gray-800 mb-4 text-lg">Danh mục sản phẩm</h2>
                  <ul className="space-y-3 text-gray-700 font-medium text-base">
                    {Object.keys(categoriesContent).map((category) => (
                      <li
                        key={category}
                        className={`hover:bg-gray-200 p-2 rounded cursor-pointer ${activeCategory === category ? "bg-gray-300" : ""
                          }`}
                        onMouseEnter={() => setActiveCategory(category)}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-3/4 pl-6">
                  <h2 className="text-red-600 font-semibold mb-4 text-lg">{activeCategory}</h2>
                  {categoriesContent[activeCategory]}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">
            <ul className="mt-2 mb-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navItems.map((item) => (
                <Typography
                  key={item}
                  as="li"
                  variant="small"
                  className="p-1 font-medium tracking-wide"
                >
                  <NavLink
                    to={`/${item === 'home' ? 'home' : item}`}
                    className={({ isActive }) => `
                      flex items-center justify-center px-4 py-2 transition-all
                      ${isActive ? `${isScrolled ? 'text-black' : 'text-white'} font-semibold border-b-2 border-current` : `${isScrolled ? 'text-black' : 'text-gray-100'}`}
                      hover:border-b-2 uppercase
                    `}
                  >
                    {item.toUpperCase()}
                  </NavLink>
                </Typography>
              ))}
            </ul>
          </div>
          <SearchWrapper />
          {isLoggedIn ? (
            <div
              // onMouseEnter={() => setIsDropdownOpen(true)}
              // onMouseLeave={() => setIsDropdownOpen(false)}
              ref={dropdownRef}
              className="relative"
            >
              <div onClick={toggleDropdown} className="flex items-center cursor-pointer">
                <img
                  src="https://via.placeholder.com/50" // Hình ảnh mặc định
                  alt="User Avatar"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <span
                  className={`${isScrolled ? "text-black" : "text-white"
                    } ml-2 font-medium`}
                >
                  My Account
                </span>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-black z-10">
                  {userRole === 'Admin' && (
                    <NavLink
                      to="/admin-dashboard" // Change to your admin page
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                  <NavLink
                    to="/add-recipe"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Add a recipe
                  </NavLink>
                  <NavLink
                    to="/update-account"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    My Profile
                  </NavLink>
                  <div
                    className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-x-1">
              <Button
                variant="text"
                size="sm"
                className={`hidden lg:inline-block ${isScrolled ? "text-black" : "text-white"}`}
              >
                <NavLink to="/login">Log In</NavLink>
              </Button>
              <Button
                variant="gradient"
                size="sm"
                className={`hidden lg:inline-block ${isScrolled ? "bg-gray-300 text-white" : "bg-custom-gradient text-white"}`}
              >
                <NavLink to="/signup">Sign Up</NavLink>
              </Button>
            </div>
          )}

          <IconButton
            variant="text"
            className={`ml-auto h-6 w-6 ${isScrolled ? "text-black" : "text-gray-100"} hover:bg-gray-100 lg:hidden`}
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            aria-label="Toggle navigation"
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </IconButton>
        </div>
      </div>

      <Collapse open={openNav}>
        <ul className="flex flex-col items-center gap-y-2">
          {navItems.map((item) => (
            <Typography key={item} as="li" variant="small">
              <NavLink
                to={`/${item === 'home' ? 'home' : item}`}
                className={`flex justify-center text-lg font-medium ${isScrolled ? "text-black" : "text-white"}`}
              >
                {item.toUpperCase()}
              </NavLink>
            </Typography>
          ))}
        </ul>
        <div className="flex items-center gap-x-1">
          {isLoggedIn ? (
            <>
              <div className="w-full">
                <NavLink to="/user-collection" className="block px-4 py-2">
                  My Collection
                </NavLink>
                <NavLink to="/update-account" className="block px-4 py-2">
                  Update Account
                </NavLink>
                <Button
                  fullWidth
                  variant="text"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button fullWidth variant="text" size="sm">
                <NavLink to="/login">Log in</NavLink>
              </Button>
              <Button fullWidth variant="gradient" size="sm">
                <NavLink to="/signup">Sign up</NavLink>
              </Button>
            </>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
}

export default StickyNavbar;
