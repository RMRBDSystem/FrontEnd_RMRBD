import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const AddBookModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', description: '', price: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Add Products</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="bookName" className="block">Name</label>
            <input
              id="bookName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="bookDescription" className="block">Description</label>
            <textarea
              id="bookDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="bookPrice" className="block">Price</label>
            <input
              id="bookPrice"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditBookModal = ({ isOpen, onClose, onEdit, book }) => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    if (book) {
      setFormData({ name: book.name, description: book.description, price: book.price });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(book.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="bookName" className="block">Name</label>
            <input
              id="bookName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="bookDescription" className="block">Description</label>
            <textarea
              id="bookDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="bookPrice" className="block">Price</label>
            <input
              id="bookPrice"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-orange-400 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BookManagement = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [books, setBooks] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ebooks, setEbooks] = useState([]); // New state for eBooks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);
  const [editBookModalOpen, setEditBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const notifications = ["Notification 1", "Notification 2"];
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResponse, recipesResponse, ebooksResponse] = await Promise.all([
          axios.get('https://rmrbdapi.somee.com/odata/book', {
            headers: { 'Content-Type': 'application/json', 'Token': '123-abc' }
          }),
          axios.get('https://rmrbdapi.somee.com/odata/recipe', {
            headers: { 'Content-Type': 'application/json', 'Token': '123-abc' }
          }),
          axios.get('https://rmrbdapi.somee.com/odata/ebook', {
            headers: { 'Content-Type': 'application/json', 'Token': '123-abc' }
          }),
        ]);
  
        const formattedBooks = booksResponse.data.map(item => ({
          name: item.bookName,
          description: item.description,
          price: item.price,
          id: item.bookId
        }));
  
        const formattedRecipes = recipesResponse.data.map(item => ({
          name: item.recipeName,
          description: item.description,
          price: item.price,
          id: item.recipeId
        }));
  
        const formattedEbooks = ebooksResponse.data.map(item => ({
          name: item.ebookName,
          description: item.description,
          price: item.price,
          id: item.ebookId,
          imageUrl: item.imageUrl
        }));
  
        setBooks(formattedBooks);
        setRecipes(formattedRecipes);
        setEbooks(formattedEbooks);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleAddBook = (newBook) => {
    const id = books.length > 0 ? Math.max(...books.map(item => item.id)) + 1 : 1; // Generate a new ID
    const formattedBook = { ...newBook, id };
    setBooks(prevItems => [...prevItems, formattedBook]);
    console.log("Added book:", formattedBook);
  };

  const handleEditBook = (id, updatedBook) => {
    setBooks(prevItems => prevItems.map(item => (item.id === id ? { ...item, ...updatedBook } : item)));
  };

  const filteredBooks = books
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredRecipes = recipes
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredEbooks = ebooks
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

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
                  className={`block py-2.5 px-4 rounded ${location.pathname === `/${item.replace(/ /g, '').toLowerCase()}` ? "text-orange-500 font-semibold border-b-2 border-orange-500" : "text-black"}`}
                >
                  {item}
                </Link>
                <div className={`border-b border-gray-300 ${item !== "Delivery Management" ? "mb-2" : ""}`} />
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Book Management */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          <header className="p-4 bg-orange-400 flex justify-between items-center">
            <h1 className="text-white text-xl">Book Management</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-md px-3 py-2 text-gray-800 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Add Book Button */}
          <div className="p-4">
            <button onClick={() => setAddBookModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">
              Add Products
            </button>
          </div>

          {/* Notifications */}
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

          {/* Book List */}
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4">Books</h2>
                <table className="min-w-full bg-white mb-4">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-center">#</th>
                      <th className="py-2 px-4 border-b text-center">Name</th>
                      <th className="py-2 px-4 border-b text-center">Description</th>
                      <th className="py-2 px-4 border-b text-center">Price</th>
                      <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b text-center">{item.name}</td>
                        <td className="py-2 px-4 border-b text-center">{item.description}</td>
                        <td className="py-2 px-4 border-b text-center">{item.price.toLocaleString()} VND</td>
                        <td className="py-2 px-4 border-b text-center">
                          <button onClick={() => { setSelectedBook(item); setEditBookModalOpen(true); }} className="bg-orange-400 text-white px-2 py-1 rounded">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Recipe List */}
                <h2 className="text-lg font-bold mb-4">Recipes</h2>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-center">#</th>
                      <th className="py-2 px-4 border-b text-center">Recipe Name</th>
                      <th className="py-2 px-4 border-b text-center">Description</th>
                      <th className="py-2 px-4 border-b text-center">Price</th>
                      <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecipes.map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b text-center">{item.name}</td>
                        <td className="py-2 px-4 border-b text-center">{item.description}</td>
                        <td className="py-2 px-4 border-b text-center">{item.price.toLocaleString()} VND</td>
                        <td className="py-2 px-4 border-b text-center">
                          <button onClick={() => { setSelectedBook(item); setEditBookModalOpen(true); }} className="bg-orange-400 text-white px-2 py-1 rounded">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* eBook List */}
                <h2 className="text-lg font-bold mb-4">eBooks</h2>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-center">#</th>
                      <th className="py-2 px-4 border-b text-center">eBook Name</th>
                      <th className="py-2 px-4 border-b text-center">Description</th>
                      <th className="py-2 px-4 border-b text-center">Price</th>
                      <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEbooks.map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b text-center">{item.name}</td>
                        <td className="py-2 px-4 border-b text-center">{item.description}</td>
                        <td className="py-2 px-4 border-b text-center">{item.price.toLocaleString()} VND</td>
                        <td className="py-2 px-4 border-b text-center">
                          <button onClick={() => { setSelectedBook(item); setEditBookModalOpen(true); }} className="bg-orange-400 text-white px-2 py-1 rounded">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={addBookModalOpen}
        onClose={() => setAddBookModalOpen(false)}
        onAdd={handleAddBook}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={editBookModalOpen}
        onClose={() => setEditBookModalOpen(false)}
        onEdit={handleEditBook}
        book={selectedBook}
      />
    </div>
  );
};

export default BookManagement;
