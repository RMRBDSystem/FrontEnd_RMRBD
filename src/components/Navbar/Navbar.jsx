import React, { useState, useEffect } from "react";
import LogoA from '/images/LogoA.png';
import { NavLink, Link, useNavigate } from "react-router-dom";
import NavLinks from './NavLinks';
import { leftLinks } from '../../data/data';
import { rightLinks } from '../../data/data';
import { Button, IconButton } from "@material-tailwind/react";
import SearchWrapper from "./SearchWrapper";
import { Widgets, ArrowDropDown } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../RouterPage/AuthContext";
import Notification from "/images/notification.svg";
import "./navbar.css"
import { useSocket } from "../../App"
import { getNotificationbyAccountId } from "../services/NotificationService"
const categoriesContent = {
  "Cooking Recipes": (
    <div className="grid grid-cols-3 gap-6 text-gray-700">
      <div>
        <h3 className="font-semibold text-base">MAIN DISHES</h3>
        <ul className="space-y-1 text-sm">
          <li>Braised Pork Belly</li>
          <li>Braised Fish in Clay Pot</li>
          <li>Honey Grilled Chicken</li>
          <li>Beef Pho</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">SOUPS</h3>
        <ul className="space-y-1 text-sm">
          <li>Sour Snakehead Fish Soup</li>
          <li>Bitter Melon Stuffed Soup</li>
          <li>Cabbage Roll Soup</li>
          <li>Seaweed Soup</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">SNACKS</h3>
        <ul className="space-y-1 text-sm">
          <li>Steamed Rice Rolls</li>
          <li>Spring Rolls</li>
          <li>Vietnamese Pancakes</li>
          <li>Mini Pancakes</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
    </div>
  ),
  "Cooking Books": (
    <div className="grid grid-cols-3 gap-6 text-gray-700">
      <div>
        <h3 className="font-semibold text-base">VIETNAMESE CUISINE</h3>
        <ul className="space-y-1 text-sm">
          <li>Pho and Noodle Dishes</li>
          <li>Central Vietnam Specialties</li>
          <li>Traditional Dishes</li>
          <li>Vietnamese Desserts</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">INTERNATIONAL CUISINE</h3>
        <ul className="space-y-1 text-sm">
          <li>Japanese Dishes</li>
          <li>Korean Cuisine</li>
          <li>Italian Dishes</li>
          <li>French Dishes</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">VEGETARIAN & HEALTH</h3>
        <ul className="space-y-1 text-sm">
          <li>Basic Vegetarian Dishes</li>
          <li>Salads & Juices</li>
          <li>Healthy Eating Plans</li>
          <li>Low-Calorie Recipes</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
    </div>
  ),
  "E-Book Library": (
    <div className="grid grid-cols-3 gap-6 text-gray-700">
      <div>
        <h3 className="font-semibold text-base">RECIPE BOOKS</h3>
        <ul className="space-y-1 text-sm">
          <li>Vietnamese Recipes</li>
          <li>Asian Recipes</li>
          <li>European Recipes</li>
          <li>Dessert Recipes</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">COOKING TECHNIQUES</h3>
        <ul className="space-y-1 text-sm">
          <li>Grilling Recipes</li>
          <li>Stir-Frying Techniques</li>
          <li>Baking Practices</li>
          <li>Ingredient Preparation</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-base">HEALTH & NUTRITION</h3>
        <ul className="space-y-1 text-sm">
          <li>Daily Nutrition</li>
          <li>Weight Loss Meal Plans</li>
          <li>Child Nutrition Plans</li>
          <li>Sports Nutrition</li>
          <li className="text-blue-500">View All</li>
        </ul>
      </div>
    </div>
  ),
};


