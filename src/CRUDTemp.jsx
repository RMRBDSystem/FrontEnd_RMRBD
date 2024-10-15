import React, { useEffect, useState } from 'react';

const apiUrl = 'https://rmrbdapi.somee.com/odata/Customer';

const CRUDTemp = () => {
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState({ Name: '', Email: '' });
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const fetchCustomers = async () => {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setCustomers(data.value);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            await fetch(`${apiUrl}(${currentId})`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer),
            });
        } else {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer),
            });
        }
        setCustomer({ Name: '', Email: '' });
        setEditing(false);
        fetchCustomers();
    };

    const handleEdit = (customer) => {
        setCustomer({ Name: customer.Name, Email: customer.Email });
        setEditing(true);
        setCurrentId(customer.Id);
    };

    const handleDelete = async (id) => {
        await fetch(`${apiUrl}(${id})`, {
            method: 'DELETE',
        });
        fetchCustomers();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    name="Name"
                    value={customer.Name}
                    onChange={handleInputChange}
                    placeholder="Customer Name"
                    className="border rounded p-2 mr-2"
                    required
                />
                <input
                    type="email"
                    name="Email"
                    value={customer.Email}
                    onChange={handleInputChange}
                    placeholder="Customer Email"
                    className="border rounded p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-2">
                    {editing ? 'Update' : 'Add'}
                </button>
            </form>
            <ul>
                {customers.map((cust) => (
                    <li key={cust.Id} className="flex justify-between mb-2">
                        <span>{cust.Name} - {cust.Email}</span>
                        <div>
                            <button onClick={() => handleEdit(cust)} className="bg-yellow-500 text-white rounded p-1 mr-1">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(cust.Id)} className="bg-red-500 text-white rounded p-1">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CRUDTemp;