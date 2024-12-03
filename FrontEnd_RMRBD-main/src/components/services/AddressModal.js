import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getProvinceName, fetchDistrictName, fetchWardName } from '../services/AddressService';

const AddressModal = ({ show, onClose, onSelect, addresses }) => {
  const [addressDetails, setAddressDetails] = useState({});

  useEffect(() => {
    const fetchAddressNames = async () => {
      const updatedDetails = {};
      for (const address of addresses) {
        if (!address.provinceCode || !address.districtCode || !address.wardCode) {
          updatedDetails[address.addressId] = {
            provinceName: 'N/A',
            districtName: 'N/A',
            wardName: 'N/A',
          };
          continue;
        }

        try {
          const [provinceName, districtName, wardName] = await Promise.all([
            getProvinceName(address.provinceCode),
            fetchDistrictName(address.provinceCode, address.districtCode),
            fetchWardName(address.districtCode, address.wardCode),
          ]);

          updatedDetails[address.addressId] = {
            provinceName: provinceName || 'N/A',
            districtName: districtName || 'N/A',
            wardName: wardName || 'N/A',
          };
        } catch (error) {
          console.error('Error fetching address names:', error);
        }
      }
      setAddressDetails(updatedDetails);
    };

    if (show) {
      fetchAddressNames();
    }
  }, [show, addresses]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addresses.length === 0 ? (
          <p>No available addresses. Please add one.</p>
        ) : (
          <ul className="list-group">
            {addresses.map(address => {
              const details = addressDetails[address.addressId] || {};
              return (
                <li
                  key={address.addressId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <p className="mb-1">{address.addressDetail}</p>
                    <p className="text-muted">
                      {details.provinceName}, {details.districtName}, {details.wardName}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => onSelect(address.addressId)}
                  >
                    Select
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddressModal;
