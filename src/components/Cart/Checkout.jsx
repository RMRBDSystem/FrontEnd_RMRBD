import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { calculateShippingFee, createShippingOrder } from '../services/ShippingService';
import {   getProvinceName,   fetchDistrictName,   fetchWardName } from '../services/AddressService';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import LoadingOverlay from '../shared/LoadingOverlay';
import { updateBookStock } from '../services/BookService';
import { createBookTransaction } from '../services/Transaction';
import { createOrderStatus } from '../services/OrderStatusService';
import { decryptData } from "../Encrypt/encryptionUtils";
const getAccountById = async (accountId) => {
  try {
    const response = await axios.get(`https://rmrbdapi.somee.com/odata/Account/${accountId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Token': '123-abc',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching account ${accountId}:`, error);
    return null;
  }
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = decryptData(Cookies.get("UserId"));
  
  // Add this check at the beginning of your component
  useEffect(() => {
    // If there are no selected orders or they've been cleared, redirect to cart
    if (!location.state?.selectedOrders?.length) {
      navigate('/cart', { replace: true });
      return;
    }
    
    // Existing authentication check
    if (!userId) {
      toast.error('Vui lòng đăng nhập để tiếp tục thanh toán');
      navigate('/login');
      return;
    }
  }, [location.state, userId, navigate]);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const { selectedOrders = [] } = location.state || {};
  const [addressDetails, setAddressDetails] = useState({});
  const [accountDetails, setAccountDetails] = useState({});
  const [senderAddress, setSenderAddress] = useState(null);
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isRecipientLoading, setIsRecipientLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    AddressID: '',
    AccountID: userId,
    AddressStatus: 1,
    wardCode: '',
    districtCode: '',
    provinceCode: '',
    AddressDetail: '',
    phoneNumber: '',
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addressMode, setAddressMode] = useState('select'); // 'select' or 'new'
  const [newShippingAddress, setNewShippingAddress] = useState({
    AddressID: '',
    AccountID: userId,
    AddressStatus: 1,
    wardCode: '',
    districtCode: '',
    provinceCode: '',
    AddressDetail: '',
    phoneNumber: '',
    recipientName: '', // Add recipient name field
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Add new state for grouped orders
  const [groupedOrders, setGroupedOrders] = useState({});

  // Group orders by sender address when component mounts or selected orders change
  useEffect(() => {
    const groupBySenderAddress = () => {
      const grouped = selectedOrders.reduce((acc, order) => {
        const senderAddressId = order.bookDetails?.senderAddressId;
        if (!acc[senderAddressId]) {
          acc[senderAddressId] = [];
        }
        acc[senderAddressId].push(order);
        return acc;
      }, {});
      setGroupedOrders(grouped);
    };

    groupBySenderAddress();
  }, [selectedOrders]);

  // Fetch user coins
  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        const response = await axios.get(`https://rmrbdapi.somee.com/odata/Account/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        setUserCoins(response.data.coin || 0);
      } catch (error) {
        console.error('Error fetching user coins:', error);
        setUserCoins(0);
      }
    };

    if (userId) {
      fetchUserCoins();
    }
  }, [userId]);

  // Function to fetch location names for an address
  const fetchLocationNames = async (address) => {
    try {
      console.log('Fetching location names for address:', address);
      
      const provinceName = await getProvinceName(address.provinceCode);
      const districtName = await fetchDistrictName(address.provinceCode, address.districtCode);
      const wardName = await fetchWardName(address.districtCode, address.wardCode);

      console.log('Location names:', { provinceName, districtName, wardName });

      setAddressDetails(prev => ({
        ...prev,
        [address.addressId]: {
          provinceName: provinceName || 'Unknown Province',
          districtName: districtName || 'Unknown District',
          wardName: wardName || 'Unknown Ward'
        }
      }));
    } catch (error) {
      console.error('Error fetching location names:', error);
      // Set default values in case of error
      setAddressDetails(prev => ({
        ...prev,
        [address.addressId]: {
          provinceName: 'Error loading province',
          districtName: 'Error loading district',
          wardName: 'Error loading ward'
        }
      }));
    }
  };

  // Fetch client addresses
  useEffect(() => {
    const fetchClientAddresses = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/CustomerAddress', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        
        const userAddresses = response.data.filter(addr => addr.accountId === parseInt(userId));
        console.log('Addresses from API:', userAddresses); // Debug log
        setAddresses(userAddresses);

        // Fetch location names for each address
        for (const address of userAddresses) {
          await fetchLocationNames(address);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load delivery addresses');
      }
    };

    if (userId) {
      fetchClientAddresses();
    }
  }, [userId]);

  // Fetch account details
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const newDetails = {};
        for (const address of addresses) {
          if (!accountDetails[address.accountId]) {
            const accountData = await getAccountById(address.accountId);
            if (accountData) {
              newDetails[address.accountId] = accountData;
            }
          }
        }
        
        if (Object.keys(newDetails).length > 0) {
          setAccountDetails(prev => ({
            ...prev,
            ...newDetails
          }));
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    };

    if (addresses.length > 0) {
      fetchAccountDetails();
    }
  }, [addresses]);

  // Add useEffect to fetch sender address
  useEffect(() => {
    const fetchSenderAddress = async () => {
      try {
        if (selectedOrders.length > 0 && selectedOrders[0]?.bookDetails?.senderAddressId) {
          const senderAddressId = selectedOrders[0].bookDetails.senderAddressId;
          const response = await axios.get(
            `https://rmrbdapi.somee.com/odata/CustomerAddress/${senderAddressId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Token': '123-abc',
              },
            }
          );
          
          // Fetch location names for sender address
          const provinceName = await getProvinceName(response.data.provinceCode);
          const districtName = await fetchDistrictName(response.data.provinceCode, response.data.districtCode);
          const wardName = await fetchWardName(response.data.districtCode, response.data.wardCode);

          setSenderAddress({
            ...response.data,
            provinceName,
            districtName,
            wardName
          });
        }
      } catch (error) {
        console.error('Error fetching sender address:', error);
        toast.error('Failed to load sender address information');
      }
    };

    fetchSenderAddress();
  }, [selectedOrders]);

  // Add useEffect to fetch recipient details when address is selected
  useEffect(() => {
    const fetchRecipientDetails = async () => {
      if (selectedAddress) {
        try {
          const response = await axios.get(
            `https://rmrbdapi.somee.com/odata/Account/${selectedAddress.accountId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Token': '123-abc',
              },
            }
          );
          
          console.log('Fetched recipient details:', response.data); // Debug log
          
          // Update selected address with recipient details
          setSelectedAddress(prev => ({
            ...prev,
            accountName: response.data.userName,
            userName: response.data.userName
          }));
          
          setRecipientDetails(response.data);
        } catch (error) {
          console.error('Error fetching recipient details:', error);
          toast.error('Failed to load recipient information');
        }
      }
    };

    fetchRecipientDetails();
  }, [selectedAddress?.accountId]); // Only run when selected address changes

  const calculateShippingFeeForAddress = async (address) => {
    try {
      const senderAddressId = selectedOrders[0]?.bookDetails?.senderAddressId;
      
      if (!senderAddressId) {
        throw new Error('No sender address found');
      }

      // Fetch sender's address details
      const senderAddressResponse = await axios.get(
        `https://rmrbdapi.somee.com/odata/CustomerAddress/${senderAddressId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        }
      );

      const senderAddress = senderAddressResponse.data;
      
      // Calculate dimensions and weight with proper constraints
      const totalWeight = selectedOrders.reduce((sum, order) => {
        // Convert weight to grams and ensure minimum weight of 1 gram
        return sum + Math.max((order.bookDetails?.weight || 0), 1);
      }, 0);

      const maxDimensions = selectedOrders.reduce((dims, order) => {
        const book = order.bookDetails;
        return {
          // Ensure minimum dimensions of 1 cm
          length: Math.max(dims.length, book?.length || 1),
          width: Math.max(dims.width, book?.width || 1),
          height: Math.max(dims.height, book?.height || 1),
        };
      }, { length: 1, width: 1, height: 1 });

      // Base fee data with validated values
      const baseFeeData = {
        from_district_id: parseInt(senderAddress.districtCode),
        from_ward_code: String(senderAddress.wardCode),
        to_district_id: parseInt(address.districtCode),
        to_ward_code: String(address.wardCode),
        height: Math.max(Math.min(Math.ceil(maxDimensions.height), 200), 1),
        length: Math.max(Math.min(Math.ceil(maxDimensions.length), 200), 1),
        width: Math.max(Math.min(Math.ceil(maxDimensions.width), 200), 1),
        weight: Math.max(Math.min(Math.ceil(totalWeight), 50000), 1),
        insurance_value: calculateTotalPrice()
      };

      // Try first service ID
      try {
        const firstFeeData = { ...baseFeeData, service_type_id: 2 };
        console.log('Trying first service type:', firstFeeData);
        
        const response = await calculateShippingFee(firstFeeData);
        if (response.data?.total) {
          setShippingFee(response.data.total);
          return;
        }
      } catch (error) {
        console.log('First service ID failed, trying alternative');
      }

      // Try second service ID if first one fails
      try {
        const secondFeeData = { ...baseFeeData, service_type_id: 5 };
        console.log('Trying second service type:', secondFeeData);
        
        const response = await calculateShippingFee(secondFeeData);
        if (response.data?.total) {
          setShippingFee(response.data.total);
          return;
        }
      } catch (error) {
        console.error('Both service IDs failed');
        throw error;
      }

      // If we get here, neither service ID worked
      setShippingFee(0);
      setSelectedAddress(null); // Reset selected address
      toast.error('Khu vực không hỗ trợ giao hàng');

    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      console.error('Error response:', error.response?.data);
      setShippingFee(0);
      setSelectedAddress(null); // Reset selected address
      toast.error('Khu vực không hỗ trợ giao hàng');
    }
  };

  // Load provinces when switching to new address mode
  useEffect(() => {
    if (addressMode === 'new') {
      fetchProvinces();
    }
  }, [addressMode]);

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' }
        }
      );
      setProvinces(response.data.data || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Failed to load provinces');
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        { province_id: parseInt(provinceId) },
        {
          headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' }
        }
      );
      setDistricts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to load districts');
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        { district_id: parseInt(districtId) },
        {
          headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' }
        }
      );
      setWards(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Failed to load wards');
    }
  };

  // Add this new function to handle address confirmation
  const handleConfirmNewAddress = async () => {
    // Validate all required fields
    if (!newShippingAddress.recipientName || 
        !newShippingAddress.provinceCode || 
        !newShippingAddress.districtCode || 
        !newShippingAddress.wardCode || 
        !newShippingAddress.AddressDetail || 
        !newShippingAddress.phoneNumber) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Xác nhận địa chỉ giao hàng',
        html: `
          <div class="text-left">
            <p><strong>Người nhận:</strong> ${newShippingAddress.recipientName}</p>
            <p><strong>Số điện thoại:</strong> ${newShippingAddress.phoneNumber}</p>
            <p><strong>Địa chỉ:</strong> ${newShippingAddress.AddressDetail}</p>
            <p><strong>Khu vực:</strong> ${provinces.find(p => p.ProvinceID === parseInt(newShippingAddress.provinceCode))?.ProvinceName}, 
            ${districts.find(d => d.DistrictID === parseInt(newShippingAddress.districtCode))?.DistrictName}, 
            ${wards.find(w => w.WardCode === newShippingAddress.wardCode)?.WardName}</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        // Create a temporary address object for fee calculation
        const tempAddress = {
          addressId: Date.now(), // Temporary ID
          districtCode: newShippingAddress.districtCode,
          wardCode: newShippingAddress.wardCode,
          addressDetail: newShippingAddress.AddressDetail,
          phoneNumber: newShippingAddress.phoneNumber,
          userName: newShippingAddress.recipientName,
        };

        // Set as selected address and calculate shipping fee
        setSelectedAddress(tempAddress);
        await calculateShippingFeeForAddress(tempAddress);
        
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã xác nhận địa chỉ giao hàng',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error confirming address:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể xác nhận địa chỉ. Vui lòng thử lại.',
        icon: 'error'
      });
    }
  };

  // Update the renderAddressForm to include the confirm button
  const renderAddressForm = () => (
    <div>
      <Form className="space-y-4">
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Recipient Name</Form.Label>
              <Form.Control
                type="text"
                name="recipientName"
                value={newShippingAddress.recipientName}
                onChange={handleNewAddressChange}
                required
                placeholder="Enter recipient's name"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Province</Form.Label>
              <Form.Select
                name="provinceCode"
                value={newShippingAddress.provinceCode}
                onChange={(e) => {
                  handleNewAddressChange(e);
                  fetchDistricts(e.target.value);
                  setNewShippingAddress(prev => ({ ...prev, districtCode: '', wardCode: '' }));
                }}
                required
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>District</Form.Label>
              <Form.Select
                name="districtCode"
                value={newShippingAddress.districtCode}
                onChange={(e) => {
                  handleNewAddressChange(e);
                  fetchWards(e.target.value);
                  setNewShippingAddress(prev => ({ ...prev, wardCode: '' }));
                }}
                required
                disabled={!newShippingAddress.provinceCode}
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Ward</Form.Label>
              <Form.Select
                name="wardCode"
                value={newShippingAddress.wardCode}
                onChange={handleNewAddressChange}
                required
                disabled={!newShippingAddress.districtCode}
              >
                <option value="">Select Ward</option>
                {wards.map(ward => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Address Detail</Form.Label>
              <Form.Control
                as="textarea"
                name="AddressDetail"
                value={newShippingAddress.AddressDetail}
                onChange={handleNewAddressChange}
                rows={2}
                required
                placeholder="Enter street address, building, etc."
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={newShippingAddress.phoneNumber}
                onChange={handleNewAddressChange}
                required
                placeholder="Enter recipient's phone number"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* Updated confirm button styling */}
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleConfirmNewAddress}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200 border-none"
          style={{ width: 'auto', backgroundColor: '#f97316', border: 'none' }}
        >
          Xác Nhận Địa Chỉ
        </Button>
      </div>

      {/* Show confirmed address details */}
      {selectedAddress && addressMode === 'new' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Confirmed Address Details:</h4>
          <p><span className="font-medium">Recipient:</span> {selectedAddress.userName}</p>
          <p><span className="font-medium">Phone:</span> {selectedAddress.phoneNumber}</p>
          <p><span className="font-medium">Address:</span> {selectedAddress.addressDetail}</p>
          <p><span className="font-medium">Location:</span> {' '}
            {provinces.find(p => p.ProvinceID === parseInt(newShippingAddress.provinceCode))?.ProvinceName}, {' '}
            {districts.find(d => d.DistrictID === parseInt(newShippingAddress.districtCode))?.DistrictName}, {' '}
            {wards.find(w => w.WardCode === newShippingAddress.wardCode)?.WardName}
          </p>
        </div>
      )}
    </div>
  );

  // Update the renderAddressDropdown to use the new form
  const renderAddressDropdown = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Địa Chỉ Giao Hàng</h3>
      
      {/* Address Mode Selection */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`flex-1 py-2 px-4 rounded-lg border transition-all duration-300 ease-in-out ${
            addressMode === 'select'
              ? 'bg-orange-100 border-orange-500 text-orange-700 opacity-100'
              : 'border-gray-300 text-gray-600 hover:border-orange-300 opacity-75 hover:opacity-100'
          }`}
          onClick={() => setAddressMode('select')}
        >
          Dùng Địa Chỉ Của Tôi
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg border transition-all duration-300 ease-in-out ${
            addressMode === 'new'
              ? 'bg-orange-100 border-orange-500 text-orange-700 opacity-100'
              : 'border-gray-300 text-gray-600 hover:border-orange-300 opacity-75 hover:opacity-100'
          }`}
          onClick={() => setAddressMode('new')}
        >
          Giao Đến Địa Chỉ Khác
        </button>
      </div>

      {addressMode === 'select' ? (
        // Existing Addresses Section
        addresses.length > 0 ? (
          <div className="space-y-4">
            <div className="relative">
              <select
                className={`w-full p-2 border rounded-lg ${
                  isAddressLoading || isRecipientLoading ? 'bg-gray-100' : 'bg-white'
                }`}
                value={selectedAddress?.addressId || ''}
                onChange={async (e) => {
                  const selected = addresses.find(addr => addr.addressId === parseInt(e.target.value));
                  if (selected) {
                    setIsAddressLoading(true);
                    setSelectedAddress(selected);
                    try {
                      // Fetch recipient details immediately after selection
                      const response = await axios.get(
                        `https://rmrbdapi.somee.com/odata/Account/${selected.accountId}`,
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            'Token': '123-abc',
                          },
                        }
                      );
                      
                      setSelectedAddress(prev => ({
                        ...prev,
                        accountName: response.data.userName,
                        userName: response.data.userName
                      }));
                      
                      // Calculate shipping fee after recipient details are loaded
                      await calculateShippingFeeForAddress(selected);
                    } catch (error) {
                      console.error('Error loading address details:', error);
                      toast.error('Failed to load address details');
                    } finally {
                      setIsAddressLoading(false);
                    }
                  } else {
                    setSelectedAddress(null);
                  }
                }}
                disabled={isAddressLoading || isRecipientLoading}
              >
                <option value="">Chọn Địa Chỉ</option>
                {addresses.map((address) => {
                  const locationDetails = addressDetails[address.addressId] || {};
                  const account = accountDetails[address.accountId];
                  
                  return (
                    <option key={address.addressId} value={address.addressId}>
                      {`${address.addressDetail}, 
                      ${locationDetails.wardName || 'Loading...'}, 
                      ${locationDetails.districtName || 'Loading...'}, 
                      ${locationDetails.provinceName || 'Loading...'}`}
                    </option>
                  );
                })}
              </select>
              {(isAddressLoading || isRecipientLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
            
            {selectedAddress && !isAddressLoading && !isRecipientLoading && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Chi Tiết Địa Chỉ Đã Chọn:</h4>
                <p><span className="font-medium">Người Nhận:</span> {selectedAddress.userName || selectedAddress.accountName || 'Đang tải...'}</p>
                <p><span className="font-medium">Số Điện Thoại:</span> {selectedAddress.phoneNumber}</p>
                <p><span className="font-medium">Địa Chỉ:</span> {selectedAddress.addressDetail}</p>
                <p><span className="font-medium">Khu Vực:</span> {' '}
                  {addressDetails[selectedAddress.addressId]?.wardName || 'Đang tải...'}, {' '}
                  {addressDetails[selectedAddress.addressId]?.districtName || 'Đang tải...'}, {' '}
                  {addressDetails[selectedAddress.addressId]?.provinceName || 'Đang tải...'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">Không tìm thấy địa chỉ đã lưu</p>
            <button
              onClick={() => navigate('/address')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              + Thêm Địa Chỉ Mới Vào Hồ Sơ
            </button>
          </div>
        )
      ) : (
        // New Address Form
        <Form className="space-y-4">
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Tên Người Nhận</Form.Label>
                <Form.Control
                  type="text"
                  name="recipientName"
                  value={newShippingAddress.recipientName}
                  onChange={handleNewAddressChange}
                  required
                  placeholder="Nhập tên người nhận"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Tỉnh/Thành Phố</Form.Label>
                <Form.Select
                  name="provinceCode"
                  value={newShippingAddress.provinceCode}
                  onChange={(e) => {
                    handleNewAddressChange(e);
                    fetchDistricts(e.target.value);
                    setNewShippingAddress(prev => ({ ...prev, districtCode: '', wardCode: '' }));
                  }}
                  required
                >
                  <option value="">Chọn Tỉnh/Thành Phố</option>
                  {provinces.map(province => (
                    <option key={province.ProvinceID} value={province.ProvinceID}>
                      {province.ProvinceName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Quận/Huyện</Form.Label>
                <Form.Select
                  name="districtCode"
                  value={newShippingAddress.districtCode}
                  onChange={(e) => {
                    handleNewAddressChange(e);
                    fetchWards(e.target.value);
                    setNewShippingAddress(prev => ({ ...prev, wardCode: '' }));
                  }}
                  required
                  disabled={!newShippingAddress.provinceCode}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map(district => (
                    <option key={district.DistrictID} value={district.DistrictID}>
                      {district.DistrictName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Phường/Xã</Form.Label>
                <Form.Select
                  name="wardCode"
                  value={newShippingAddress.wardCode}
                  onChange={handleNewAddressChange}
                  required
                  disabled={!newShippingAddress.districtCode}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map(ward => (
                    <option key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Địa Chỉ Chi Tiết</Form.Label>
                <Form.Control
                  as="textarea"
                  name="AddressDetail"
                  value={newShippingAddress.AddressDetail}
                  onChange={handleNewAddressChange}
                  rows={2}
                  required
                  placeholder="Nhập số nhà, tên đường..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Số Điện Thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={newShippingAddress.phoneNumber}
                  onChange={handleNewAddressChange}
                  required
                  placeholder="Nhập số điện thoại người nhận"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleConfirmNewAddress}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200 border-none"
              style={{ width: 'auto', backgroundColor: '#f97316', border: 'none' }}
            >
              Xác Nhận Địa Chỉ
            </Button>
          </div>
        </Form>
      )}
    </div>
  );

  // Add this new helper function for dynamic currency formatting
  const formatAmount = (amount, paymentType = paymentMethod) => {
    if (paymentType === 'COINS') {
      return `${amount.toLocaleString('vi-VN')} xu`;
    } else {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedOrders.reduce((total, order) => total + (order?.totalPrice || 0), 0);
  };

  // Calculate final price including fees (remove COD fee)
  const calculateCombinedTotalPrice = () => {
    const subtotal = calculateTotalPrice();
    return subtotal + shippingFee;
  };

  // Convert payment method to numeric type
  const paymentTypeMap = {
    'COD': 2,    // Cash on Delivery is type 2
    'COINS': 1   // Pay with Coins is type 1
  };

  // Modify handlePlaceOrder to handle grouped orders
  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      if (!selectedAddress) {
        toast.error('Vui lòng chọn địa chỉ giao hàng');
        return;
      }
      if (!paymentMethod) {
        toast.error('Vui lòng chọn phương thức thanh toán');
        return;
      }

      // Handle coin payment first if applicable
      if (paymentMethod === 'COINS') {
        const totalAmount = calculateCombinedTotalPrice();
        if (userCoins < totalAmount) {
          toast.error('Số dư xu không đủ để thực hiện giao dịch');
          return;
        }

        // Update user's coin balance
        try {
          // First get the current account data
          const accountResponse = await axios.get(
            `https://rmrbdapi.somee.com/odata/Account/${userId}`,
            {
              headers: {
                'Token': '123-abc'
              }
            }
          );

          const currentAccount = accountResponse.data;
          
          // Then update with all required fields
          const response = await axios.put(
            `https://rmrbdapi.somee.com/odata/Account/info/${userId}`,
            {
              ...currentAccount,
              coin: userCoins - totalAmount
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Token': '123-abc'
              }
            }
          );
          console.log('Coin balance updated:', response.data);
        } catch (error) {
          console.error('Error updating coin balance:', error);
          throw new Error('Failed to update coin balance');
        }
      }

      // Create shipping orders for each group
      const shippingOrderPromises = Object.entries(groupedOrders).map(async ([senderAddressId, orders]) => {
        const senderAddressResponse = await axios.get(
          `https://rmrbdapi.somee.com/odata/CustomerAddress/${senderAddressId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': '123-abc',
            }
          }
        );

        const codAmount = paymentMethod === 'COD' ? 
          orders.reduce((total, order) => total + order.totalPrice, 0) + (shippingFee / Object.keys(groupedOrders).length) : 
          0;

        return createShippingOrder(
          orders.map(order => order.bookDetails),
          selectedAddress,
          senderAddressResponse.data,
          codAmount
        );
      });

      const shippingOrders = await Promise.all(shippingOrderPromises);

      // Create book orders for each group
      const orderPromises = Object.entries(groupedOrders).map(async ([senderAddressId, orders], index) => {
        const orderPayload = {
          orderId: 0,
          customerId: parseInt(userId),
          totalPrice: orders.reduce((total, order) => total + order.totalPrice, 0) + (shippingFee / Object.keys(groupedOrders).length),
          shipFee: shippingFee / Object.keys(groupedOrders).length,
          price: orders.reduce((total, order) => total + order.totalPrice, 0),
          purchaseDate: new Date().toISOString(),
          paymentType: paymentTypeMap[paymentMethod],
          orderCode: shippingOrders[index].data?.order_code || null,
          status: 1,
          clientAddressId: addressMode === 'select' ? parseInt(selectedAddress.addressId) : null,
          shippingAddress: addressMode === 'new' ? {
            recipientName: selectedAddress.userName,
            phoneNumber: selectedAddress.phoneNumber,
            addressDetail: selectedAddress.addressDetail,
            wardCode: selectedAddress.wardCode,
            districtCode: selectedAddress.districtCode,
            provinceCode: selectedAddress.provinceCode
          } : null,
          bookOrderDetails: orders.map(order => ({
            bookId: order.bookDetails.bookId,
            quantity: order.quantity,
            price: order.price
          }))
        };

        return axios.post(
          'https://rmrbdapi.somee.com/odata/BookOrder',
          orderPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': '123-abc'
            }
          }
        );
      });

      const bookOrders = await Promise.all(orderPromises);

      // Create order statuses and transactions
      await Promise.all(bookOrders.map(async (order) => {
        await createOrderStatus(
          order.data.orderId,
          1,
          'ready_to_pick'
        );

        await createBookTransaction(
          userId,
          order.data.orderId,
          order.data.totalPrice,
          paymentTypeMap[paymentMethod]
        );
      }));

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Đặt đơn hàng thành công!",
        text: "Cảm ơn bạn đã mua hàng",
        showConfirmButton: false,
        timer: 1500
      });

      // Navigate after success
      navigate('/orders', { 
        replace: true,
        state: { selectedOrders: [] }
      });

    } catch (error) {
      console.error('Error placing order:', error);
      
      // If there was an error and we were using coins, we should try to refund them
      if (paymentMethod === 'COINS') {
        try {
          const accountResponse = await axios.get(
            `https://rmrbdapi.somee.com/odata/Account/${userId}`,
            {
              headers: {
                'Token': '123-abc'
              }
            }
          );

          const currentAccount = accountResponse.data;

          await axios.put(
            `https://rmrbdapi.somee.com/odata/Account/info/${userId}`,
            {
              ...currentAccount,
              coin: userCoins // Restore original coin amount
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Token': '123-abc'
              }
            }
          );
        } catch (refundError) {
          console.error('Error refunding coins:', refundError);
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Đặt hàng thất bại',
        text: error.message || 'Vui lòng thử lại sau',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add this helper function to check if user can pay
  const canPlaceOrder = () => {
    if (!paymentMethod || !selectedAddress) return false;
    if (paymentMethod === 'COINS' && userCoins < calculateCombinedTotalPrice()) {
      console.log('Coins check:', { userCoins, required: calculateCombinedTotalPrice() });
      return false;
    }
    return true;
  };

  if (!selectedOrders?.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No items selected for checkout</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="bg-gray-100 min-h-screen py-4"
    >
      {isProcessing && <LoadingOverlay />}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sản Phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Đơn Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Số Lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Thành Tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedOrders.map((order, index) => {
                // Safely access nested properties with null checks
                const bookDetails = order?.bookDetails || {};
                const images = bookDetails?.images || [];
                const firstImage = images[0] || {};
                const imageUrl = firstImage?.imageUrl || '';
                const bookName = bookDetails?.bookName || 'Unknown Book';
                const price = order?.price || 0;
                const quantity = order?.quantity || 0;
                const totalPrice = order?.totalPrice || 0;

                return (
                  <tr key={order?.orderDetailId || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={bookName}
                            className="w-12 h-16 object-cover rounded mr-4"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {bookName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatAmount(price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatAmount(totalPrice)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Address Dropdown */}
        {renderAddressDropdown()}

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Phương Thức Thanh Toán</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coins Payment Option */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === 'COINS'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setPaymentMethod('COINS')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Thanh Toán Bằng Xu</h4>
                  <p className="text-sm">
                    <span className="text-gray-500">Số Dư: {formatAmount(userCoins)}</span>
                    {paymentMethod === 'COINS' && userCoins < calculateCombinedTotalPrice() && (
                      <span className="text-red-500 ml-2">
                        (Cần: {formatAmount(calculateCombinedTotalPrice())})
                      </span>
                    )}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                  {paymentMethod === 'COINS' && (
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                  )}
                </div>
              </div>
            </div>

            {/* COD Payment Option */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === 'COD'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setPaymentMethod('COD')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Thanh Toán Khi Nhận Hàng</h4>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                  {paymentMethod === 'COD' && (
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Tổng Quan Đơn Hàng</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm Tính:</span>
              <span>{formatAmount(calculateTotalPrice())}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí Vận Chuyển:</span>
              <span>{formatAmount(shippingFee)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng Cộng:</span>
                <span>{formatAmount(calculateCombinedTotalPrice())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Place Order Button - Update this section */}
        <div className="flex justify-end">
          <button
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder()}
            className={`px-6 py-2 rounded-lg font-medium text-white transition-all
              ${!canPlaceOrder()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
              }`}
          >
            Đặt Hàng
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;