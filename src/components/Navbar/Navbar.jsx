import React from "react";
import { NavLink,useNavigate } from "react-router-dom";
import LogoA from "../../assets/LogoA.png";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useAuth } from "../RouterPage/AuthContext";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
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
  const navigate = useNavigate();
  const userRole = Cookies.get("UserRole");
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://localhost:7220/odata/Login/logout",
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
      Cookies.remove("UserId");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("UserRole");
      navigate("/homepageDashboard");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {["home", "pages", "meals", "cuisines", "faq", "features"].map((item) => (
        <Typography
          key={item}
          as="li"
          variant="small"
          className="p-1 font-medium tracking-wide"
        >
          <NavLink
            to={`/${item === "home" ? "homepageDashboard" : item}`}
            className={({ isActive }) => `
              flex items-center justify-center px-4 py-2 transition-all
              ${
                isActive
                  ? `${
                      isScrolled ? "text-black" : "text-white"
                    } font-semibold border-b-2 border-current`
                  : `${isScrolled ? "text-black" : "text-gray-100"}`
              }
              hover:border-b-2 uppercase
            `}
          >
            {item.toUpperCase()}
          </NavLink>
        </Typography>
      ))}
    </ul>
  );

  return (
    <Navbar
      className={`sticky top-0 z-10 h-max max-w-full rounded-none border-0 px-4 transition-all duration-300 lg:px-8 ${
        isScrolled
          ? "bg-transparent backdrop-blur-md"
          : "bg-gradient-to-r from-purple-700 to-blue-700"
      }`}
    >
      <div
        className={`flex items-center justify-between ${
          isScrolled ? "text-black" : "text-white"
        } px-4`}
      >
        <NavLink to="/">
          <img
            src={LogoA}
            alt="LogoA"
            className="w-20 h-auto object-contain transition-transform duration-500 ease-in-out hover:scale-110"
          />
        </NavLink>
        <div className="flex items-center gap-4">
          <div className="mr-14 hidden lg:block">{navList}</div>
          <div className="relative flex items-center gap-x-1">
            {isLoggedIn ? (
              <div
              ref={dropdownRef}
                // onMouseEnter={() => setIsDropdownOpen(true)}
                // onMouseLeave={() => setIsDropdownOpen(false)}
                className="relative"
              >
                <div onClick ={toggleDropdown} className="flex items-center cursor-pointer">
                  <img
                    src="https://via.placeholder.com/50" // Hình ảnh mặc định
                    alt="User Avatar"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span
                    className={`${
                      isScrolled ? "text-black" : "text-white"
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
              <>
                <Button
                  variant="text"
                  size="sm"
                  className={`hidden lg:inline-block ${
                    isScrolled ? "text-black" : "text-white"
                  }`}
                >
                  <NavLink to="/login">Log in</NavLink>
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  className={`hidden lg:inline-block ${
                    isScrolled
                      ? "bg-gray-300 text-white"
                      : "bg-custom-gradient text-white"
                  }`}
                >
                  <NavLink to="/signup">Sign up</NavLink>
                </Button>
              </>
            )}
            <IconButton
              variant="text"
              className={`ml-auto h-6 w-6 ${
                isScrolled ? "text-black" : "text-gray-100"
              } hover:bg-gray-100 lg:hidden`}
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
              aria-label="Toggle Navigation"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
      </div>
      <MobileNav open={openNav}>
        {navList}
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
      </MobileNav>
    </Navbar>
  );
}

export default StickyNavbar;
