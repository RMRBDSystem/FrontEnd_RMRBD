import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaMoneyBill, FaComments, FaChartBar, FaList, FaUtensils } from 'react-icons/fa';

const Sidebar = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin/dashboard', icon: FaHome, label: 'Tổng Quan' },
    { path: '/admin/income-management', icon: FaMoneyBill, label: 'Quản Lý Thu Nhập' },
    { path: '/admin/category-management', icon: FaList, label: 'Quản Lý Danh Mục' },
  ];

  const handleMouseEnter = () => {
    if (!isOpen) {
      onMouseEnter();
    }
  };

  const handleMouseLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isActuallyLeaving = 
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (isActuallyLeaving) {
      onMouseLeave();
    }
  };

  return (
    <aside 
      className={`bg-white text-black flex flex-col fixed h-screen transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      } shadow-lg z-50`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <div className="p-4 flex justify-center overflow-hidden">
        <img 
          src="/images/Logo.png" 
          alt="Logo" 
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'w-40' : 'w-8'
          } object-contain`}
          style={{
            maxWidth: isOpen ? '160px' : '32px',
            opacity: 1
          }}
        />
      </div> */}

      <nav className="mt-8 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`
                flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500
                ${isActive ? 'bg-orange-50 text-orange-500 border-r-4 border-orange-500' : ''}
                transition-all duration-200 whitespace-nowrap
              `}
            >
              <Icon className={`text-xl ${isOpen ? 'mr-4' : 'mx-auto'}`} />
              <span 
                className={`transition-all duration-300 ${
                  isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                } overflow-hidden`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar; 