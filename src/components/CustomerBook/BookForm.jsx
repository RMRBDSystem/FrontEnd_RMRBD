import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const BookForm = ({ show, onHide, book, categories, addresses, onSave }) => {
  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(book?.senderAddressId || null);
  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    description: '',
    price: '',
    categoryId: '',
    isbn: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    senderAddressId: null
  });

  useEffect(() => {
    if (book) {
      setFormData({
        bookName: book.bookName || '',
        author: book.author || '',
        description: book.description || '',
        price: book.price || '',
        categoryId: book.categoryId || '',
        isbn: book.isbn || '',
        weight: book.weight || '',
        length: book.length || '',
        width: book.width || '',
        height: book.height || '',
        senderAddressId: book.senderAddressId || null
      });
    }
  }, [book]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatNumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue)) {
      setFormData(prev => ({
        ...prev,
        price: parseFloat(rawValue)
      }));
    }
  };

  const handleAddressChange = (e) => {
    const addressId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedAddressId(addressId);
    setFormData(prev => ({
      ...prev,
      senderAddressId: addressId
    }));
  };

  const handleAddAddressClick = () => {
    onHide(); // Close the current modal
    navigate('/address'); // Navigate to address page
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="text-3xl font-semibold text-gray-800">
          Chỉnh sửa sách
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <Form.Control
                  type="text"
                  id="bookName"
                  value={formData.bookName}
                  onChange={(e) => handleChange('bookName', e.target.value)}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="Tên sách"
                />
                <Form.Label
                  htmlFor="bookName"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  Tên sách
                </Form.Label>
              </div>

              <div className="relative">
                <Form.Control
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="Tác giả"
                />
                <Form.Label
                  htmlFor="author"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  Tác giả
                </Form.Label>
              </div>
            </div>

            <div className="relative">
              <Form.Control
                as="textarea"
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
                className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                          focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                          transition-all duration-200 outline-none
                          placeholder-transparent"
                placeholder="Mô tả"
                rows={3}
              />
              <Form.Label
                htmlFor="description"
                className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                          bg-white px-2 pointer-events-none"
              >
                Mô tả
              </Form.Label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <Form.Control
                  type="text"
                  id="price"
                  value={formData.price ? formatNumberWithCommas(formData.price.toString()) : ''}
                  onChange={handlePriceChange}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="Giá"
                />
                <Form.Label
                  htmlFor="price"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  Giá
                </Form.Label>
              </div>

              <div className="relative">
                <Form.Select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            appearance-none"
                >
                  <option value="">Chọn Danh Mục</option>
                  {categories?.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2"
                >
                  Danh Mục
                </Form.Label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <Form.Control
                  type="text"
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => handleChange('isbn', e.target.value)}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="ISBN"
                />
                <Form.Label
                  htmlFor="isbn"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  ISBN / Mã Sách
                </Form.Label>
              </div>

              <div className="relative">
                {addresses && addresses.length > 0 ? (
                  <>
                    <Form.Select
                      value={formData.senderAddressId || ''}
                      onChange={handleAddressChange}
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                                transition-all duration-200 outline-none appearance-none"
                    >
                      <option value="">Chọn địa chỉ</option>
                      {addresses.map((address) => (
                        <option 
                          key={address.addressId} 
                          value={address.addressId}
                          className="py-3 px-4 hover:bg-orange-50"
                        >
                          {address.addressDetail || 'Địa chỉ không có tên'}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Label
                      className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                                bg-white px-2"
                    >
                      Địa chỉ gửi hàng
                    </Form.Label>
                    
                    {/* Dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg 
                        className="w-5 h-5 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M19 9l-7 7-7-7" 
                        />
                      </svg>
                    </div>

                    {/* Selected address details */}
                    {selectedAddressId && addresses.find(addr => addr.addressId === selectedAddressId) && (
                      <div className="mt-3 p-4 bg-orange-50 rounded-lg border border-orange-100 
                                    transform transition-all duration-200 ease-in-out">
                        <div className="flex items-start space-x-3">
                          <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-700 font-medium truncate">
                              {addresses.find(addr => addr.addressId === selectedAddressId)?.addressDetail}
                            </p>
                            <div className="mt-1 space-y-1">
                              <p className="flex items-center gap-2 text-sm text-gray-600">
                                <FaPhone className="text-green-500 flex-shrink-0" />
                                <span className="truncate">
                                  {addresses.find(addr => addr.addressId === selectedAddressId)?.phoneNumber}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {addresses.find(addr => addr.addressId === selectedAddressId)?.WardName},{' '}
                                {addresses.find(addr => addr.addressId === selectedAddressId)?.districtName},{' '}
                                {addresses.find(addr => addr.addressId === selectedAddressId)?.provinceName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-3">Bạn chưa có địa chỉ nào</p>
                    <Button
                      onClick={handleAddAddressClick}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold 
                                px-6 py-2 rounded-lg transition-all duration-200 
                                transform hover:-translate-y-0.5 border-0"
                    >
                      <FaMapMarkerAlt className="inline-block mr-2" />
                      Thêm địa chỉ mới
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <Form.Control
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="Cân nặng (g)"
                />
                <Form.Label
                  htmlFor="weight"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  Cân nặng (g)
                </Form.Label>
              </div>

              <div className="relative">
                <Form.Control
                  type="number"
                  id="length"
                  value={formData.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="Chiều dài (cm)"
                />
                <Form.Label
                  htmlFor="length"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  Chiều dài (cm)
                </Form.Label>
              </div>

              <div className="relative">
                <Form.Control
                  type="number"
                  id="width"
                  value={formData.width}
                  onChange={(e) => handleChange('width', e.target.value)}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="Chiều rộng (cm)"
                />
                <Form.Label
                  htmlFor="width"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  Chiều rộng (cm)
                </Form.Label>
              </div>

              <div className="relative">
                <Form.Control
                  type="number"
                  id="height"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                            transition-all duration-200 outline-none
                            placeholder-transparent"
                  placeholder="Chiều cao (cm)"
                />
                <Form.Label
                  htmlFor="height"
                  className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                            bg-white px-2 pointer-events-none"
                >
                  Chiều cao (cm)
                </Form.Label>
              </div>
            </div>
          </Form>
        </motion.div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="secondary"
          onClick={onHide}
          className="px-6 py-2 rounded-lg"
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={() => onSave(formData)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold 
                    px-6 py-2 rounded-lg transition-all duration-200 
                    transform hover:-translate-y-0.5"
        >
          Lưu thay đổi
        </Button>
      </Modal.Footer>

      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Chọn Địa Chỉ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-none p-0 m-0">
            {addresses?.map((address) => (
              <li
                key={address.id}
                className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleAddressSelect(address)}
              >
                <div className="text-base text-gray-800">{address.addressDetail}</div>
                <div className="text-sm text-gray-600 mt-1">{address.phoneNumber}</div>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </Modal>
  );
}; 