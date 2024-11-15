import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';

const AddBook = () => {
  const [book, setBook] = useState({
    createById: '',
    categoryId: '',
    senderAddressId: '',
    bookName: '',
    author: '',
    description: '',
    price: '', // Converted to integer
    unitInStock: 0, // Converted to integer
    createDate: '',
    isbn: '',
    weight: 0, // Converted to integer
    length: 0, // Converted to integer
    width: 0, // Converted to integer
    height: 0, // Converted to integer
    requiredNote: '',
    image: null 
  });
  

  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [createdBookId, setCreatedBookId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const userId = Cookies.get('UserId');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/BookCategory', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
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
        const filteredAddresses = response.data.filter(address => address.accountId === parseInt(userId));
        setAddresses(filteredAddresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses.');
      }
    };

    fetchCategories();
    fetchAddresses();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'price') {
      const rawValue = value.replace(/[^0-9.]/g, '');
      const formattedValue = rawValue ? new Intl.NumberFormat().format(rawValue) : '';
  
      setBook((prev) => ({
        ...prev,
        price: formattedValue,
      }));
    } else {
      setBook((prev) => ({
        ...prev,
        [name]: name === 'unitInStock' || name === 'weight' || name === 'length' || 
                name === 'width' || name === 'height' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files); // Convert FileList to array
    setBook((prev) => ({
      ...prev,
      image: fileArray, // Store the array of image
    }));
  };

  const saveBook = async (e) => {
  e.preventDefault();

  // Remove commas from the price and parse it as an integer
  const rawPrice = parseInt(book.price.replace(/[^0-9]/g, ''));

  // Check if the price is zero, and if so, set it to 'Free'
  if (rawPrice === 0) {
    setBook((prev) => ({
      ...prev,
      price: 'Free',
    }));
  }

  // Check if the price is less than 1000 but not 'Free'
  if (rawPrice < 1000 && rawPrice !== 0) {
    toast.error('Price must be at least 1000 dong!');
    return; // Prevent form submission
  }

  const bookData = {
    ...book,
    createById: Cookies.get('UserId') || '',
    status: "-1",
    createDate: new Date().toISOString(),
    bookOrders: [],
    bookRates: [],
    comments: [],
    createBy: null,
  };

  try {
    const response = await axios.post('https://rmrbdapi.somee.com/odata/book', bookData, {
      headers: {
        'Content-Type': 'application/json',
        'Token': '123-abc',
      },
    });

    if (response.status === 200 || response.status === 201) {
      toast.success('Book added successfully!');
      setCreatedBookId(response.data.bookId); // Save the newly created book ID
      setShowImageUploadModal(true); // Open the image upload modal
      resetForm();
    } else {
      toast.error('Error adding book. Please try again.');
    }
  } catch (error) {
    console.error('Error saving book:', error.response ? error.response.data : error.message);
    toast.error('Error saving book. Please try again.');
  }
};

  const resetForm = () => {
    setBook({
      createById: '',
      categoryId: '',
      senderAddressId: '',
      bookName: '',
      description: '',
      price: '',
      unitInStock: 0,
      createDate: '',
      isbn: '',
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      requiredNote: '',
      image: null,
    });
    setSelectedAddress(null);
  };

  const handleAddressSelect = (address) => {
    setBook((prev) => ({
      ...prev,
      senderAddressId: address.addressId,
    }));
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Container className="my-5">
        <h2 className="text-center mb-4">Add New Book</h2>

        <Form onSubmit={saveBook}>
          {/* Book Name Section */}
          <Row className="mb-3">
          <Col>
            <Form.Group controlId="bookName">
              <Form.Label>Book Name</Form.Label>
              <Form.Control
                type="text"
                id="bookName"
                name="bookName"
                value={book.bookName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="author">
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                id="author"
                name="author"
                value={book.author}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          </Row>

          {/* Category Section */}
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="categoryId">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  id="categoryId"
                  name="categoryId"
                  value={book.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option>No categories available</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Description Section */}
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  id="description"
                  name="description"
                  rows={3}
                  value={book.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Price & Units in Stock Section */}
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  id="price"
                  name="price"
                  value={book.price}
                  onChange={handleInputChange}
                  step="any"  
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="unitInStock">
                <Form.Label>Units In Stock</Form.Label>
                <Form.Control
                  type="number"
                  id="unitInStock"
                  name="unitInStock"
                  value={book.unitInStock}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ISBN, Weight, Length, Width, Height Section */}
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="isbn">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={book.isbn}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="weight">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  id="weight"
                  name="weight"
                  value={book.weight}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="length">
                <Form.Label>Length</Form.Label>
                <Form.Control
                  type="number"
                  id="length"
                  name="length"
                  value={book.length}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="width">
                <Form.Label>Width</Form.Label>
                <Form.Control
                  type="number"
                  id="width"
                  name="width"
                  value={book.width}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="height">
                <Form.Label>Height</Form.Label>
                <Form.Control
                  type="number"
                  id="height"
                  name="height"
                  value={book.height}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Required Note Section */}
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="requiredNote">
                <Form.Label>Required Note</Form.Label>
                <Form.Control
                  as="select"
                  id="requiredNote"
                  name="requiredNote"
                  value={book.requiredNote}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Required Note</option>
                  <option value="CHOTHUHANG">CHOTHUHANG</option>
                  <option value="CHOXEMHANGKHONGTHU">CHOXEMHANGKHONGTHU</option>
                  <option value="KHONGCHOXEMHANG">KHONGCHOXEMHANG</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Select Address Button */}
          <Row className="mb-3">
            <Col>
              <Button variant="primary" onClick={() => setShowAddressModal(true)} className="w-100">
                {selectedAddress ? `${selectedAddress.addressDetail} - ${selectedAddress.phoneNumber}` : 'Select Address'}
              </Button>
            </Col>
          </Row>

          {/* Submit Button */}
          <Button type="submit" className="w-100">Save Book</Button>
        </Form>
      </Container>

      {/* Address Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-unstyled">
            {addresses.map(address => (
              <li
                key={address.addressId}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd',
                  padding: '8px 0',
                }}
                onClick={() => handleAddressSelect(address)}
              >
                <div>{address.addressDetail}</div>
                <div>{address.phoneNumber}</div>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
       
       {/* Address Modal */}
       <Modal show={showImageUploadModal} onHide={() => setShowImageUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Book Image(s)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="image">
              <Form.Label>Upload Image(s)</Form.Label>
              <Form.Control
                type="file"
                id="image"
                name="image"
                accept="image/*"
                multiple // Allow multiple file selection
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="mt-3"
              onClick={async () => {
                const formData = new FormData();
                book.image.forEach((image) => formData.append('image', image)); // Append each image

                try {
                  const response = await axios.post(
                    `https://rmrbdapi.somee.com/odata/UploadImage/Book/${createdBookId}`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data', 'Token': '123-abc' } }
                  );
                  if (response.status === 200 || response.status === 201) {
                    toast.success('Image(s) uploaded successfully!');
                    setShowImageUploadModal(false); // Close modal
                  } else {
                    toast.error('Error uploading image(s).');
                  }
                } catch (error) {
                  console.error('Error uploading image:', error);
                  toast.error('Error uploading image(s).');
                }
              }}
            >
              Upload
            </Button>
          </Modal.Body>
        </Modal>
      

      <Footer />
    </>
  );
};

export default AddBook;
