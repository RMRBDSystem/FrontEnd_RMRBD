import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";  
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie'; 

const EbookCustomer = () => {
  const [newEbook, setNewEbook] = useState({
    EbookName: '',
    Description: '',
    Price: 0,
    Status: 1,
    Pdf: null, 
    image: null,
    CategoryId: '', // New field for category selection
  });

  const [categories, setCategories] = useState([]);  // Store categories from API
  const fileInputRef = useRef(null);

  // Fetch categories from the API
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
      }
    };

    fetchCategories();
  }, []);

  // Retrieve the logged-in user data from cookies
  const userName = Cookies.get('UserName');  // Get userName from cookies
  const UserId = Cookies.get('UserId');  // Get UserId from cookies (after login)

  // Handle image selection
  const handleimageChange = (e) => {
    const file = e.target.files[0];  // Get the first (and only) selected file
    if (file) {
      setNewEbook((prev) => ({
        ...prev,
        image: file,  // Set the selected image
      }));
    }
  };

  // Handle PDF file selection
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEbook((prev) => ({
        ...prev,
        Pdf: file,  // Set the selected PDF
      }));
    }
  };

  // Handle form submission to add ebook
  const addEbook = async (e) => {
    e.preventDefault();

    // Check for missing fields
    const missingFields = [];

    if (!newEbook.EbookName) missingFields.push('Ebook Name');
    if (!newEbook.Description) missingFields.push('Description');
    if (newEbook.Price === null || newEbook.Price === undefined) missingFields.push('Price');
    if (!newEbook.image) missingFields.push('Image');
    if (!newEbook.Pdf) missingFields.push('PDF Document');
    if (!newEbook.CategoryId) missingFields.push('Category');  // Check if category is selected
    
    // Ensure the user is logged in and UserId is available
    if (!userName || !UserId) {
      missingFields.push("User not logged in or missing UserId");
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Prepare FormData to send the file along with other fields
    const ebookData = new FormData();
    
    // Append form fields (ensure you're using the exact field names expected by the API)
    ebookData.append('ebookName', newEbook.EbookName); 
    ebookData.append('description', newEbook.Description); 
    ebookData.append('price', parseInt(newEbook.Price, 10));
    ebookData.append('categoryId', newEbook.CategoryId);  // Append the selected category
    
    // Append UserId as createById
    ebookData.append('createById', UserId);  // Use UserId, not userName
    
    // Append the status, if required
    ebookData.append('status', newEbook.Status || 1);

    // Append image if provided
    if (newEbook.image) {
      ebookData.append('image', newEbook.image); 
    }

    // Append PDF file if provided
    if (newEbook.Pdf) {
      ebookData.append('document', newEbook.Pdf); 
    }

    // Log the FormData being sent to the server
    console.log('FormData being sent to the API:', ebookData);
    
    try {
      // Send request to the API
      const response = await axios.post('https://rmrbdapi.somee.com/odata/UploadPDF', ebookData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Token': '123-abc', 
        },
      });

      toast.success("Ebook added successfully!");
      resetForm();
    } catch (error) {
      console.error('Error adding ebook:', error.response ? error.response.data : error.message);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data.errors
          ? Object.values(error.response.data.errors).join(", ")
          : error.response.data.message || "Unknown error";
        
        toast.error(`Error adding ebook: ${errorMessage}`);
      } else {
        toast.error(`Error adding ebook: ${error.message}`);
      }
    }
  };

  // Reset form after submission
  const resetForm = () => {
    setNewEbook({
      EbookName: '',
      Description: '',
      Price: 0,
      Status: 1,
      Pdf: null,
      image: null, // Reset image
      CategoryId: '',  // Reset category selection
    });
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Container className="my-5">
        <h2 className="text-center mb-4">Add a New Ebook</h2>
        
        {/* Ebook Form */}
        <Form onSubmit={addEbook}>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="EbookName">
                <Form.Label>Ebook Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Ebook Name"
                  value={newEbook.EbookName}
                  onChange={(e) => setNewEbook({ ...newEbook, EbookName: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="Description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Ebook Description"
                  value={newEbook.Description}
                  onChange={(e) => setNewEbook({ ...newEbook, Description: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="Price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Ebook Price"
                  value={newEbook.Price}
                  onChange={(e) => setNewEbook({ ...newEbook, Price: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Category Selection */}
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="CategoryId">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={newEbook.CategoryId}
                  onChange={(e) => setNewEbook({ ...newEbook, CategoryId: e.target.value })}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* File Uploads */}
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="pdfFile">
                <Form.Label>Upload PDF</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  required
                />
                {newEbook.Pdf && <p>{newEbook.Pdf.name}</p>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="imageFile">
                <Form.Label>Upload Ebook Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleimageChange}
                  required
                />
                {newEbook.image && <p>{newEbook.image.name}</p>}
              </Form.Group>
            </Col>
          </Row>

          {/* Submit Button */}
          <Button variant="primary" type="submit">
            Add Ebook
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default EbookCustomer;