const Navbar = () => {

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [stickyNavbar, setStickyNavbar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Cooking Books");
  const navigate = useNavigate();
  const userRole = Cookies.get("UserRole");
  const accountonlineId = Cookies.get("UserId");

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyNavbar]);

  const handleScroll = () => {
    setStickyNavbar(window.pageYOffset > 800);
  };
  //Notification
  const { socket } = useSocket(); // Access `socket` and `user` from context
  const [notifications, setNotifications] = useState([]);
  const [dbnotifications, setDbNotifications] = useState([]);
  //const [lengthnotifications, setLengthnotifications] = useState(0);
  const [open, setOpen] = useState(null);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        // Lấy dữ liệu từ API
        const notificationdata = await getNotificationbyAccountId(accountonlineId);
        setDbNotifications(notificationdata);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotification();
  }, [accountonlineId]);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });
    }
  }, [socket])


  const displayNotification = ({ content }) => {
    return (
      <div className="notification-item">
        <span className="notification-content">{`${content}`}</span>
        <hr style={{ margin: "10px 0", borderColor: "black", borderStyle: "solid" }} />
      </div>
    )
  }
  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  }
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "Cooking Books") {
      navigate("/book")
    }
    if (category == "Cooking Recipes") {
      navigate("/recipe")
    }
    if (category == "E-Book Library") {
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
      Cookies.remove("UserId");
      Cookies.remove("Coin");
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const dropdownRef = React.useRef(null); // Khởi tạo ref
  //Sửa dropdowwn trên avatar
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
  return (
      <nav
        className={`text-center z-50 w-full absolute ${stickyNavbar
          ? 'font-expletus animate-fade-in-down sticky top-0 bg-gray-900 shadow-sm'
          : ''
          }`}
      >
        <div
          className={`section-center flex items-center justify-between lg:justify-center lg:space-x-32 sticky text-center z-50 w-full ${stickyNavbar ? 'py-4' : ''
            }`}
        >
          <ul className="nav-links-container">
            <NavLinks links={leftLinks} setIsMenuOpen={setIsMenuOpen} />
            <Button
              variant="text"
              title={"Categories"}
              size="sm"
              className="flex items-center gap-1 text-gray-50 hover:text-green-500"
              onMouseEnter={() => setShowDropdown(true)}
            >
              <Widgets />
              <ArrowDropDown />
            </Button>
            {showDropdown && (
              <div
                className="absolute left-0 top-full mt-2 w-[1000px] bg-white text-black shadow-lg rounded-md p-6 z-50"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="flex">
                  <div className="w-1/4 pr-6 border-r">
                    <h2 className="font-semibold text-gray-800 mb-4 text-lg">Product Catalog</h2>
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
            {accountonlineId && (
              <div className="icon">
                <div className="icon" onClick={() => setOpen((prev) => !prev)}>
                  <img className="w-8 h-8" src={Notification} alt="Notification Icon" />
                  {notifications.length > 0 && (
                    <div className="counter">{notifications.length}</div>
                  )}
                </div>
                {open && (
                  <div className="notifications">
                    <div className="topnav-dropdown-header">
                      <span className="notification-title">Thông báo</span>
                      <button className="clear-noti" onClick={handleRead}>
                        Đọc tất cả
                      </button>
                    </div>
                    {notifications.map((n) => displayNotification(n))}

                    {dbnotifications
                      .map((notification) => {
                        const notificationDate = new Date(notification.date); // Convert date string to Date object
                        const now = Date.now(); // Current timestamp
                        const differenceInMs = now - notificationDate.getTime(); // Time difference in ms
                        const minutesPassed = Math.floor(differenceInMs / (1000 * 60)); // Convert ms to minutes
                        const hoursPassed = Math.floor(minutesPassed / 60); // Convert minutes to hours
                        const daysPassed = Math.floor(hoursPassed / 24); // Convert hours to days

                        return { ...notification, minutesPassed, hoursPassed, daysPassed }; // Add `daysPassed`
                      })
                      .sort((a, b) => a.minutesPassed - b.minutesPassed) // Sort by `minutesPassed`
                      .map((notification, index) => (
                        <div key={notification.id || index} className="notification-item" style={{ fontWeight: 300 }}>
                          <div className="notification-content">{notification.content}</div>
                          <div className="notification-time">
                            {notification.daysPassed >= 1
                              ? `${notification.daysPassed} ngày trước` // If more than 1 day
                              : notification.hoursPassed >= 1
                                ? `${notification.hoursPassed} giờ trước` // If more than 1 hour
                                : `${notification.minutesPassed} phút trước`} {/* If less than 1 hour */}
                          </div>
                          <hr style={{ margin: "10px 0", borderColor: "black", borderStyle: "solid" }} />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </ul>
          <Link
            to="/"
            aria-label="Recipe RMRBD"
            title="Recipe RMRBD"
            className="inline-flex items-center"
          >
            <img href="/" src={LogoA} className="object-contain h-16 w-18" alt="company logo" />
          </Link>
          <ul className="nav-links-container">
            <SearchWrapper />
            <NavLinks links={rightLinks} setIsMenuOpen={setIsMenuOpen} />
            {isLoggedIn ? (
              <div
                ref={dropdownRef}
                className="relative"
              >
                <div onClick={toggleDropdown} className="flex items-center cursor-pointer">
                  <img
                    src="/images/avatar.png" // Hình ảnh mặc định
                    alt="User Avatar"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span
                    className={`text-white ml-2 font-medium`}
                  >
                    My Account
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-black z-10">
                    {userRole === "Admin" && (
                      <>
                        <NavLink
                          to="/admin-dashboard" // Change to your admin page
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          Admin Dashboard
                        </NavLink>
                      </>
                    )}
                    {userRole === "Customer" && (
                      <>
                        <NavLink
                          to="/update-account"
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          My Profile
                        </NavLink>
                        <NavLink
                          to="/list-saved-recipe"
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          My Collection
                        </NavLink>
                      </>
                    )}
                    {userRole === "Moderator" && (
                      <>
                        <NavLink
                          to="/update-role"
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          Account moderate
                        </NavLink>
                      </>
                    )}
                    {userRole === "Seller" && (
                      <>
                        <NavLink
                          to="/recipe-customer-list"
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          Seller Recipe
                        </NavLink>
                        <NavLink
                          to="/add-recipe"
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          Add a Recipe
                        </NavLink>
                        <NavLink
                          to="/list-saved-recipe"
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          My Collection
                        </NavLink>
                      </>
                    )}
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
                  variant="gradient"
                  size="sm"
                  className={`hidden lg:inline-block bg-gray-300 text-white`}
                >
                  <NavLink to="/login">Log In</NavLink>
                </Button>
              </div>
            )}

            <IconButton
              variant="text"
              className={`ml-auto h-6 w-6 text-black hover:bg-gray-100 lg:hidden`}
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
          </ul>
          <div className="lg:hidden">
            <button
              aria-label="Open Menu"
              title="Open Menu"
              className="p-2 -mr-1 transition duration-200 rounded hover:scale-125"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg className="w-5 text-black sm:w-8w" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
                />
                <path
                  fill="currentColor"
                  d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
                />
                <path
                  fill="currentColor"
                  d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="animate-fade-in-down absolute top-0 left-0 w-full text-black bg-green-50 text-left p-5  border rounded shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Link
                      to="/"
                      aria-label="Recipe RMRBD"
                      title="Recipe RMRBD"
                      className="inline-flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img
                        src={LogoA}
                        className="w-5 h-5"
                        alt="company logo"
                      />
                      <span className="company-name">Recipe RMRBD</span>
                    </Link>
                  </div>
                  <div>
                    <button
                      aria-label="Close Menu"
                      title="Close Menu"
                      className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 text-gray-600" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <nav>
                  <ul className="space-y-4">
                    <NavLinks links={leftLinks} setIsMenuOpen={setIsMenuOpen} />
                    <NavLinks
                      links={rightLinks}
                      setIsMenuOpen={setIsMenuOpen}
                    />
                    <div className="flex items-center gap-x-1">
                      {isLoggedIn ? (
                        <>
                          <div className="w-full">
                            <NavLink to="/list-saved-recipe" className="block px-4 py-2">
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
                        </>
                      )}
                    </div>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
