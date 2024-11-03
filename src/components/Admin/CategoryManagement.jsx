import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const CategoryManagement = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [categories, setCategories] = useState([]);
  const [notifications] = useState(["Notification 1", "Notification 2"]);
  const [newCategory, setNewCategory] = useState({ Name: '', Status: 1 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/BookCategory', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async () => {
    try {
      const response = await axios.post('https://rmrbdapi.somee.com/odata/BookCategory', newCategory, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
      setCategories(prev => [...prev, response.data]);
      setNewCategory({ Name: '', Status: 1 });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id, updatedCategoryData) => {
    try {
      const response = await axios.put(`https://rmrbdapi.somee.com/odata/BookCategory/${id}`, updatedCategoryData, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
      setCategories(prev => prev.map(cat => (cat.categoryId === id ? response.data : cat)));
      setEditingCategoryId(null);
      setEditingCategoryName('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const startEditing = (categoryId, categoryName) => {
    setEditingCategoryId(categoryId);
    setEditingCategoryName(categoryName);
  };

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
            <img src="/src/assets/Logo.png" alt="Logo" className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} w-40`} />
          </div>
          <nav className="mt-10">
            {["Dashboard", "Account Management", "Income Management", "Feedback & Comments", "Reports", "Category Management"].map((item, index) => {
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

        {/* Main CategoryManagement */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 bg-gray-50 flex justify-between items-center shadow">
            <h1 className="text-orange-500 font-bold text-xl">Category Management</h1>
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

          {/* Add Category Form */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <form onSubmit={(e) => { e.preventDefault(); addCategory(); }}>
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  name="categoryName"
                  value={newCategory.Name}
                  onChange={(e) => setNewCategory({ ...newCategory, Name: e.target.value })}
                  className="border rounded-md p-2 flex-1"
                  required
                />
                <select
                  name="categoryStatus"
                  value={newCategory.Status}
                  onChange={(e) => setNewCategory({ ...newCategory, Status: parseInt(e.target.value) })}
                  className="border rounded-md p-2"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              <button type="submit" className="bg-orange-500 text-white rounded-md px-4 py-2">Add Category</button>
            </form>
          </div>

          {/* Category Table */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Manage Categories</h2>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-center">Category ID</th>
                  <th className="border border-gray-300 p-2 text-center">Name</th>
                  <th className="border border-gray-300 p-2 text-center">Status</th>
                  <th className="border border-gray-300 p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? categories.map((category) => (
                  <tr key={category.categoryId}>
                    <td className="border border-gray-300 p-2 text-center">{category.categoryId}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {editingCategoryId === category.categoryId ? (
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="border rounded-md p-1 w-full"
                        />
                      ) : (
                        category.name
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{category.status === 1 ? 'Active' : 'Inactive'}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {editingCategoryId === category.categoryId ? (
                        <>
                          <button onClick={() => updateCategory(category.categoryId, { ...category, Name: editingCategoryName })} className="text-green-500">Save</button>
                          <button onClick={() => setEditingCategoryId(null)} className="text-red-500 ml-2">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(category.categoryId, category.name)} className="text-blue-500">Edit</button>
                          <button onClick={() => updateCategory(category.categoryId, { ...category, Status: 1 })} className="text-blue-500 ml-2">Activate</button>
                          <button onClick={() => updateCategory(category.categoryId, { ...category, Status: 0 })} className="text-red-500 ml-2">Deactivate</button>
                        </>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="border border-gray-300 p-2 text-center">No categories available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryManagement;
