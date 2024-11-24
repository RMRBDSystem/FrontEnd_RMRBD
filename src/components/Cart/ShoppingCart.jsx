import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import axiosRetry from 'axios-retry';
import { getProvinceName, fetchDistrictName, fetchWardName } from '../services/AddressService';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState({});
  const [addresses, setAddresses] = useState([]); // Holds all user addresses
  const [userId, setUserId] = useState(Cookies.get('UserId'));
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [addressDetails, setAddressDetails] = useState({}); // Store address details for each order
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch book orders
        const bookOrdersResponse = await axios.get('https://rmrbdapi.somee.com/odata/BookOrder', {
          headers: { 'Content-Type': 'application/json', 'Token': '123-abc' },
        });
        
        // Filter orders by customerId
        const userBookOrders = bookOrdersResponse.data.filter(order => order.customerId === parseInt(userId));
        
        // Fetch order details
        const bookOrderIds = userBookOrders.map(order => order.orderId);
        const orderDetailsResponse = await axios.get('https://rmrbdapi.somee.com/odata/BookOrderDetail', {
          headers: { 'Content-Type': 'application/json', 'Token': '123-abc' },
        });
        
        // Flatten the order details into individual orders
        const flatOrders = orderDetailsResponse.data.map(detail => {
          const order = userBookOrders.find(order => order.orderId === detail.orderId);  
          return {
            orderDetailId: detail.orderDetailId, 
            bookId: detail.bookId,
            quantity: detail.quantity,
            price: detail.price,
            totalPrice: detail.quantity * detail.price,
            purchaseDate: order.purchaseDate,
            clientAddressId: order.clientAddressId,
          };
        });
    
        // Log flattened orders for debugging
        console.log("Flattened Orders:", flatOrders);
        
        // Fetch book data
        const bookIds = [...new Set(flatOrders.map(order => order.bookId))];
        fetchBooks(bookIds);
        
        // Update the state with flattened orders
        setOrders(flatOrders);
      } catch (error) {
        console.error('Error fetching orders or details:', error);
        toast.error('Failed to load orders.');
      }
    };
    
    const fetchBooks = async (bookIds) => {
      try {
        const bookPromises = bookIds.map(bookId =>
          axios.get(`https://rmrbdapi.somee.com/odata/book/${bookId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Token': '123-abc',
            },
          })
        );
        const bookResponses = await Promise.all(bookPromises);
        
        // Log the responses for debug
        console.log("Fetched Book Data:", bookResponses);
        
        const booksData = bookResponses.reduce((acc, response) => {
          const book = response.data;
          const bookImage = book.images && book.images.length > 0 ? book.images[0].imageUrl : null;
          
          // Add unitInStock data from Book API
          acc[book.bookId] = { 
            ...book, 
            imageUrl: bookImage, 
            unitInStock: book.unitInStock  
          };
          
          // Log the book with stock for debug
          console.log(`Book ID: ${book.bookId}, Unit in Stock: ${book.unitInStock}`);
          
          return acc;
        }, {});
    
        setBooks(booksData); // Save the books with stock data in state
      } catch (error) {
      }
    };
    
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/CustomerAddress', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
    
        // Filter addresses based on the userId from the cookie
        const userAddresses = response.data.filter(addr => addr.accountId === parseInt(userId));
        setAddresses(userAddresses);
    
        console.log("Filtered Addresses for User:", userAddresses);
      } catch (error) {
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const handleShowModal = (orderDetailId) => {
    setOrderToDelete(orderDetailId);  
    setShowModal(true);  
  };

  axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

  // Confirm Deletion
  const handleConfirmDelete = () => {
    if (orderToDelete) {
      // Step 1: Delete the specific BookOrderDetail from the API
      axios.delete(`https://rmrbdapi.somee.com/odata/BookOrderDetail/${orderToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          Token: "123-abc",
        },
      })
      .then(() => {
        // Step 2: Remove the deleted BookOrderDetail from the state (UI)
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.filter(order => order.orderDetailId !== orderToDelete);
          
          // Step 3: Find the orderId associated with the deleted orderDetailId
          const orderToCheck = prevOrders.find(order => order.orderDetailId === orderToDelete);
          
          // If the order has no remaining orderDetailId, we should delete the entire order (orderId)
          if (orderToCheck) {
            const remainingDetails = updatedOrders.filter(order => order.orderId === orderToCheck.orderId);
            
            // Step 4: If no remaining orderDetailId, delete the orderId (parent order)
            if (remainingDetails.length === 0) {
              console.log(`Order ${orderToCheck.orderId} has no remaining orderDetails. Deleting the entire order...`);
  
              // Make the API call to delete the BookOrder (orderId)
              axios.delete(`https://rmrbdapi.somee.com/odata/BookOrder/${orderToCheck.orderId}`, {
                headers: {
                  "Content-Type": "application/json",
                  Token: "123-abc",
                },
              })
              .then(() => {
                console.log(`Order ${orderToCheck.orderId} deleted successfully.`);
                toast.success(`Order ${orderToCheck.orderId} deleted because it has no items left.`);
              })
              .catch((err) => {
                console.error("Failed to delete BookOrder:", err);
                toast.error("Failed to delete the order.");
              });
  
              // Remove the orderId from the state (UI) as well
              return updatedOrders.filter(order => order.orderId !== orderToCheck.orderId);
            }
          }
  
          return updatedOrders; // Return the updated orders if we didn't delete the parent order
        });
  
        toast.success("Order detail removed from cart");
      })
      .catch(error => {
        console.error("Error deleting order detail from API:", error.response || error.message);
        toast.error("Failed to remove order detail.");
      });
    }
    setShowModal(false); // Close the modal after deletion
  };
  
  const formatAddressLine = (address) => {
    if (!address) return 'Address details not available';
    // Combine ward, district, and province
    const addressLine = [
      address.provinceCode || 'Province N/A',
      address.districtCode || 'District N/A', 
      address.wardCode || 'Ward N/A'
    ]
      .filter(Boolean)
      .join(', ');
  
    return addressLine;
  };

  const handleCheckboxChange = (orderDetailId, totalPrice) => {
    setSelectedOrders((prevSelectedOrders) => {
      const newSelectedOrders = new Set(prevSelectedOrders);
      if (newSelectedOrders.has(orderDetailId)) {
        newSelectedOrders.delete(orderDetailId);  // If orderDetailId is already in selected, remove it
      } else {
        newSelectedOrders.add(orderDetailId);  // Add orderDetailId to selected orders
      }
      return newSelectedOrders;
    });
  };
  
  useEffect(() => {
    // Recalculate the total price whenever selectedOrders or orders change
    const total = orders.reduce((sum, order) => {
      if (selectedOrders.has(order.orderDetailId)) {
        return sum + (order.totalPrice || 0); // Add totalPrice of selected order
      }
      return sum;
    }, 0);
    setTotalPrice(total);  // Update totalPrice state
  }, [selectedOrders, orders]);

  const updateTotalPrice = () => {
    const total = orders.reduce((sum, order) => {
      if (selectedOrders.has(order.orderId)) {
        return sum + (order.totalPrice || 0);
      }
      return sum;
    }, 0);
    setTotalPrice(total);
  };
  
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;  
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const fetchAddressDetails = async (senderAddressId) => {
  try {
    // Check if details already exist
    if (addressDetails[senderAddressId]) return;

    const addressData = await axios.get(
      `https://rmrbdapi.somee.com/odata/CustomerAddress/${senderAddressId}`,
      {
        headers: { 'Content-Type': 'application/json', 'Token': '123-abc' },
      }
    );

    const addressJson = addressData.data;
    const province = await getProvinceName(addressJson.provinceCode);
    const district = await fetchDistrictName(addressJson.provinceCode, addressJson.districtCode);
    const ward = await fetchWardName(addressJson.districtCode, addressJson.wardCode);

    setAddressDetails((prevDetails) => ({
      ...prevDetails,
      [senderAddressId]: {
        ...addressJson,
        provinceName: province,
        districtName: district,
        wardName: ward,
      },
    }));
  } catch (error) {
    console.error("Error fetching address details:", error);
  }
};

