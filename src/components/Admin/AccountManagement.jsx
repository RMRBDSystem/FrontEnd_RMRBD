import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { IoIosNotifications } from 'react-icons/io';

// Add Customer Modal Component
const AddCustomerModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({ userName: '', email: '', phoneNumber: '', accountStatus: 1, googleId: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(formData);
    resetForm();
    onClose();
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ userName: '', email: '', phoneNumber: '', accountStatus: 1, googleId: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="userName" className="block">Username</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="phoneNumber" className="block">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="googleId" className="block">Google ID</label>
            <input
              id="googleId"
              type="text"
              name="googleId"
              value={formData.googleId}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Customer Modal Component
const EditCustomerModal = ({ isOpen, onClose, onEdit, customer }) => {
  const [formData, setFormData] = useState({ userName: '', email: '', phoneNumber: '', accountStatus: 1, googleId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({ 
        userName: customer.userName, 
        email: customer.email, 
        phoneNumber: customer.phoneNumber, 
        accountStatus: customer.accountStatus,
        googleId: customer.googleId || ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onEdit(customer.customerId, formData);
    onClose();
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Edit Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="userName" className="block">Username</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="phoneNumber" className="block">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="googleId" className="block">Google ID</label>
            <input
              id="googleId"
              type="text"
              name="googleId"
              value={formData.googleId}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-orange-400 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Account Management Component
const AccountManagement = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const notifications = ["Notification 1", "Notification 2"];
  
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/Customer', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        const customersData = Array.isArray(response.data) ? response.data : [];
        setCustomers(customersData);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCustomers();
  }, []);

  const handleEdit = async (id, updatedData) => {
    try {
      const updatedCustomerData = {
        userName: updatedData.userName,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber,
        accountStatus: updatedData.accountStatus,
        googleId: updatedData.googleId || null,
      };
  
      const response = await axios.put(`https://rmrbdapi.somee.com/odata/Customer/${id}`, updatedCustomerData, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
  
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.customerId === id ? response.data : customer
        )
      );
      console.log("Update successful:", response.data);
    } catch (error) {
      setError(error.response ? error.response.data : "Failed to update customer.");
      console.error("Error updating customer:", error);
    }
  };
  
  const handleAdd = async (newCustomer) => {
    try {
      const response = await axios.post('https://rmrbdapi.somee.com/odata/Customer', newCustomer, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
      setCustomers(prevCustomers => [...prevCustomers, response.data]);
      console.log("Customer added:", response.data);
    } catch (error) {
      setError(error.response ? error.response.data : "Failed to add customer.");
      console.error(error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const userNameMatch = customer.userName && customer.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = customer.phoneNumber && customer.phoneNumber.includes(searchQuery);
    return userNameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="flex flex-col min-h-screen font-roboto">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
          className={`transition-all duration-300 ${sidebarOpen ? 'w-1/5 bg-white' : 'w-16 bg-white'} text-black flex flex-col`}
        >
          <div className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-4 flex justify-center">
              <img src="/src/assets/Logo.png" alt="Logo" className="w-40" />
            </div>
          </div>
          
          <nav className="mt-10 flex flex-col">
            {["Dashboard", "Account Management", "Income Management", "Feedback & Comments", "Reports", "Category Management","Recipe Management"].map((item, index) => {
                let path;
                switch (item) {
                case "Account Management":
                    path = '/admin/account-management'; // Path for Account Management
                    break;
                case "Income Management":
                    path = '/admin/income-management'; // Path for Income Management
                    break;
                case "Category Management":
                    path = '/admin/category-management'; // Path for Category Management
                    break;
                default:
                    path = `/admin/${item.replace(/ /g, '').toLowerCase()}`; // Path for other items
                }
                
                return (
                <div key={index} className={`relative ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <Link 
                    to={path} 
                    className={`block py-2.5 px-4 rounded 
                        ${location.pathname === path ? 
                        "text-orange-500 font-semibold border-b-2 border-orange-500" : 
                        "text-black"}`}
                    >
                    {item}
                    </Link>
                </div>
                );
            })}
            </nav>
        </div>

        {/* Main Account Management */}
        <main className="flex-1 bg-gray-50 flex flex-col">
        <header className="p-4 bg-white flex justify-between items-center">
          <h1 className="text-orange-500 text-xl font-bold">Account Management</h1>
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              id="search-input"
              placeholder="Search..." 
              className="rounded-md px-3 py-2 text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="text-black flex items-center relative">
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

          <div className="p-4">
            <button onClick={() => setAddCustomerModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">
              Add Customer
            </button>
          </div>

          {/* Customers List */}
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-center">#</th>
                    <th className="py-2 px-4 border-b text-center">Username</th>
                    <th className="py-2 px-4 border-b text-center">Email</th>
                    <th className="py-2 px-4 border-b text-center">Phone Number</th>
                    <th className="py-2 px-4 border-b text-center">Account Status</th>
                    <th className="py-2 px-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={customer.customerId}>
                      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-center">{customer.userName}</td>
                      <td className="py-2 px-4 border-b text-center">{customer.email}</td>
                      <td className="py-2 px-4 border-b text-center">{customer.phoneNumber}</td>
                      <td className="py-2 px-4 border-b text-center">{customer.accountStatus === 1 ? 'Active' : 'Inactive'}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button onClick={() => { setSelectedCustomer(customer); setEditCustomerModalOpen(true); }} className="bg-orange-400 text-white px-2 py-1 rounded">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={addCustomerModalOpen}
        onClose={() => setAddCustomerModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={editCustomerModalOpen}
        onClose={() => setEditCustomerModalOpen(false)}
        onEdit={handleEdit}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default AccountManagement;