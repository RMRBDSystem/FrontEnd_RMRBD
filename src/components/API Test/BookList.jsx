import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary';

const apiUrl = 'https://rmrbdapi.somee.com/odata/Book';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState({ bookName: '', description: '', price: '' });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log('API Response:', response.data); // Log the entire response

        // Assuming the response contains the books directly
        setBooks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching books:', err); // Log the error
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      bookName: book.bookName || '',
      description: book.description || '',
      price: parseFloat(book.price) || 0,
    };

    setSubmitting(true);
    
    try {
      if (editing) {
        await axios.put(`${apiUrl}/${currentId}`, payload);
      } else {
        await axios.post(apiUrl, payload);
      }
      resetForm();
      fetchBooks(); // Refetch the books after submit
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (bk) => {
    setBook({ bookName: bk.bookName, description: bk.description, price: bk.price });
    setEditing(true);
    setCurrentId(bk.bookId);
  };

  const resetForm = () => {
    setBook({ bookName: '', description: '', price: '' });
    setEditing(false);
    setCurrentId(null);
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log('Fetched Books:', response.data); // Log fetched books
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Book List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="bookName"
          value={book.bookName}
          onChange={handleInputChange}
          placeholder="Book Name"
          className="border rounded p-2 mr-2"
          required
          autoComplete="off"
        />
        <input
          type="text"
          name="description"
          value={book.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border rounded p-2 mr-2"
          required
          autoComplete="off"
        />
        <input
          type="number"
          name="price"
          value={book.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="border rounded p-2 mr-2"
          required
          autoComplete="off"
        />
        <button type="submit" className={`bg-blue-500 text-white rounded p-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>
          {submitting ? 'Submitting...' : (editing ? 'Update' : 'Add')}
        </button>
      </form>
      <ul className="space-y-2">
        {books.length > 0 ? (
          books.map(bk => (
            <li key={bk.bookId} className="p-4 border rounded-lg shadow">
              <h2 className="font-semibold">ID: {bk.bookId}</h2>
              <h3 className="font-semibold">{bk.bookName}</h3>
              <p>Description: {bk.description}</p>
              <p>Price: {bk.price} ₫</p>
              <div className="mt-2">
                <button onClick={() => handleEdit(bk)} className="bg-yellow-500 text-white rounded p-1 mr-1">
                  Edit
                </button>
                {/* Delete button has been removed */}
              </div>
            </li>
          ))
        ) : (
          <li>No books available</li>
        )}
      </ul>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <BookList />
  </ErrorBoundary>
);

export default App;