useEffect(() => {
  // Fetch address details for all orders
  orders.forEach(order => {
    if (order.clientAddressId && !addressDetails[order.clientAddressId]) {
      fetchAddressDetails(order.clientAddressId); // Only fetch if not already fetched
    }
  });
}, [orders, addressDetails]); 

const handleQuantityInputChange = (orderDetailId, newQuantity) => {
  const parsedQuantity = Math.max(parseInt(newQuantity) || 1, 1);  // Ensure minimum of 1
  const orderToUpdate = orders.find(order => order.orderDetailId === orderDetailId);
  if (!orderToUpdate) return;

  // Get the available stock for the book
  const book = books[orderToUpdate.bookId];
  const maxQuantity = book?.unitInStock || 0;

  // If the quantity typed exceeds stock, warn the user
  if (parsedQuantity > maxQuantity) {
    toast.warn("Quantity exceeds available stock!");
    return;
  }

  // Recalculate the total price based on new quantity
  const updatedTotalPrice = parsedQuantity * orderToUpdate.price;

  // Update the order with the new quantity
  setOrders(prevOrders => prevOrders.map(order =>
    order.orderDetailId === orderDetailId ? { ...order, quantity: parsedQuantity, totalPrice: updatedTotalPrice } : order
  ));

  // Recalculate the total price of selected orders
  updateTotalPrice();

  // Update the BookOrderDetail on the server
  axios.put(
    `https://rmrbdapi.somee.com/odata/BookOrderDetail/${orderDetailId}`,
    {
      ...orderToUpdate,
      quantity: parsedQuantity,
      totalPrice: updatedTotalPrice,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Token: "123-abc",
      },
    }
  )
  .then(response => {
    console.log("API Response:", response.data);
  })
  .catch(error => {
    console.error("Error updating quantity:", error.response || error.message);
  });

  // Show delete modal if quantity is zero
  if (parsedQuantity === 0) {
    handleShowModal(orderToUpdate.orderId); // Show the delete modal if quantity is zero
  }
};

