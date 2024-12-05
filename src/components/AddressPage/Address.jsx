import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
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
        showAlert('error', 'Không thể tải danh sách tỉnh thành.');
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
      showAlert('error', 'OTP expired. Please request a new one.');
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
      showAlert('error', 'Không thể tải danh sách quận huyện.');
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
      showAlert('error', 'Không thể tải danh sách phường xã.');
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
      showAlert('error', 'Lỗi kiểm tra số điện thoại. Vui lòng thử lại.');
      return false; // Return false in case of error
    }
  };
  
const handlephoneNumberCheck = async () => {
  setIsPhoneChecking(true);

  const phoneExists = await checkphoneNumberExists(address.phoneNumber);

  setIsPhoneChecking(false);
  
  if (phoneExists) {
    setIsPhoneAvailable(true); // Phone exists
    showAlert('success', 'Số điện thoại đã tồn tại. Bạn có thể bỏ qua OTP và lưu địa chỉ.');
    setOtpVerified(true); // Skip OTP verification
  } else {
    setIsPhoneAvailable(false); // Phone does not exist
    showAlert('error', 'Số điện thoại chưa tồn tại. Vui lòng gửi OTP để xác thực.');
    setOtpSent(false); // Reset OTP state
    setOtpVerified(false); // Reset OTP verified state
  }
};

const handleSendOtp = async () => {
  if (!address.phoneNumber || address.phoneNumber.length < 10) {
    showAlert('error', 'Vui lòng nhập số điện thoại hợp lệ.');
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
      showAlert('success', 'Đã gửi OTP thành công!');
      setOtpSent(true);
      setOtpTimer(300); 
    } else {
      showAlert('error', 'Không thể gửi OTP.');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    showAlert('error', 'Lỗi khi gửi OTP. Vui lòng thử lại.');
  }
};

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      showAlert('error', 'Vui lòng nhập mã OTP.');
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
        showAlert('success', 'Xác thực OTP thành công!');
        setOtpVerified(true);
      } else {
        showAlert('error', 'Xác thực OTP thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showAlert('error', `Lỗi xác thực OTP: ${error.message || 'Unknown error'}`);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
  
    // Check phone number existence and ensure OTP verification for new numbers
    if (!otpVerified && !(await checkphoneNumberExists(address.phoneNumber))) {
      showAlert('error', 'Vui lòng xác thực OTP trước khi lưu địa chỉ.');
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
        showAlert('success', 'Đã lưu địa chỉ thành công!');
        resetForm();
      } else {
        showAlert('error', 'Lỗi khi lưu địa chỉ. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showAlert('error', 'Lỗi khi lưu địa chỉ. Vui lòng thử lại.');
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

  const showAlert = (type, message) => {
    Swal.fire({
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 1500,
      position: 'top-end',
    });
  };

  return (
    <>
      <Container className="my-5">
        <h2 className="text-center mb-4">Thêm Địa Chỉ Giao Hàng</h2>

        <Form onSubmit={saveAddress}>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="provinceCode">
                <Form.Label>Tỉnh/Thành Phố</Form.Label>
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
                  <option value="">Chọn Tỉnh/Thành Phố</option>
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
                <Form.Label>Quận/Huyện</Form.Label>
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
                  <option value="">Chọn Quận/Huyện</option>
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
                <Form.Label>Phường/Xã</Form.Label>
                <Form.Control
                  as="select"
                  name="wardCode"
                  id="wardCode"
                  value={address.wardCode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn Phường/Xã</option>
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
                <Form.Label>Chi Tiết Địa Chỉ</Form.Label>
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
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Nhập số điện thoại"
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
                <span className="visually-hidden">Đang tải...</span>
              </div>
            ) : isPhoneAvailable ? (
              <Button variant="secondary" onClick={saveAddress} disabled={!otpVerified}>
                {otpVerified ? 'Gửi OTP' : 'Xác Thực OTP Để Lưu'}
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleSendOtp} disabled={otpSent || isPhoneChecking}>
                {otpSent ? 'Gửi Lại OTP' : 'Gửi OTP'}
              </Button>
            )}
          </Col>
        </Row>

          {otpSent && (
            <Row className="mb-4">
              <Col>
                <Form.Group controlId="otpCode">
                  <Form.Label>Nhập Mã OTP (hết hạn trong {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')})</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs="auto" className="d-flex align-items-end">
                <Button variant="success" onClick={handleVerifyOtp}>
                  Xác Thực OTP
                </Button>
              </Col>
            </Row>
          )}

          <Button type="submit" variant="primary">
            Lưu Địa Chỉ
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Address;
