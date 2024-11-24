import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { fetchAddresses } from '../services/AddressService';
import { getBookById } from '../services/BookService'; 
import { getOrderDetails } from '../services/OrderService';
import { calculateShippingFee, fetchOrderAddress } from '../services/ShippingService';
import { getProvinceName, fetchDistrictName, fetchWardName } from '../services/AddressService'; 

const Checkout = () => {
  const location = useLocation();
  const selectedOrders = location.state?.selectedOrders || [];
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [addressDetails, setAddressDetails] = useState({});
  const [shippingFee, setShippingFee] = useState(0);
  const [senderAddresses, setSenderAddresses] = useState([]); // Store sender address details
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({});

  const calculateCombinedTotalPrice = () => {
    const totalPrice = calculateTotalPrice();
    const combinedTotal = totalPrice + shippingFee;
    console.log("Calculated Total Price with Shipping Fee:", combinedTotal);
    return combinedTotal;
  };

  const [temporaryAddress, setTemporaryAddress] = useState({});

  const orderDetailService = axios.create({
    baseURL: `https://rmrbdapi.somee.com/odata/BookOrderDetail`,
    headers: {
        'Content-Type': 'application/json',
         Token: "123-abc",
    }
});
  
useEffect(() => {
  const updateShippingFee = async () => {
    console.log('Selected Address:', selectedAddress);
    console.log('Sender Addresses:', senderAddresses);  // Log sender addresses here

    // Ensure senderAddresses are populated before proceeding
    if (selectedAddress && senderAddresses.length > 0) {
        const receiverAddress = addresses.find(addr => addr.addressId === parseInt(selectedAddress, 10));
        console.log('Receiver Address:', receiverAddress);

        if (!receiverAddress) {
            console.error('Receiver address not found for ID:', selectedAddress);
            return;
        }

        const receiverLocation = addressDetails[selectedAddress];
        console.log('Receiver Location:', receiverLocation);

        if (!receiverLocation) {
            console.error('Location details missing for addressId:', selectedAddress);
            return;
        }

        let totalFee = 0;
        for (const order of selectedOrders) {
            try {
                const orderDetails = await getOrderDetails(order.orderId); // Fetch order details
                console.log('Order Details for Order ID:', order.orderId, orderDetails);
                const senderAddress = orderDetails.addressDetails;  // Assuming addressDetails contains sender address
                
                if (senderAddress) {
                    console.log('Sender Address for Order ID:', order.orderId, senderAddress);
                    console.log("Sender District ID:", senderAddress.districtCode);
                    console.log("Sender Ward Code:", senderAddress.wardCode);
                } else {
                    console.error('Sender address not found for Order ID:', order.orderId);
                }

                if (receiverLocation) {
                    console.log("Receiver District ID:", receiverLocation.districtCode);
                    console.log("Receiver Ward Code:", receiverLocation.wardCode);
                } else {
                    console.error("Receiver location missing for Address ID:", selectedAddress);
                }

                const feeData = {
                    from_district_id: senderAddress ? senderAddress.districtCode : '',
                    from_ward_code: senderAddress ? senderAddress.wardCode : '',
                    to_district_id: receiverLocation.districtCode,
                    to_ward_code: receiverLocation.wardCode,
                    weight: order.details[0]?.weight || 0,
                    length: order.details[0]?.length || 0,
                    width: order.details[0]?.width || 0,
                    height: order.details[0]?.height || 0,
                };

                console.log('Requesting shipping fee with data:', feeData);

                try {
                    const feeResponse = await calculateShippingFee(feeData);
                    console.log('Shipping Fee Response:', feeResponse);
                    totalFee += feeResponse.data.total || 0;
                } catch (error) {
                    console.error('Failed to calculate shipping fee:', error);
                }
            } catch (error) {
                console.error('Error fetching order details for orderId:', order.orderId, error);
            }
        }

        setShippingFee(totalFee);
        console.log('Updated Shipping Fee:', totalFee);
    } else {
        console.error('Sender Addresses are empty or missing.');
    }
  };

  // Check if senderAddresses has been populated before calling updateShippingFee
  if (senderAddresses.length > 0) {
    updateShippingFee();
  }
}, [selectedAddress, senderAddresses, addresses, addressDetails, selectedOrders]);

useEffect(() => {
  const fetchSenderDetails = async () => {
    if (selectedOrders.length === 0) return; // Early exit if no selected orders

    const updatedSenderAddresses = [];

    // Iterate over selected orders and fetch sender address details
    for (let order of selectedOrders) {
      try {
        console.log("Fetching order details for orderId:", order.orderId);
        const orderDetails = await getOrderDetails(order.orderId);
        const senderAddress = orderDetails?.senderAddress; // Ensure senderAddress exists

        if (senderAddress) {
          const senderAddressId = senderAddress.addressId;
          console.log("Sender Address ID found:", senderAddressId);

          // Fetch address details for the sender address
          const senderAddressDetails = await fetchSenderAddress(senderAddressId);
          if (senderAddressDetails) {
            const { provinceCode, districtCode, wardCode } = senderAddressDetails;
            const provinceName = await getProvinceName(provinceCode);
            const districtName = await fetchDistrictName(provinceCode, districtCode);
            const wardName = await fetchWardName(districtCode, wardCode);

            updatedSenderAddresses.push({
              orderId: order.orderId,
              provinceName,
              districtName,
              wardName,
              districtCode,
              wardCode,
            });
          } else {
            console.log("No address details found for senderAddressId:", senderAddressId);
          }
        } else {
          console.log("No sender address for orderId:", order.orderId);
        }
      } catch (error) {
        console.error("Error fetching sender details for orderId:", order.orderId, error);
      }
    }

    if (updatedSenderAddresses.length > 0) {
      setSenderAddresses(updatedSenderAddresses); // Update sender addresses state
    } else {
      console.log("No sender addresses to update.");
    }
  };

  fetchSenderDetails(); // Call the fetch function once when selectedOrders change
}, [selectedOrders]); // Only trigger when selectedOrders changes

// Shipping Fee Calculation Logic (Separate useEffect)
useEffect(() => {
  const updateShippingFee = async () => {
    if (!selectedAddress || senderAddresses.length === 0) return; // Check if sender addresses are available

    const receiverAddress = addresses.find(addr => addr.addressId === parseInt(selectedAddress, 10));
    if (!receiverAddress) {
      console.error("Receiver address not found.");
      return;
    }

    const receiverLocation = addressDetails[selectedAddress];
    if (!receiverLocation) {
      console.error("Receiver location details missing.");
      return;
    }

    let totalFee = 0;
    for (const order of selectedOrders) {
      try {
        const orderDetails = await getOrderDetails(order.orderId);
        const senderAddress = orderDetails?.senderAddress;
        if (!senderAddress) {
          console.error("Sender address missing for orderId:", order.orderId);
          continue;
        }

        const feeData = {
          from_district_id: senderAddress.districtCode,
          from_ward_code: senderAddress.wardCode,
          to_district_id: receiverLocation.districtCode,
          to_ward_code: receiverLocation.wardCode,
          weight: order.details[0]?.weight || 0,
          length: order.details[0]?.length || 0,
          width: order.details[0]?.width || 0,
          height: order.details[0]?.height || 0,
        };

        const feeResponse = await calculateShippingFee(feeData);
        totalFee += feeResponse.data?.total || 0; // Accumulate shipping fee
      } catch (error) {
        console.error("Error fetching order details for orderId:", order.orderId, error);
      }
    }

    setShippingFee(totalFee); // Update the shipping fee once calculated
  };

  updateShippingFee(); // Call the shipping fee calculation logic once sender addresses and selected address are available
}, [selectedAddress, senderAddresses, addresses, selectedOrders]); // Trigger when relevant data changes

  // Handle the address selection
  const handleAddressChange = (event) => {
    const selectedAddressId = event.target.value;
    console.log("Selected address ID:", selectedAddressId);
    setSelectedAddress(selectedAddressId);
  };

  const fetchOrderAddress = async (orderId) => {
    try {
      const response = await axios.get(`${'https://rmrbdapi.somee.com/odata/CustomerAddress'}/${orderId}`,{
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
      const orderData = response.data;
  
      if (orderData && orderData.senderAddressId) {
        const senderAddressResponse = await axios.get(`https://rmrbdapi.somee.com/odata/CustomerAddress/${orderData.senderAddressId}`);
        return senderAddressResponse.data;  // Return the sender's address information
      }
      return null;
    } catch (error) {
      console.error("Error fetching order address:", error);
      throw error;  // Handle error gracefully
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const userId = getUserIdFromCookie();
      let fetchedAddresses = [];

      if (userId) {
        try {
          fetchedAddresses = await fetchAddresses(userId);
          console.log('Fetched Addresses:', fetchedAddresses);

          if (Array.isArray(fetchedAddresses)) {
            setAddresses(fetchedAddresses);

            const addressDetailsPromises = fetchedAddresses.map(async (address) => {
              const provinceName = await getProvinceName(address.provinceCode);
              const districtName = await fetchDistrictName(address.provinceCode, address.districtCode);
              const wardName = await fetchWardName(address.districtCode, address.wardCode);

              return {
                addressId: address.addressId,
                provinceName,
                districtName,
                wardName,
                districtCode: address.districtCode,
                wardCode: address.wardCode
              };
            });

            const details = await Promise.all(addressDetailsPromises);

            const detailsMap = details.reduce((acc, detail) => {
              acc[detail.addressId] = detail;
              return acc;
            }, {});

            console.log('Address Details Map:', detailsMap);
            setAddressDetails(detailsMap);
            setLoading(false);
          } else {
            console.error('fetchedAddresses is not an array:', fetchedAddresses);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching address details:', error);
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, []); // Only run once when the component mounts

  // Fetch sender address
  const fetchSenderAddress = async (orderId) => {
    try {
        const response = await axios.get(`${'https://rmrbdapi.somee.com/odata/CustomerAddress'}/${orderId}`,{
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        
        const orderData = response.data;

        if (orderData && orderData.senderAddressId) {  // Adjust this to match the correct field for sender address
            const senderAddressId = orderData.senderAddressId;
            // Fetch the address details associated with senderAddressId
            const addressResponse = await axios.get(`https://rmrbdapi.somee.com/odata/CustomerAddress/${senderAddressId}`);
            return addressResponse.data;  // Return the sender's address information
        }
        return null;
    } catch (error) {
        console.error('Error fetching sender address:', error);
        throw error;
    }
};

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getUserIdFromCookie = () => {
    const UserId = document.cookie.replace(/(?:(?:^|.*;\s*)UserId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return UserId;
  };

  const calculateTotalPrice = () => {
    const totalPrice = selectedOrders.reduce((total, order) => total + (order.totalPrice || 0), 0);
    console.log("Calculated Total Price:", totalPrice);  // Check total price calculation
    return totalPrice;
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
          headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' }
        });
        setProvinces(response.data.data || []);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        toast.error('Failed to load provinces.');
      }
    };

    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId) => {
    try {
      setDistricts([]);
      setWards([]);
      setAddress((prev) => ({ ...prev, districtCode: '', wardCode: '' }));

      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        { province_id: Number(provinceId) },
        { headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' } }
      );
      setDistricts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to load districts.');
    }
  };

  const fetchWards = async (districtId) => {
    try {
      setWards([]);
      setAddress((prev) => ({ ...prev, wardCode: '' }));

      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        { district_id: Number(districtId) },
        { headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' } }
      );
      setWards(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Failed to load wards.');
    }
  };

  const handleTemporaryAddressChange = (e) => {
    const { name, value } = e.target;
  
    let updatedValue = value;
  
    if (name === 'phoneNumber') { 
      updatedValue = updatedValue.replace(/\D/g, ''); 
  
      if (updatedValue.startsWith('0')) {
        updatedValue = '84' + updatedValue.slice(1);
      }
    }
  
    setTemporaryAddress((prev) => ({
      ...prev,
      [name]: updatedValue, 
    }));
  };

  const fetchBookDetails = async (orderId) => {
    try {
      const bookDetails = await getOrderDetails (orderId);
      console.log("Book details fetched successfully:", bookDetails);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  return (
            <>
              <Navbar />
                <Container className="my-5">
                  <h2 className="text-center mb-4">Checkout</h2>

                  {selectedOrders.length > 0 ? (
                    <>
                      <Table bordered responsive className="text-center">
  <thead>
    <tr>
      <th>#</th>
      <th>Book Image</th>
      <th>Book Name</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Total Price</th>
    </tr>
  </thead>
  <tbody>
    {selectedOrders.map((order, index) => {
      const bookDetails = order.details[0].book || {};
      const gg = bookDetails.images[0]

      const bookName = bookDetails.bookName 
      const { imageUrl } = gg; 
      
      const totalPrice = order.totalPrice || 0;

      return (
        <tr key={order.orderId}>
          <td>{index + 1}</td>
          <td>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Book"
                className="w-12 h-16 object-cover cursor-pointer"
              />
            ) : (
              <span>No Image</span>
            )}
          </td>
          <td>{bookName || "No Name"}</td>
          <td>{formatCurrency(order.details[0]?.price || 0)}</td>
          <td>{order.quantity}</td>
          <td>{formatCurrency(totalPrice)}</td>
        </tr>
      );
    })}
  </tbody>
</Table>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="shippingAddressSelect">Select Shipping Address</Form.Label>
              {loading ? (
                <p>Loading addresses...</p>
              ) : (
                <Form.Control
                  as="select"
                  id="shippingAddressSelect"  // Ensure the id is set to "shippingAddressSelect"
                  value={selectedAddress}
                  onChange={handleAddressChange}
                >
                  <option value="">Choose an address</option>
                  {addresses.map((address) => {
                    const { addressId, addressDetail, phoneNumber } = address;
                    const addressLocation = addressDetails[addressId];
                    const fullAddress = addressLocation
                      ? `${addressDetail}\n- ${addressLocation.wardName}\n- ${addressLocation.districtName}\n- ${addressLocation.provinceName}\n- ${phoneNumber}`
                      : `${addressDetail}\n- loading location...`;
                    return (
                      <option key={address.addressId} value={address.addressId}>
                        {fullAddress}
                      </option>
                    );
                  })}
                </Form.Control>
              )}
            </Form.Group>

            <div className="or-separator">
              <span>Or</span>
            </div>

            {selectedAddress === "" ? (
              <>
                <h5>Enter Temporary Address</h5>
                <Form.Group>
                  <Form.Label htmlFor="temporaryAddress">Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    id="temporaryAddress"  // Ensure this id is set
                    value={temporaryAddress.address}
                    onChange={handleTemporaryAddressChange}
                    placeholder="Enter temporary address"
                    autocomplete="on"  // Add the autocomplete attribute here
                  />
                </Form.Group>

                <Form.Group controlId="provinceCode">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    as="select"
                    name="province"
                    value={temporaryAddress.province}  // Bind to temporaryAddress
                    onChange={(e) => {
                      handleTemporaryAddressChange(e);
                      fetchDistricts(e.target.value);  // Update districts based on the province
                    }}
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="districtCode">
                  <Form.Label>District</Form.Label>
                  <Form.Control
                    as="select"
                    name="district"
                    value={temporaryAddress.district}  // Bind to temporaryAddress
                    onChange={(e) => {
                      handleTemporaryAddressChange(e);
                      fetchWards(e.target.value);  // Update wards based on the district
                    }}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="wardCode">
                  <Form.Label>Ward</Form.Label>
                  <Form.Control
                    as="select"
                    name="ward"
                    value={temporaryAddress.ward}  // Bind to temporaryAddress
                    onChange={handleTemporaryAddressChange}
                    required
                  >
                    <option value="">Select Ward</option>
                    {wards.map((ward) => (
                      <option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="phoneNumber">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    id="phoneNumber"  // Ensure this id is set
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={temporaryAddress.phoneNumber}
                    onChange={handleTemporaryAddressChange}
                    maxLength={15}
                    inputMode="numeric"
                    required
                  />
                </Form.Group>
              </>
            ) : null}

            <div className="d-flex flex-column align-items-start mt-4">
              <div className="d-flex justify-content-between w-100 mb-2">
                <h5>Total Price of Books:</h5>
                <span>{formatCurrency(calculateTotalPrice())}</span>
              </div>
              <div className="d-flex justify-content-between w-100 mb-2">
                <h5>Shipping Fee:</h5> 
                <span>{formatCurrency(shippingFee)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between w-100">
                <h5>Total Price:</h5>
                <span>{formatCurrency(calculateCombinedTotalPrice())}</span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <Button variant="primary" disabled={!selectedAddress}>
                Proceed to Payment
              </Button>
            </div>
          </>
        ) : (
          <p>No orders selected for checkout.</p>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Checkout;
