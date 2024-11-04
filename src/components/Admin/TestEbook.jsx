import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const TestEbook = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ebooks, setEbooks] = useState([]);
  const [newEbook, setNewEbook] = useState({
    EbookName: '',
    Description: '',
    Price: '',
    Pdfurl: '',
    Images: [],  // Changed from ImageUrl to Images for multiple uploads
    CategoryId: '',
    CreateById: 1,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications] = useState(["Notification 1", "Notification 2"]);
  const location = useLocation();
  
  const fileInputRef = useRef(null);

  const handleToggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const fetchEbooks = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/ebook', {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
      setEbooks(response.data.value || []);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    }
  };

  const addEbook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://rmrbdapi.somee.com/odata/ebook', newEbook, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
      setEbooks(prev => [...prev, response.data]);
      setNewEbook({
        EbookName: '',
        Description: '',
        Price: '',
        Pdfurl: '',
        Images: [], // Reset to an empty array
        CategoryId: '',
        CreateById: 1,
      });
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding ebook:', error);
    }
  };

  const handleDrop = (acceptedFiles) => {
    const newImages = [...newEbook.Images];
    Array.from(acceptedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        setNewEbook({ ...newEbook, Images: newImages });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

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
            {["Dashboard", "Account Management", "Income Management", "Feedback & Comments", "Reports", "Category Management", "Ebook Test"].map((item, index) => {
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
                case "Ebook Test":
                  path = '/admin/ebook-test';
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
                    style={{ opacity: isSidebarOpen ? 1 : 0 }}
                  >
                    {isSidebarOpen ? item : <span className="text-transparent">{item.charAt(0)}</span>}
                  </Link>
                  {isSidebarOpen && <div className={`border-b border-gray-300 ${item !== "Feedback & Comments" ? "mb-2" : ""}`} />}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 bg-white flex justify-between items-center">
            <h1 className="text-orange-500 text-xl font-bold">Ebook Test</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search ebooks..." 
                  className="rounded-md px-3 py-2 text-gray-800 pr-10" 
                  name="ebookSearch"
                />
                <button className="absolute right-0 top-0 bottom-0 text-black rounded-r-md px-3 flex items-center">
                  <FaSearch />
                </button>
              </div>
              <button onClick={handleToggleNotifications} className="text-black flex items-center relative">
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

          {/* Add Ebook Button */}
          <div className="p-4">
            <button onClick={() => setModalOpen(true)} className="bg-orange-500 text-white p-2 rounded">
              Add New Ebook
            </button>
          </div>

          {/* Ebook List */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Ebook List</h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Ebook Name</th>
                  <th className="py-2 px-4 border-b text-left">Description</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.length > 0 ? (
                  ebooks.map(ebook => (
                    <tr key={ebook.EbookId}>
                      <td className="py-2 px-4 border-b">{ebook.EbookName}</td>
                      <td className="py-2 px-4 border-b">{ebook.Description}</td>
                      <td className="py-2 px-4 border-b">{ebook.Price}</td>
                      <td className="py-2 px-4 border-b">
                        <button onClick={() => updateEbook(ebook.EbookId, { /* Your updated data here */ })} className="text-red-500">Edit</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-2">No ebooks found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Adding Ebook */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Add New Ebook</h2>
                <form onSubmit={addEbook}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Ebook Name</label>
                    <input 
                      type="text" 
                      value={newEbook.EbookName} 
                      onChange={e => setNewEbook({ ...newEbook, EbookName: e.target.value })} 
                      className="border rounded-md w-full p-2" 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea 
                      value={newEbook.Description} 
                      onChange={e => setNewEbook({ ...newEbook, Description: e.target.value })} 
                      className="border rounded-md w-full p-2" 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input 
                      type="number" 
                      value={newEbook.Price} 
                      onChange={e => setNewEbook({ ...newEbook, Price: e.target.value })} 
                      className="border rounded-md w-full p-2" 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">PDF URL</label>
                    <input 
                      type="text" 
                      value={newEbook.Pdfurl} 
                      onChange={e => setNewEbook({ ...newEbook, Pdfurl: e.target.value })} 
                      className="border rounded-md w-full p-2" 
                      required 
                    />
                  </div>
                  <div 
                    className="mb-4" 
                    onDragOver={handleDragOver} 
                    onDragEnter={handleDragEnter} 
                    onDragLeave={handleDragLeave} 
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(e.dataTransfer.files);
                    }} 
                    onClick={() => fileInputRef.current.click()} 
                    style={{ 
                      border: '2px dashed gray', 
                      borderRadius: '8px', 
                      padding: '20px', 
                      textAlign: 'center' 
                    }}
                  >
                    <p className="text-gray-700">Drag & drop images here or click to select</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple  // Allow multiple file selection
                      onChange={(e) => handleDrop(e.target.files)} 
                      style={{ display: 'none' }} 
                      ref={fileInputRef} 
                    />
                  </div>

                  {/* Image Previews */}
                  <div className="flex flex-wrap">
                    {newEbook.Images.map((image, index) => (
                      <div key={index} className="relative mr-2 mb-2">
                        <img 
                          src={image} 
                          alt={`Preview ${index}`} 
                          className="w-24 h-24 object-cover border rounded" 
                        />
                        <button 
                          onClick={() => {
                            const updatedImages = newEbook.Images.filter((_, i) => i !== index);
                            setNewEbook({ ...newEbook, Images: updatedImages });
                          }} 
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          aria-label="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Category ID</label>
                    <input 
                      type="number" 
                      value={newEbook.CategoryId} 
                      onChange={e => setNewEbook({ ...newEbook, CategoryId: e.target.value })} 
                      className="border rounded-md w-full p-2" 
                      required 
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2">Add</button>
                    <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 text-black rounded-md px-4 py-2">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TestEbook;
