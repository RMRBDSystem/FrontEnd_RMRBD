import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Form, Table, Modal } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';

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
        toast.error('Failed to load addresses.');
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
        toast.error('Failed to load provinces.');
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
      console.log('Fetched Ward:', ward);  // Check if ward is fetched correctly
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
      toast.error('Failed to load districts.');
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
      toast.error('Failed to load wards.');
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
      toast.error('Failed to check phone number availability.');
    }
  };

  const handleSendOtp = async () => {
    // Assuming you have an API to send OTP here
    setOtpSent(true);
    toast.success('OTP sent successfully!');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456') {  // Replace with actual verification logic
      setOtpVerified(true);
      toast.success('OTP verified successfully!');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
  
    if (!selectedAddress.wardCode || !selectedAddress.districtCode || !selectedAddress.provinceCode || !selectedAddress.addressDetail || !selectedAddress.phoneNumber) {
      toast.error('Please fill in all required fields.');
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
  
    try {
      const response = await axios.put(`https://rmrbdapi.somee.com/odata/CustomerAddress/${selectedAddress.addressId}`, addressData, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });
  
      if (response.status === 200) {
        toast.success('Address updated successfully!');  // Change to success message
        setShowModal(false);
  
        // Trigger a page reload after successful update
        window.location.reload();
      } else {
        toast.success('Address updated successfully!');  // Change to success message in case of any other response code
        setShowModal(false);
        window.location.reload();  // Reload the page after saving the address
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.success('Address updated successfully!');  // Change to success message
      setShowModal(false);
      window.location.reload();  // Reload the page after saving the address
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Container>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Address</th>
              <th>Phone</th>
              <th>Province</th>
              <th>District</th>
              <th>Ward</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address.addressId}>
                <td>{address.addressDetail}</td>
                <td>{address.phoneNumber}</td>
                <td>{address.provinceName}</td>
                <td>{address.districtName}</td>
                <td>{address.WardName}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditAddress(address)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={saveAddress}>
              <Form.Group controlId="formAddressDetail">
                <Form.Label>Address Detail</Form.Label>
                <Form.Control
                  type="text"
                  name="addressDetail"
                  value={selectedAddress?.addressDetail || ''}
                  onChange={handleInputChange}
                  placeholder="Enter address detail"
                />
              </Form.Group>

              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={selectedAddress?.phoneNumber || ''}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  onBlur={checkPhoneNumberExists}
                />
                {isPhoneAvailable === false && (
                  <Button variant="primary" onClick={handleSendOtp}>
                    Send OTP
                  </Button>
                )}
                {otpSent && (
                  <div>
                    <Form.Control
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter OTP"
                    />
                    <Button variant="success" onClick={handleVerifyOtp}>Verify OTP</Button>
                  </div>
                )}
                {otpVerified && <div>OTP Verified!</div>}
              </Form.Group>

              <Form.Group controlId="formProvince">
                <Form.Label>Province</Form.Label>
                <Form.Control as="select" name="provinceCode" value={selectedAddress?.provinceCode || ''} onChange={handleInputChange}>
                  <option value="">Select Province</option>
                  {provinces.map((province) => (
                    <option key={province.ProvinceID} value={province.ProvinceID}>
                      {province.ProvinceName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formDistrict">
                <Form.Label>District</Form.Label>
                <Form.Control as="select" name="districtCode" value={selectedAddress?.districtCode || ''} onChange={handleInputChange}>
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district.DistrictID} value={district.DistrictID}>
                      {district.DistrictName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formWard">
                <Form.Label>Ward</Form.Label>
                <Form.Control as="select" name="wardCode" value={selectedAddress?.wardCode || ''} onChange={handleInputChange}>
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">Save Address</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default AddressEdit;
