import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';

const IncomeManagement = () => {
  const [chartData, setChartData] = useState([]);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Static data for the chart
    const staticData = [
      { name: 'Week 1', income: 1200000 },
      { name: 'Week 2', income: 2100000 },
      { name: 'Week 3', income: 1800000 },
      { name: 'Week 4', income: 2500000 },
    ];
    setChartData(staticData);
  }, []);

  const notifications = ["None"];

  return (
    <div className="flex flex-col min-h-screen font-roboto">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`bg-white text-black flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-1/5' : 'w-16'}`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <div className="p-2 flex justify-center">
            <img src="/images/Logo.png" alt="Logo" className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} w-40`} />
          </div>
          <nav className="mt-10">
            {["Dashboard", "Account Management", "Income Management", "Feedback & Comments", "Reports", "Category Management","Recipe Management"].map((item, index) => {
              let path;
              switch (item) {
                case "Account Management":
                  path = '/admin/account-management';
                  break;
                case "Income Management":
                  path = '/admin/income-management';
                  break;
                case "Category Management":
                  path = '/admin/category-management';
                  break;
                default:
                  path = `/admin/${item.replace(/ /g, '').toLowerCase()}`;
              }

              return (
                <div key={index}>
                  <Link 
                    to={path} 
                    className={`block py-2.5 px-4 rounded transition-colors duration-200 
                      ${location.pathname === path ? 
                        "text-orange-500 font-semibold border-b-2 border-orange-500" : 
                        "text-black"}`}
                    style={{ opacity: isSidebarOpen ? 1 : 0 }} // Hide text when sidebar is collapsed
                  >
                    {isSidebarOpen ? item : <span className="text-transparent">{item.charAt(0)}</span>} {/* Only show first letter when closed */}
                  </Link>
                  {isSidebarOpen && <div className={`border-b border-gray-300 ${item !== "Reports" ? "mb-2" : ""}`} />}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Income Management */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 bg-white flex justify-between items-center">
            <h1 className="text-orange-500 text-xl font-bold">Income Management</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="rounded-md px-3 py-2 text-gray-800 pr-10" 
                  name="incomeSearch" 
                />
                <button className="absolute right-0 top-0 bottom-0 text-black rounded-r-md px-3 flex items-center">
                  <FaSearch />
                </button>
              </div>
              <div className="relative">
                <button className="text-black flex items-center" onClick={() => setNotificationOpen(!isNotificationOpen)}>
                  <IoIosNotifications size={24} />
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    <ul className="space-y-1">
                      {notifications.map((notification, index) => (
                        <li key={index} className="text-gray-700">{notification}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="text-black flex items-center">
                <div className="ml-2 font-bold">Admin1</div>
              </div>
            </div>
          </header>

          <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Income Report</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available for the chart.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default IncomeManagement;