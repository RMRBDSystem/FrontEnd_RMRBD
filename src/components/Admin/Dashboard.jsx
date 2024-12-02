import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoIosNotifications } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import axios from 'axios';

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
  const [newUsers, setNewUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(1500000);
  const [totalExpenses, setTotalExpenses] = useState(-200000);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/Customer', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        setNewUsers(response.data);
      } catch (error) {
        console.error('Error fetching new users:', error);
      }
    };

    fetchNewUsers();
  }, []);

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
    }, 300),
    []
  );

  const handleChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const netProfit = totalEarnings + totalExpenses; 
  const totalTransactions = 150; 

  return (
    <div className="flex flex-col min-h-screen">
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
            {["Dashboard", "Account Management", "Income Management", "Feedback & Comments", "Reports", "Category Management","Recipe Management"].map((item, index) => (
              <div key={index}>
                <Link 
                  to={`/admin/${item.replace(/ & /g, '-').replace(/ /g, '-').toLowerCase()}`} 
                  className={`block py-2.5 px-4 rounded transition-colors duration-200 
                    ${location.pathname === `/admin/${item.replace(/ & /g, '-').replace(/ /g, '-').toLowerCase()}` ? 
                      "text-orange-500 font-semibold border-b-2 border-orange-500" : 
                      "text-black"}`}
                  style={{ opacity: isSidebarOpen ? 1 : 0 }} // Hide text when sidebar is collapsed
                >
                  {isSidebarOpen ? item : <span className="text-transparent">{item.charAt(0)}</span>} {/* Only show first letter when closed */}
                </Link>
                {isSidebarOpen && <div className={`border-b border-gray-300 ${item !== "Reports" ? "mb-2" : ""}`} />}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Dashboard */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 flex justify-between items-center">
            <h1 className="text-orange-500 text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="rounded-md px-3 py-2 text-gray-800 pr-10" 
                  name="dashboardSearch"
                  value={searchQuery}
                  onChange={handleChange}
                />
                <button className="absolute right-0 top-0 bottom-0 text-black rounded-r-md px-3 flex items-center">
                  <FaSearch />
                </button>
              </div>
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-black flex items-center relative">
                <IoIosNotifications size={24} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">{notifications.length}</span>
                )}
              </button>
              <div className="text-black flex items-center">
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
            {/* Specific Routes */}
            {/* Main Dashboard Route */}
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
                      {newUsers.length > 0 ? (
                        <>
                          {newUsers.slice(0, 7).map((user, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-gray-300 py-2">
                              <span>{user.userName}</span>
                              <button className="text-blue-500">View Profile</button>
                            </div>
                          ))}
                          <div className="flex items-center justify-between border-b border-gray-300 py-2 cursor-pointer" onClick={() => setShowAllUsers(!showAllUsers)}>
                            <span className="text-orange-500">See more...</span>
                            <IoChevronDown className={`text-orange-500 transition-transform ${showAllUsers ? 'rotate-180' : ''}`} />
                          </div>
                          {showAllUsers && (
                            <>
                              <div className="fixed inset-0 bg-black bg-opacity-80 z-40" onClick={() => setShowAllUsers(false)} />
                              <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-3/4 md:w-1/2">
                                <h3 className="bg-orange-400 text-white text-lg font-semibold p-4 rounded-t-lg">All New Users</h3>
                                <div className="p-4">
                                  <ul>
                                    {newUsers.map((user, index) => (
                                      <li key={index} className="py-2 border-b border-gray-300">{user.userName}</li>
                                    ))}
                                  </ul>
                                  <button className="mt-4 text-red-500" onClick={() => setShowAllUsers(false)}>Close</button>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <p>No new users available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;