import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const AccountManagement = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notifications = ["Notification 1", "Notification 2"];
  
  const location = useLocation();
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/Customer', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        console.log('Response data:', response.data);
           {/* Error Old Code To Check Array Data */}
//      const customersData = Array.isArray(response.data.value) ? response.data.value : [];
        const customersData = Array.isArray(response.data) ? response.data : [];
        console.log('Extracted customers:', customersData);
        setCustomers(customersData);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCustomers();
  }, []);
  
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

        {/* Main Account Management */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 bg-orange-400 flex justify-between items-center">
            <h1 className="text-white text-xl">Account Management</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="rounded-md px-3 py-2 text-gray-800 pr-10" 
                  name="accountSearch"
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

          {/* Customer Data Display */}
          <div className="p-4">
            {loading && <p>Loading customers...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && customers.length ===  0 && <p>No customers found.</p>}
            {!loading && !error && customers.length > 0 && (
              <ul className="space-y-2">
                {customers.map(customer => (
                  <li key={customer.customerId} className="bg-white shadow p-3 rounded">
                    <h3 className="font-semibold">{customer.userName}</h3>
                    <p>Email: {customer.email}</p>
                    <p>Phone: {customer.phoneNumber || 'N/A'}</p>
                    <p>Account Status: {customer.accountStatus ? (customer.accountStatus === 1 ? 'Active' : 'Inactive') : 'N/A'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountManagement;


