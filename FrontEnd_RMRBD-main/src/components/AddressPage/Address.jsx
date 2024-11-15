import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';

const Address = () => {
  const [address, setAddress] = useState({
    AddressID: '',
    AccountID: '',
    AddressStatus: 1,
    wardCode: '',
    districtCode: '',
    provinceCode: '',
    AddressDetail: '',
    phoneNumber: '',
    Latitude: '',
    Longitude: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); 
  const [isPhoneChecking, setIsPhoneChecking] = useState(false);
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(null);
  const userId = Cookies.get('UserId');

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
    const debounceTimeout = setTimeout(() => {
      if (address.phoneNumber.length >= 10) {
        handlephoneNumberCheck();
      }
    }, 500); 

    return () => clearTimeout(debounceTimeout);
  }, [address.phoneNumber]);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (otpTimer === 0 && otpSent) {
      setOtpSent(false);
      setOtpCode('');
      toast.error('OTP expired. Please request a new one.');
    }
    
    return () => clearInterval(timer);
  }, [otpTimer, otpSent]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlephoneNumberChange = (e) => {
    let numericValue = e.target.value.replace(/\D/g, '');
    
    if (numericValue.startsWith('0')) {
      numericValue = '84' + numericValue.slice(1);
    }
  
    setAddress((prev) => ({ ...prev, phoneNumber: numericValue.trim() }));
    setOtpSent(false); // Reset OTP sent status
    setOtpCode('');    // Reset OTP code input
    setOtpVerified(false); // Reset OTP verified status
  };

  const checkphoneNumberExists = async (phoneNumber) => {
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/CustomerAddress?$filter=phoneNumber eq '${phoneNumber}'`,
        {
          headers: {
            'Token': '123-abc',
          },
        }
      );
  
      // Log the full response data to confirm structure
      console.log('Full response data:', response.data);
  
      // Check if response data is an array directly
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('Phone number found:', response.data);
        return true; // Phone number exists
      } else {
        console.log('No matching phone number found');
        return false; // Phone number does not exist
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      toast.error('Error checking phone number. Please try again.');
      return false; // Return false in case of error
    }
  };
  
const handlephoneNumberCheck = async () => {
  setIsPhoneChecking(true);

  const phoneExists = await checkphoneNumberExists(address.phoneNumber);

  setIsPhoneChecking(false);
  
  if (phoneExists) {
    setIsPhoneAvailable(true); // Phone exists
    toast.success('Phone number already exists. You can skip OTP and save the address.');
    setOtpVerified(true); // Skip OTP verification
  } else {
    setIsPhoneAvailable(false); // Phone does not exist
    toast.error('Phone number does not exist. Please send OTP to verify.');
    setOtpSent(false); // Reset OTP state
    setOtpVerified(false); // Reset OTP verified state
  }
};

const handleSendOtp = async () => {
  if (!address.phoneNumber || address.phoneNumber.length < 10) {
    toast.error('Please enter a valid phone number.');
    return;
  }

  const payload = { phoneNumber: address.phoneNumber };
  console.log("Sending OTP with payload:", payload); // Log the payload

  try {
    const response = await axios.post(
      'https://rmrbdapi.somee.com/odata/SMSSender/send',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      }
    );
    console.log("OTP send response:", response.data); // Log the response from OTP sending API

    if (response.status === 200) {
      toast.success('OTP sent successfully!');
      setOtpSent(true);
      setOtpTimer(300); 
    } else {
      toast.error('Failed to send OTP.');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    toast.error('Error sending OTP. Please try again.');
  }
};

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      toast.error('Please enter the OTP.');
      return;
    }

    try {
      const response = await axios.post(
        'https://rmrbdapi.somee.com/odata/SMSSender/verify',
        { phoneNumber: address.phoneNumber, OTPCode: otpCode },
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        }
      );

      if (response.status === 200) {
        toast.success('OTP verified successfully!');
        setOtpVerified(true);
      } else {
        toast.error('Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(`Error verifying OTP: ${error.message || 'Unknown error'}`);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
  
    // Check phone number existence and ensure OTP verification for new numbers
    if (!otpVerified && !(await checkphoneNumberExists(address.phoneNumber))) {
      toast.error('Please verify your OTP before saving the address.');
      return;
    }
  
    const addressData = {
      AddressID: address.AddressID || 0,
      AccountID: userId,
      phoneNumber: address.phoneNumber,
      AddressStatus: address.AddressStatus || 1,
      wardCode: address.wardCode,
      districtCode: Number(address.districtCode),
      provinceCode: Number(address.provinceCode),
      AddressDetail: address.AddressDetail,
      BookOrders: [],
      Books: []
    };
  
    try {
      const response = await axios({
        method: address.AddressID ? 'put' : 'post',
        url: address.AddressID 
          ? `https://rmrbdapi.somee.com/odata/CustomerAddress/${address.AddressID}`
          : 'https://rmrbdapi.somee.com/odata/CustomerAddress',
        data: addressData,
        headers: { 'Content-Type': 'application/json', 'Token': '123-abc' }
      });
  
      if (response.status === 200 || response.status === 201) {
        toast.success('Address saved successfully!');
        resetForm();
      } else {
        toast.error('Error saving address. Please try again.');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Error saving address. Please try again.');
    }
  };

  const resetForm = () => {
    setAddress({
      AddressID: '',
      AccountID: '',
      AddressStatus: 1,
      wardCode: '',
      districtCode: '',
      provinceCode: '',
      AddressDetail: '',
      phoneNumber: '',
      Latitude: '',
      Longitude: '',
    });
    setOtpSent(false);
    setOtpCode('');
    setOtpVerified(false);
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Container className="my-5">
        <h2 className="text-center mb-4">Add Shipping Address</h2>

        <Form onSubmit={saveAddress}>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="provinceCode">
                <Form.Label>Province</Form.Label>
                <Form.Control
                  as="select"
                  name="provinceCode"
                  id="provinceCode"
                  value={address.provinceCode}
                  onChange={(e) => {
                    handleInputChange(e);
                    fetchDistricts(e.target.value);
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
            </Col>

            <Col>
              <Form.Group controlId="districtCode">
                <Form.Label>District</Form.Label>
                <Form.Control
                  as="select"
                  name="districtCode"
                  id="districtCode"
                  value={address.districtCode}
                  onChange={(e) => {
                    handleInputChange(e);
                    fetchWards(e.target.value);
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
            </Col>

            <Col>
              <Form.Group controlId="wardCode">
                <Form.Label>Ward</Form.Label>
                <Form.Control
                  as="select"
                  name="wardCode"
                  id="wardCode"
                  value={address.wardCode}
                  onChange={handleInputChange}
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
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="AddressDetail">
                <Form.Label>Address Detail</Form.Label>
                <Form.Control
                  as="textarea"
                  name="AddressDetail"
                  rows={3}
                  value={address.AddressDetail}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
          <Col xs={8}>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                name="phoneNumber"
                value={address.phoneNumber}
                onChange={handlephoneNumberChange}
                maxLength={15}
                inputMode="numeric"
                required
              />
            </Form.Group>
          </Col>
          <Col xs={4} className="d-flex align-items-end">
            {isPhoneChecking ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : isPhoneAvailable ? (
              <Button variant="secondary" onClick={saveAddress} disabled={!otpVerified}>
                {otpVerified ? 'Send OTP' : 'Verify OTP to Save'}
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleSendOtp} disabled={otpSent || isPhoneChecking}>
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </Button>
            )}
          </Col>
        </Row>

          {otpSent && (
            <Row className="mb-4">
              <Col>
                <Form.Group controlId="otpCode">
                  <Form.Label>Enter OTP (expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')})</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs="auto" className="d-flex align-items-end">
                <Button variant="success" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>
              </Col>
            </Row>
          )}

          <Button type="submit" variant="primary">
            Save Address
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Address;
