import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/Customer');
        console.log('API Response:', response.data); // Log the entire response
        setCustomers(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!Array.isArray(customers)) {
    return <div>Unexpected data format.</div>;
  }

  if (customers.length === 0) {
    return <div>No customers found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <ul className="space-y-2">
        {customers.map(customer => (
          <li key={customer.customerId} className="p-4 border rounded-lg shadow">
            <h2 className="font-semibold">{customer.userName}</h2>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phoneNumber || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;