const handleQuantityChange = (orderDetailId, changeType) => {
  const orderToUpdate = orders.find(order => order.orderDetailId === orderDetailId);
  if (!orderToUpdate) return;

  const currentQuantity = orderToUpdate.quantity || 0;
  let updatedQuantity = changeType === 1 ? currentQuantity + 1 : currentQuantity - 1;

  // Ensure the updated quantity does not go below 1
  if (updatedQuantity < 1) {
    updatedQuantity = 0; // Set to zero if it's less than 1
  }

  const book = books[orderToUpdate.bookId];
  const maxQuantity = book?.unitInStock || 0;
  if (updatedQuantity > maxQuantity) {
    toast.warn("Quantity exceeds available stock!");
    return;
  }

  const updatedTotalPrice = updatedQuantity * orderToUpdate.price;

  // Update the order in the state
  setOrders(prevOrders => prevOrders.map(order =>
    order.orderDetailId === orderDetailId ? { ...order, quantity: updatedQuantity, totalPrice: updatedTotalPrice } : order
  ));

  updateTotalPrice();

  const updatedOrder = {
    orderDetailId: orderToUpdate.orderDetailId,
    orderId: orderToUpdate.orderId,
    bookId: orderToUpdate.bookId,
    price: orderToUpdate.price,  // Ensure price is included
    quantity: updatedQuantity,
    totalPrice: updatedTotalPrice,
    status: orderToUpdate.status || 1  // Ensure status is sent
  };

  // Update the BookOrderDetail on the server
  axios.put(
    `https://rmrbdapi.somee.com/odata/BookOrderDetail/${orderDetailId}`,
    {
      ...orderToUpdate,
      quantity: updatedQuantity,
      totalPrice: updatedTotalPrice,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Token: "123-abc",
      },
    }
  )
  .then(response => {
    console.log("API Response:", response.data);
  })
  .catch(error => {
    console.error("Error updating quantity:", error.response || error.message);
  });

  // Show delete modal if quantity is zero
  if (updatedQuantity === 0) {
    handleShowModal(orderToUpdate.orderId); // Show the delete modal if quantity is zero
  }
};



  // const getAddressFromClientId = (clientAddressId) => {
  //   if (!clientAddressId) {
  //     return 'No Address Assigned';  
  //   }
  
  //   const address = addressDetails[clientAddressId];  
  
  //   if (!address) {
  //     return 'Address not found'; 
  //   }
  
  //   const addressLine = [
  //     address.provinceName,
  //     address.districtName,
  //     address.wardName
  //   ].filter(Boolean).join(', '); 
  
  //   // Return the formatted address with spacing using Tailwind
  //   return (
  //     <div>
  //       <p className="mb-1">- {address.addressDetail}</p> 
  //       <p className="mt-1">- {addressLine}</p>           
  //     </div>
  //   );
  // };

  const handleDeleteOrder = (orderDetailId) => {
    const orderToDelete = orders.find(order => order.orderDetailId === orderDetailId);
  
    if (!orderToDelete) return;
  
    // Delete the order detail first
    axios.delete(`https://rmrbdapi.somee.com/odata/BookOrderDetail/${orderDetailId}`, {
      headers: {
        "Content-Type": "application/json",
        Token: "123-abc",
      },
    })
    .then(response => {
      console.log("Order detail deleted:", response.data);
  
      // Remove the order detail from the cart
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.filter(order => order.orderDetailId !== orderDetailId);
        
        // Check if there are any remaining details for this orderId
        const remainingDetails = updatedOrders.filter(order => order.orderId === orderToDelete.orderId);
        
        // If no remaining details, remove the whole order from the cart
        if (remainingDetails.length === 0) {
          // Call the API to delete the entire order
          axios.delete(`https://rmrbdapi.somee.com/odata/BookOrder/${orderToDelete.orderId}`, {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          })
          .then(() => {
            console.log(`Order ${orderToDelete.orderId} deleted successfully`);
            toast.success(`Order ${orderToDelete.orderId} deleted because it has no items left.`);
          })
          .catch((err) => {
            console.error("Failed to delete BookOrder:", err);
            toast.error("Failed to delete the order.");
          });
  
          // Remove the order from the cart
          return updatedOrders.filter(order => order.orderId !== orderToDelete.orderId);
        }
  
        return updatedOrders;
      });
  
      toast.success("Order detail removed from cart");
    })
    .catch(error => {
      console.error("Error deleting order detail:", error.response || error.message);
      toast.error("Failed to delete order detail.");
    });
  };  
  
  const handleProceedToCheckout = () => {
    if (selectedOrders.size > 0) {
      const selectedOrdersList = orders
        .filter(order => selectedOrders.has(order.orderId))
        .map(order => ({
          ...order,
          bookDetails: books[order.bookId] // Include book details in the order
        }));
  
      navigate('/checkout', { state: { selectedOrders: selectedOrdersList } });
    } else {
      toast.error('Please select at least one order to proceed!');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal by setting showModal to false
  };

   
  return (
    <>
      <ToastContainer />
      <Container className="my-5">
        <h2 className="text-center mb-4">Your Orders</h2>
        <Table bordered responsive className="text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Image</th>
              <th>Book Name</th>
              <th>Price</th>
              <th>Total Price</th>
              <th className="w-36">Quantity</th>
              <th>Action</th> {/* Added Action column for Trash Icon */}
            </tr>
          </thead>
          <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.orderId}>
                <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.has(order.orderDetailId)} 
                  onChange={() => handleCheckboxChange(order.orderDetailId, order.totalPrice)}  
                />
                </td>
                <td>
                  {books[order.bookId] && books[order.bookId].images.length > 0 ? (
                    <img
                      src={books[order.bookId].images[0].imageUrl}
                      alt="Book"
                      className="w-24 h-24 object-cover cursor-pointer"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{books[order.bookId]?.bookName || 'No book available'}</td>
                <td>{formatCurrency(order.price)}</td>
                <td>{formatCurrency(order.totalPrice)}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleQuantityChange(order.orderDetailId, -1)}  // Decrease quantity
                      className="me-2"
                      disabled={order.quantity <= 0} 
                    >
                      -
                    </Button>

                    <input
                      type="number"
                      value={order.quantity}
                      onChange={(e) => handleQuantityInputChange(order.orderDetailId, e.target.value)}  // Update quantity via input
                      className="w-20 text-center"
                      min="1"
                      max={books[order.bookId]?.unitInStock || 0}
                    />

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleQuantityChange(order.orderDetailId, 1)}  // Increase quantity
                      className="ms-2"
                      disabled={order.quantity >= (books[order.bookId]?.unitInStock || 0)}  // Disable the plus button if quantity exceeds stock
                    >
                      +
                    </Button>
                  </div>
                </td>

                <td className="flex justify-center items-center h-28">
                <FaTrash
                    className="cursor-pointer text-xl"
                    onClick={() => handleShowModal(order.orderDetailId)} // Pass the specific orderDetailId
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No orders available.</td>
            </tr>
          )}
          </tbody>
        </Table>
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this order?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              No
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="d-flex justify-content-between align-items-center">
          <h4>Total: {formatCurrency(totalPrice)}</h4>
          <Button variant="primary" disabled={selectedOrders.size === 0}
            onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </Container>
    </>
  );
};

export default ShoppingCart;
