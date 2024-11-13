import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary';

const apiUrl = 'https://rmrbdapi.somee.com/odata/Customer';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState({ userName: '', email: '', phoneNumber: '' });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log('API Response:', response.data); // Log the entire response

        // Set customers directly from the response if it's an array
        setCustomers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching customers:', err); // Log the error
        setError('Failed to fetch customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userName: customer.userName,
      email: customer.email,
      phoneNumber: customer.phoneNumber || null,
    };

    try {
      if (editing) {
        await axios.put(`${apiUrl}(${currentId})`, payload);
      } else {
        await axios.post(apiUrl, payload);
      }
      resetForm();
      fetchCustomers(); // Refetch customers after submit
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (cust) => {
    setCustomer({ userName: cust.userName, email: cust.email, phoneNumber: cust.phoneNumber });
    setEditing(true);
    setCurrentId(cust.customerId);
  };

  const resetForm = () => {
    setCustomer({ userName: '', email: '', phoneNumber: '' });
    setEditing(false);
    setCurrentId(null);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log('Fetched Customers:', response.data); // Log fetched customers
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="userName"
          value={customer.userName}
          onChange={handleInputChange}
          placeholder="Customer Name"
          className="border rounded p-2 mr-2 w-full"
          required
          autoComplete="name"
        />
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleInputChange}
          placeholder="Customer Email"
          className="border rounded p-2 mr-2 w-full"
          required
          autoComplete="email"
        />
        <input
          type="text"
          name="phoneNumber"
          value={customer.phoneNumber}
          onChange={handleInputChange}
          placeholder="Customer Phone"
          className="border rounded p-2 mr-2 w-full"
          autoComplete="tel"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
          {editing ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="space-y-2">
        {customers.length > 0 ? (
          customers.map(cust => (
            <li key={cust.customerId} className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <h2 className="font-semibold">{cust.userName}</h2>
              <p>Email: {cust.email}</p>
              <p>Phone: {cust.phoneNumber || 'N/A'}</p>
              <div className="mt-2">
                <button onClick={() => handleEdit(cust)} className="bg-yellow-500 text-white rounded p-1 hover:bg-yellow-600">
                  Edit
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No customers available</li>
        )}
      </ul>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <CustomerList />
  </ErrorBoundary>
);

export default App;
