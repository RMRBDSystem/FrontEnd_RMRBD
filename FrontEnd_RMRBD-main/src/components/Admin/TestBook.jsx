import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [bookName, setBookName] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isbn, setIsbn] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [requiredNote, setRequiredNote] = useState('');
  const [author, setAuthor] = useState('');
  const userId = Cookies.get('UserId');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/book', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        const userBooks = response.data.filter(book => book.createById === parseInt(userId));
        setBooks(userBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load books.');
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
        const userAddresses = response.data.filter(address => address.accountId === parseInt(userId));
        setAddresses(userAddresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/BookCategory', {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      }
    };

    fetchBooks();
    fetchAddresses();
    fetchCategories();
  }, [userId]);

  const handleShowEditModal = (book) => {
    setSelectedBook(book);
    setBookName(book.bookName);
    setBookDescription(book.description);
    setBookPrice(book.price);
    setCategoryId(book.categoryId);
    setIsbn(book.isbn);
    setWeight(book.weight);
    setLength(book.length);
    setWidth(book.width);
    setHeight(book.height);
    setRequiredNote(book.requiredNote);
    setAuthor(book.author);
    setSelectedAddressId(book.senderAddressId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setNewImage(null);
    setSelectedBook(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleImageUpload = async () => {
    if (!newImage) {
      toast.error('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      const response = await axios.post(
        `https://rmrbdapi.somee.com/odata/UploadImage/Book/${selectedBook.bookId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data', 'Token': '123-abc' },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Image updated successfully!');
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookId === selectedBook.bookId
              ? { ...book, images: [{ ...book.images[0], imageUrl: response.data.imageUrl }] }
              : book
          )
        );
      } else {
        toast.error('Error updating image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image.');
    }
  };

  const handleAddressChange = (e) => {
    const selectedAddressId = e.target.value;
    setSelectedAddressId(selectedAddressId);
    setSelectedBook((prev) => ({
      ...prev,
      senderAddressId: selectedAddressId,
    }));
  };

  const handleSaveEdit = async () => {
    const updatedBook = {
      ...selectedBook,
      bookName,
      description: bookDescription,
      price: bookPrice,
      categoryId,
      isbn,
      weight,
      length,
      width,
      height,
      requiredNote,
      author,
      senderAddressId: selectedAddressId,
    };

    try {
      const response = await axios.put(
        `https://rmrbdapi.somee.com/odata/book/${selectedBook.bookId}`,
        updatedBook,
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': '123-abc',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Book details updated successfully!');
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookId === selectedBook.bookId ? updatedBook : book
          )
        );
        handleCloseEditModal();
      } else {
        toast.error('Error updating book details.');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book details.');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getAddressDetails = (senderAddressId) => {
    const address = addresses.find(address => address.addressId === senderAddressId);
    return address ? `${address.addressDetail} - ${address.phoneNumber}` : 'No Address Available';
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Container className="my-5">
        <h2 className="text-center mb-4">Manage Your Books</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Book Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Weight</th>
              <th>Dimensions</th>
              <th>Required Note</th>
              <th>Author</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.bookId}>
                  <td>
                    {book.images.length > 0 ? (
                      <img
                        src={book.images[0].imageUrl}
                        alt={book.bookName}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{book.bookName}</td>
                  <td>{book.description}</td>
                  <td>{book.price}</td>
                  <td>{getCategoryName(book.categoryId)}</td>
                  <td>{book.isbn}</td>
                  <td>{book.weight}</td>
                  <td>{book.length} x {book.width} x {book.height}</td>
                  <td>{book.requiredNote}</td>
                  <td>{book.author}</td>
                  <td>{getAddressDetails(book.senderAddressId)}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleShowEditModal(book)} className="me-2">
                      Edit
                    </Button>
                    {/* You can add more actions here */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">No books available.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Book Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="bookName">
              <Form.Label>Book Name</Form.Label>
              <Form.Control
                type="text"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="bookDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookDescription}
                onChange={(e) => setBookDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="bookPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={bookPrice}
                onChange={(e) => setBookPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="categoryId">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="isbn">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="length">
              <Form.Label>Length</Form.Label>
              <Form.Control
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="width">
              <Form.Label>Width</Form.Label>
              <Form.Control
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="height">
              <Form.Label>Height</Form.Label>
              <Form.Control
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="requiredNote">
              <Form.Label>Required Note</Form.Label>
              <Form.Control
                type="text"
                value={requiredNote}
                onChange={(e) => setRequiredNote(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="author">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control as="select" value={selectedAddressId} onChange={handleAddressChange}>
                <option value="">Select Address</option>
                {addresses.map((address) => (
                  <option key={address.addressId} value={address.addressId}>
                    {address.addressDetail} - {address.phoneNumber}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default BookList;
