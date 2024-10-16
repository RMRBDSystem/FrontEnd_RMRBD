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
        setCustomers(response.data.value || []);
      } catch (err) {
        setError(err.message);
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
      fetchCustomers();
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (cust) => {
    setCustomer({ userName: cust.userName, email: cust.email, phoneNumber: cust.phoneNumber });
    setEditing(true);
    setCurrentId(cust.customerId);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}(${id})`);
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setCustomer({ userName: '', email: '', phoneNumber: '' });
    setEditing(false);
    setCurrentId(null);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setCustomers(response.data.value || []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="userName"
          value={customer.userName}
          onChange={handleInputChange}
          placeholder="Customer Name"
          className="border rounded p-2 mr-2"
          required
          autoComplete="name"
        />
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleInputChange}
          placeholder="Customer Email"
          className="border rounded p-2 mr-2"
          required
          autoComplete="email"
        />
        <input
          type="text"
          name="phoneNumber"
          value={customer.phoneNumber}
          onChange={handleInputChange}
          placeholder="Customer Phone"
          className="border rounded p-2 mr-2"
          autoComplete="tel"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          {editing ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="space-y-2">
        {customers.map(cust => (
          <li key={cust.customerId} className="p-4 border rounded-lg shadow">
            <h2 className="font-semibold">{cust.userName}</h2>
            <p>Email: {cust.email}</p>
            <p>Phone: {cust.phoneNumber || 'N/A'}</p>
            <div className="mt-2">
              <button onClick={() => handleEdit(cust)} className="bg-yellow-500 text-white rounded p-1 mr-1">
                Edit
              </button>
              <button onClick={() => handleDelete(cust.customerId)} className="bg-red-500 text-white rounded p-1">
                Delete
              </button>
            </div>
          </li>
        ))}
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
