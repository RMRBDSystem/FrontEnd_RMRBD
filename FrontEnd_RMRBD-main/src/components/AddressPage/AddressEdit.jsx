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
            const wardName = await fetchWardName(address.districtCode, address.wardCode);

            return {
              ...address,
              provinceName: provinceName || 'Unknown Province',
              districtName: districtName || 'Unknown District',
              wardName: wardName || 'Unknown Ward',
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
      toast.error('Failed to load districts.');
    }
  };
  
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
    fetchDistricts(address.provinceCode);
    fetchWards(address.districtCode);  
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      districtCode: Number(selectedAddress.districtCode),
      provinceCode: Number(selectedAddress.provinceCode),
      AddressDetail: selectedAddress.addressDetail,
    };

    try {
      const response = await axios.put(`https://rmrbdapi.somee.com/odata/CustomerAddress/${selectedAddress.addressId}`, addressData, {
        headers: {
          'Content-Type': 'application/json',
          'Token': '123-abc',
        },
      });

      if (response.status === 200) {
        toast.success('Address updated successfully!');
        setShowModal(false);
        setSelectedAddress(null);
        fetchAddressesWithDetails();
      } else {
        toast.error('Error updating address. Please try again.');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Error updating address. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Container className="my-5">
        <h2 className="text-center mb-4">Manage Your Addresses</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Address Detail</th>
              <th>Province</th>
              <th>District</th>
              <th>Ward</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <tr key={address.addressId}>
                  <td>{index + 1}</td>
                  <td>{address.addressDetail || 'No address detail available'}</td>
                  <td>{address.provinceName}</td>
                  <td>{address.districtName}</td>
                  <td>{address.wardName}</td>
                  <td>{address.phoneNumber || 'No phone number available'}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEditAddress(address)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No addresses available.</td>
              </tr>
            )}
          </tbody>
        </Table>
        {/* Edit Address Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAddress && (
              <Form onSubmit={saveAddress}>
                <Form.Group controlId="provinceCode">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    as="select"
                    name="provinceCode"
                    value={selectedAddress.provinceCode}
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
                <Form.Group controlId="districtCode">
                  <Form.Label>District</Form.Label>
                  <Form.Control
                    as="select"
                    name="districtCode"
                    value={selectedAddress.districtCode}
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
                <Form.Group controlId="wardCode">
                  <Form.Label>Ward</Form.Label>
                  <Form.Control
                    as="select"
                    name="wardCode"
                    value={selectedAddress.wardCode}
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
                <Form.Group controlId="addressDetail">
                  <Form.Label>Address Detail</Form.Label>
                  <Form.Control
                    type="text"
                    name="addressDetail"
                    value={selectedAddress.addressDetail}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={selectedAddress.phoneNumber}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '');
                      setSelectedAddress((prev) => ({ ...prev, phoneNumber: numericValue }));
                    }}
                    maxLength={15}
                    inputMode="numeric"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Save Address
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default AddressEdit;
