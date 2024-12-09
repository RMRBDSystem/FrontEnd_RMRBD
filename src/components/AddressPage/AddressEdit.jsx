import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Form, Modal } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { FaEdit, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const AddressEdit = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const userId = Cookies.get('UserId');

  useEffect(() => {
    const fetchAddressesWithDetails = async () => {
      try {
        const response = await axios.get(`https://rmrbdapi.somee.com/odata/CustomerAddress`, {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        const filteredAddresses = response.data.filter(address => address.accountId === parseInt(userId));

        const addressesWithDetails = await Promise.all(
          filteredAddresses.map(async (address) => {
            const provinceName = await getProvinceName(address.provinceCode);
            const districtName = await fetchDistrictName(address.provinceCode, address.districtCode);
            const WardName = await fetchWardName(address.districtCode, address.wardCode);
        
            return {
              ...address,
              provinceName: provinceName || 'Unknown Province',
              districtName: districtName || 'Unknown District',
              WardName: WardName || 'Unknown Ward',  // Make sure to correctly assign the ward name
            };
          })
        );

        setAddresses(addressesWithDetails);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        showErrorAlert('Failed to load addresses.');
      }
    };

    fetchAddressesWithDetails();
  }, [userId]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
          headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' }
        });
        setProvinces(response.data.data || []);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        showErrorAlert('Failed to load provinces.');
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    // Reset district and ward when province changes
    if (selectedAddress?.provinceCode) {
      setSelectedAddress(prev => ({
        ...prev,
        districtCode: '',
        wardCode: ''
      }));

      fetchDistricts(selectedAddress.provinceCode);
    }
  }, [selectedAddress?.provinceCode]);

  const getProvinceName = async (provinceCode) => {
    try {
      const response = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' }
      });
      const province = response.data.data.find((prov) => prov.ProvinceID === Number(provinceCode));
      return province ? province.ProvinceName : null;
    } catch (error) {
      console.error('Error fetching province name:', error);
      return null;
    }
  };

  const fetchDistrictName = async (provinceCode, districtCode) => {
    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        { province_id: Number(provinceCode) },
        { headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' } }
      );
      const district = response.data.data.find((dist) => dist.DistrictID === districtCode);
      return district ? district.DistrictName : null;
    } catch (error) {
      console.error('Error fetching district name:', error);
      return null;
    }
  };

  const fetchWardName = async (districtCode, wardCode) => {
    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        { district_id: Number(districtCode) },
        { headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' } }
      );
      const ward = response.data.data.find((w) => w.WardCode === wardCode);
      return ward ? ward.WardName : null;
    } catch (error) {
      console.error('Error fetching ward name:', error);
      return null;
    }
  };

  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        { province_id: Number(provinceCode) },
        { headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' } }
      );
      setDistricts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
      showErrorAlert('Failed to load districts.');
    }
  };

  useEffect(() => {
    // Fetch wards when district changes
    if (selectedAddress?.districtCode) {
      fetchWards(selectedAddress.districtCode);
    }
  }, [selectedAddress?.districtCode]);

  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        { district_id: Number(districtCode) },
        { headers: { 'Token': '780e97f0-7ffa-11ef-8e53-0a00184fe694' } }
      );
      setWards(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
      showErrorAlert('Failed to load wards.');
    }
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    fetchDistricts(address.provinceCode);  // Fetch districts for province first
    fetchWards(address.districtCode);      // Fetch wards for district second
    setShowModal(true);
    setOtpSent(false);
    setOtpVerified(false);
    setIsPhoneAvailable(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#f97316', // orange-500
      timer: 2000,
      timerProgressBar: true
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#f97316', // orange-500
    });
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };

  const checkPhoneNumberExists = async () => {
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/CustomerAddress?$filter=phoneNumber eq '${selectedAddress.phoneNumber}'`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        }
      );
      if (response.data.value.length > 0) {
        setIsPhoneAvailable(true);
      } else {
        setIsPhoneAvailable(false);
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      showErrorAlert('Failed to check phone number availability.');
    }
  };

  const handleSendOtp = async () => {
    showLoadingAlert();
    try {
      // Your OTP sending logic here
      setOtpSent(true);
      Swal.close(); // Close loading alert
      showSuccessAlert('OTP sent successfully!');
    } catch (error) {
      Swal.close();
      showErrorAlert('Failed to send OTP.');
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456') {  // Replace with actual verification logic
      setOtpVerified(true);
      showSuccessAlert('OTP verified successfully!');
    } else {
      showErrorAlert('Invalid OTP. Please try again.');
    }
  };

  const showSuccessToast = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Đã cập nhật địa chỉ thành công!'
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault();
  
    if (!selectedAddress.wardCode || !selectedAddress.districtCode || 
        !selectedAddress.provinceCode || !selectedAddress.addressDetail || 
        !selectedAddress.phoneNumber) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Vui lòng điền đầy đủ thông tin.',
        confirmButtonColor: '#f97316'
      });
      return;
    }
  
    const addressData = {
      AddressID: selectedAddress.addressId,
      AccountID: userId,
      PhoneNumber: selectedAddress.phoneNumber,
      AddressStatus: selectedAddress.addressStatus || 1,
      wardCode: selectedAddress.wardCode,
      districtCode: selectedAddress.districtCode,
      provinceCode: selectedAddress.provinceCode,
      addressDetail: selectedAddress.addressDetail,
    };
  
    // Show loading spinner
    Swal.fire({
      title: 'Đang xử lý...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const response = await axios.put(
        `https://rmrbdapi.somee.com/odata/CustomerAddress/${selectedAddress.addressId}`, 
        addressData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        // Update the address in the local state
        setAddresses(prevAddresses => {
          return prevAddresses.map(addr => {
            if (addr.addressId === selectedAddress.addressId) {
              const province = provinces.find(p => p.ProvinceID === Number(selectedAddress.provinceCode));
              const district = districts.find(d => d.DistrictID === Number(selectedAddress.districtCode));
              const ward = wards.find(w => w.WardCode === selectedAddress.wardCode);
              
              return {
                ...addr,
                addressDetail: selectedAddress.addressDetail,
                phoneNumber: selectedAddress.phoneNumber,
                provinceCode: selectedAddress.provinceCode,
                districtCode: selectedAddress.districtCode,
                wardCode: selectedAddress.wardCode,
                provinceName: province?.ProvinceName || addr.provinceName,
                districtName: district?.DistrictName || addr.districtName,
                WardName: ward?.WardName || addr.WardName
              };
            }
            return addr;
          });
        });

        // Close loading spinner
        Swal.close();

        // Show success toast
        showSuccessToast();

        // Close the modal with animation
        setShowModal(false);

        // Add animation to the updated address card
        const updatedCard = document.querySelector(`[data-address-id="${selectedAddress.addressId}"]`);
        if (updatedCard) {
          updatedCard.classList.add('highlight-update');
          setTimeout(() => {
            updatedCard.classList.remove('highlight-update');
          }, 2000);
        }
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Lỗi cập nhật địa chỉ. Vui lòng thử lại.',
        confirmButtonColor: '#f97316'
      });
      console.error('Error saving address:', error);
    }
  };

  return (
    <div className="min-h-screen py-4 bg-gray-50">
      <Container className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-orange-500" />
            Địa chỉ của tôi
          </h2>

          <div className="grid gap-4">
            {addresses.map((address) => (
              <motion.div
                key={address.addressId}
                data-address-id={address.addressId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-2 text-orange-500" />
                      <span className="font-medium">{address.addressDetail}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="mr-2 text-green-500" />
                      <span>{address.phoneNumber}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {address.provinceName} • {address.districtName} • {address.WardName}
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleEditAddress(address)}
                    className="flex items-center px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Modal Design */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)}
          className="fade"
          centered
        >
          <Modal.Header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <Modal.Title className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Edit Address
            </Modal.Title>
            <button
              className="text-white opacity-70 hover:opacity-100 text-xl font-semibold"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body className="p-6">
            <Form onSubmit={saveAddress} className="space-y-4">
              {/* Address Detail */}
              <div className="relative">
                <Form.Control
                  type="text"
                  name="addressDetail"
                  value={selectedAddress?.addressDetail || ''}
                  onChange={handleInputChange}
                  className="peer w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none"
                  placeholder="Enter address detail"
                />
                <Form.Label className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-2">
                  Address Detail
                </Form.Label>
              </div>

              {/* Phone Number Section */}
              <div className="space-y-2">
                <div className="relative">
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={selectedAddress?.phoneNumber || ''}
                    onChange={handleInputChange}
                    onBlur={checkPhoneNumberExists}
                    className="peer w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                              focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    placeholder="Enter phone number"
                  />
                  <Form.Label className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-2">
                    Phone Number
                  </Form.Label>
                </div>

                {isPhoneAvailable === false && (
                  <Button
                    variant="primary"
                    onClick={handleSendOtp}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Send OTP
                  </Button>
                )}

                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Form.Control
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200"
                      placeholder="Enter OTP"
                    />
                    <Button
                      variant="success"
                      onClick={handleVerifyOtp}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    >
                      Verify OTP
                    </Button>
                  </motion.div>
                )}

                {otpVerified && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-500 text-center font-medium"
                  >
                    ✓ OTP Verified Successfully
                  </motion.div>
                )}
              </div>

              {/* Location Selects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Form.Select
                    name="provinceCode"
                    value={selectedAddress?.provinceCode || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                              focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Label className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-2">
                    Province
                  </Form.Label>
                </div>

                <div className="relative">
                  <Form.Select
                    name="districtCode"
                    value={selectedAddress?.districtCode || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                              focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Label className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-2">
                    District
                  </Form.Label>
                </div>

                <div className="relative">
                  <Form.Select
                    name="wardCode"
                    value={selectedAddress?.wardCode || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                              focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Select Ward</option>
                    {wards.map((ward) => (
                      <option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Label className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-white px-2">
                    Ward
                  </Form.Label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

// Add this CSS to your stylesheet
const styles = `
  .highlight-update {
    animation: highlightFade 2s ease-in-out;
  }

  @keyframes highlightFade {
    0% {
      background-color: rgba(249, 115, 22, 0.2);
      transform: scale(1.02);
    }
    100% {
      background-color: transparent;
      transform: scale(1);
    }
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AddressEdit;
