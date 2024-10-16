import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary';

const apiUrl = 'https://rmrbdapi.somee.com/odata/Ebook';

const EbookList = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ebook, setEbook] = useState({
    ebookName: '',
    description: '',
    price: '',
    status: '',
    pdfurl: '',
    imageUrl: ''
  });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log('API Response:', response.data);

        setEbooks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching ebooks:', err);
        setError('Failed to fetch ebooks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEbook({ ...ebook, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ebookName: ebook.ebookName || '',
      description: ebook.description || '',
      price: parseFloat(ebook.price) || 0,
      status: parseInt(ebook.status) || -1,
      pdfurl: ebook.pdfurl || '',
      imageUrl: ebook.imageUrl || ''
    };

    setSubmitting(true);

    try {
      if (editing) {
        await axios.put(`${apiUrl}/${currentId}`, payload);
      } else {
        await axios.post(apiUrl, payload);
      }
      resetForm();
      fetchEbooks();
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (bk) => {
    setEbook({
      ebookName: bk.ebookName,
      description: bk.description,
      price: bk.price,
      status: bk.status,
      pdfurl: bk.pdfurl,
      imageUrl: bk.imageUrl
    });
    setEditing(true);
    setCurrentId(bk.ebookId);
  };

  const resetForm = () => {
    setEbook({ ebookName: '', description: '', price: '', status: '-1', pdfurl: '', imageUrl: '' });
    setEditing(false);
    setCurrentId(null);
  };

  const fetchEbooks = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log('Fetched Ebooks:', response.data);
      setEbooks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch ebooks. Please try again later.');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Bị khoá';
      case 1:
        return 'Đã kiểm duyệt';
      case -1:
        return 'Chưa kiểm duyệt';
      default:
        return 'Không xác định';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ebook List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="ebookName"
          value={ebook.ebookName}
          onChange={handleInputChange}
          placeholder="Ebook Name"
          className="border rounded p-2 mr-2"
          required
          autoComplete="off"
        />
        <input
          type="text"
          name="description"
          value={ebook.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border rounded p-2 mr-2"
          required
          autoComplete="off"
        />
        <input
          type="number"
          name="price"
          value={ebook.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="border rounded p-2 mr-2"
          required
          autoComplete="off"
        />
        <select
          name="status"
          value={ebook.status}
          onChange={handleInputChange}
          className="border rounded p-2 mr-2"
          required
        >
          <option value="-1">Chưa kiểm duyệt</option>
          <option value="1">Đã kiểm duyệt</option>
          <option value="0">Bị khoá</option>
        </select>
        <input
          type="text"
          name="pdfurl"
          value={ebook.pdfurl}
          onChange={handleInputChange}
          placeholder="PDF URL"
          className="border rounded p-2 mr-2"
          autoComplete="off"
        />
        <input
          type="text"
          name="imageUrl"
          value={ebook.imageUrl}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="border rounded p-2 mr-2"
          autoComplete="off"
        />
        <button type="submit" className={`bg-blue-500 text-white rounded p-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>
          {submitting ? 'Submitting...' : (editing ? 'Update' : 'Add')}
        </button>
      </form>
      <ul className="space-y-2">
        {ebooks.length > 0 ? (
          ebooks.map(bk => (
            <li key={bk.ebookId} className="p-4 border rounded-lg shadow">
              <h2 className="font-semibold">ID: {bk.ebookId}</h2>
              <h3 className="font-semibold">{bk.ebookName}</h3>
              <p>Description: {bk.description}</p>
              <p>Price: {bk.price} ₫</p>
              <p>Status: {getStatusText(bk.status)}</p>
              <p>PDF URL: {bk.pdfurl}</p>
              <p>Image URL: {bk.imageUrl}</p>
              <div className="mt-2">
                <button onClick={() => handleEdit(bk)} className="bg-yellow-500 text-white rounded p-1 mr-1">
                  Edit
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No ebooks available</li>
        )}
      </ul>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <EbookList />
  </ErrorBoundary>
);

export default App;
