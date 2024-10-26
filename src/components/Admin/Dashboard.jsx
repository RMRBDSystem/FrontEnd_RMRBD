import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoIosNotifications } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io"; 
import AccountManagement from './AccountManagement';
import IncomeManagement from './IncomeManagement';
import ProductManagement from './ProductManagement';
import Delivery from './Delivery';
import Reports from './Reports';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Dashboard = () => {
  const location = useLocation();
  const [chartData, setChartData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const hardcodedData = [
      { name: 'Week 1', uv: 2000, pv: 4000 },
      { name: 'Week 2', uv: 4000, pv: 1398 },
      { name: 'Week 3', uv: 2000, pv: 9800 },
      { name: 'Week 4', uv: 2780, pv: 3908 }
    ];
    setChartData(hardcodedData);
  }, []);

  const handleSearch = useCallback(
    debounce((query) => {
      console.log('Searching for:', query);
      // Here you would typically call an API to fetch search results
    }, 300),
    []
  );

  const handleChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const newUsers = ["User 1", "User 2", "User 3", "User 4", "User 5"];
  const notifications = ["Notification 1", "Notification 2", "Notification 3"];

  const totalEarnings = 1500000; 
  const totalExpenses = -200000;
  const netProfit = totalEarnings + totalExpenses; 
  const totalTransactions = 150; 

  

  return (
    <div className="flex flex-col min-h-screen font-roboto">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/5 bg-white text-black flex flex-col">
          <div className="p-4 flex justify-center">
            <img src="/src/assets/Logo.png" alt="Logo" className="w-40" />
          </div>
          <nav className="mt-10">
            {["Dashboard", "Account Management", "Income Management", "Product Management", "Feedback & Comments", "Reports", "Delivery Management"].map((item, index) => (
              <div key={index}>
                <Link 
                  to={`/${item.replace(/ /g, '').toLowerCase()}`} 
                  className={`block py-2.5 px-4 rounded ${location.pathname === `/${item.replace(/ /g, '').toLowerCase()}` ? "text-orange-500 font-semibold border-b-2 border-orange-500" : "text-black"}`}>
                  {item}
                </Link>
                <div className={`border-b border-gray-300 ${item !== "Delivery Management" ? "mb-2" : ""}`} />
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Dashboard */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 bg-orange-400 flex justify-between items-center">
            <h1 className="text-white text-xl">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="rounded-md px-3 py-2 text-gray-800 pr-10" 
                  name="dashboardSearch"
                  value={searchQuery}
                  onChange={handleChange} // Use the debounced search
                />
                <button className="absolute right-0 top-0 bottom-0 text-black rounded-r-md px-3 flex items-center">
                  <FaSearch />
                </button>
              </div>
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-white flex items-center relative">
                <IoIosNotifications size={24} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">{notifications.length}</span>
                )}
              </button>
              <div className="text-white flex items-center">
                <div className="ml-2">Admin1</div>
              </div>
            </div>
          </header>

          {showNotifications && (
            <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
              <h2 className="font-semibold mb-2">Notifications</h2>
              {notifications.length > 0 ? (
                <ul className="space-y-1">
                  {notifications.map((note, index) => (
                    <li key={index} className="text-gray-800">{note}</li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}

          <Routes>
            <Route path="/accountmanagement" element={<AccountManagement />} />
            <Route path="/incomemanagement" element={<IncomeManagement />} />
            <Route path="/productmanagement" element={<ProductManagement />} />
            <Route path="/deliverymanagement" element={<Delivery />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={
              <>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Total Earnings</h2>
                    <p className={`text-xl font-bold ${totalEarnings > 0 ? 'text-green-500' : (totalEarnings < 0 ? 'text-red-500' : 'text-black')}`}>
                      ₫{totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
                    <p className={`text-xl font-bold ${totalExpenses > 0 ? 'text-green-500' : (totalExpenses < 0 ? 'text-red-500' : 'text-black')}`}>
                      ₫{totalExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Net Profit</h2>
                    <p className={`text-xl font-bold ${netProfit > 0 ? 'text-green-500' : (netProfit < 0 ? 'text-red-500' : 'text-black')}`}>
                      ₫{netProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Total Transactions</h2>
                    <p className="text-xl font-bold">{totalTransactions}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 shadow-md rounded-lg col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Monthly Recap Report</h2>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="pv" fill="#8884d8" />
                          <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p>Loading chart data...</p>
                    )}
                  </div>

                  <div className="bg-white shadow-md rounded-lg">
                    <h2 className="bg-orange-400 text-white text-lg font-semibold p-4 rounded-t-lg">New Users</h2>
                    <div className="space-y-2 p-4">
                      {newUsers.map((user, index) => (
                        <div key={index}>
                          <div className="flex items-center">
                            <div className="bg-gray-400 w-10 h-10 rounded-full"></div>
                            <span className="ml-4">{user}</span>
                          </div>
                          <div className="border-b border-gray-300 my-2"></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="bg-orange-400 p-2 rounded-full flex items-center cursor-pointer" onClick={() => setModalOpen(true)}>
                        <IoIosArrowDown className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setModalOpen(false)} />
                    <div className="bg-white p-4 rounded-lg w-1/3 relative z-10">
                      <h2 className="text-lg font-semibold mb-4">All New Users</h2>
                      <ul className="space-y-2">
                        {newUsers.map((user, index) => (
                          <li key={index} className="p-2 border-b">{user}</li>
                        ))}
                      </ul>
                      <button className="mt-4 bg-orange-400 text-white p-2 rounded" onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                  </div>
                )}
              </>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
