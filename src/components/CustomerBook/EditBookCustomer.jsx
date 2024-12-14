import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Spinner, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { BookForm } from './BookForm';
import { getBooks, updateBook } from '../services/BookService';
import axios from 'axios';
import { decryptData } from "../Encrypt/encryptionUtils";
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
  const userId = decryptData(Cookies.get("UserId"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchAddressesWithDetails();
  }, [userId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/BookCategory', {
        headers: { 'Token': '123-abc' },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load categories'
      });
    }
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUserId = parseInt(decryptData(Cookies.get("UserId")));
      const response = await axios.get('https://rmrbdapi.somee.com/odata/book', {
        headers: { 'Token': '123-abc' }
      });

      const booksData = Array.isArray(response.data) ? response.data : response.data.value || [];
      const userBooks = booksData.filter(book => 
        book.createById === currentUserId && book.status !== 1
      );

      setBooks(userBooks);
    } catch (error) {
      console.error('Error in fetchBooks:', error);
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load books'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            WardName: WardName || 'Unknown Ward',
          };
        })
      );

      setAddresses(addressesWithDetails);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load addresses'
      });
    }
  };

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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select an image to upload.'
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Image updated successfully!'
        });
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookId === selectedBook.bookId
              ? { ...book, images: [{ ...book.images[0], imageUrl: response.data.imageUrl }] }
              : book
          )
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error updating image.'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error uploading image.'
      });
    }
  };

  const handleAddressChange = (e) => {
    const selectedAddressId = parseInt(e.target.value);
    setSelectedAddressId(selectedAddressId);
    setSelectedBook((prev) => ({
      ...prev,
      senderAddressId: selectedAddressId,
    }));
  };

  const handleSaveEdit = async (formData) => {
    const updatedBook = {
      ...selectedBook,
      bookName: formData.bookName,
      description: formData.description,
      author: formData.author || null,
      price: typeof formData.price === 'string' ? 
             parseFloat(formData.price.replace(/,/g, '')) : 
             parseFloat(formData.price) || 0,
      unitInStock: selectedBook.unitInStock || 0,
      status: selectedBook.status || 0,
      censorId: selectedBook.censorId,
      createDate: selectedBook.createDate,
      createById: selectedBook.createById,
      categoryId: parseInt(formData.categoryId) || selectedBook.categoryId,
      isbn: formData.isbn,
      weight: parseFloat(formData.weight) || 0,
      length: parseFloat(formData.length) || 0,
      width: parseFloat(formData.width) || 0,
      height: parseFloat(formData.height) || 0,
      requiredNote: selectedBook.requiredNote || "CHOTHUHANG",
      senderAddressId: parseInt(formData.senderAddressId) || selectedBook.senderAddressId,
      censorNote: selectedBook.censorNote || "",
      // Preserve existing relationships
      bookOrders: selectedBook.bookOrders || [],
      bookRates: selectedBook.bookRates || [],
      category: null,
      censor: null,
      comments: selectedBook.comments || [],
      createBy: selectedBook.createBy,
      images: selectedBook.images,
      bookOrderDetails: selectedBook.bookOrderDetails || [],
      senderAddress: null
    };

    try {
      console.log('Sending update with data:', updatedBook);
      await updateBook(selectedBook.bookId, updatedBook);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Book details updated successfully!'
      });
      
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.bookId === selectedBook.bookId ? updatedBook : book
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating book:', error.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating book details: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getAddressDetails = (senderAddressId) => {
    const address = addresses.find(addr => addr.addressId === senderAddressId);
    if (!address) return 'No Address Available';
    
    return `${address.addressDetail} - ${address.phoneNumber}
            ${address.WardName}, ${address.districtName}, ${address.provinceName}`;
  };

  const renderCategorySelect = () => (
    <Form.Group>
      <Form.Label>Category</Form.Label>
      <Form.Select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-5">
        <h2 className="text-center mb-4 fw-bold">Quản lý sách của bạn</h2>
        
        <div className="bg-white rounded shadow-sm">
          <Table hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">Hình ảnh</th>
                <th className="px-4 py-3">Chi tiết sách</th>
                <th className="px-4 py-3">Thông số</th>
                <th className="px-4 py-3">Địa chỉ</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.bookId}>
                    <td className="px-4">
                      <div className="book-image-container">
                        {book.images.length > 0 ? (
                          <img
                            src={book.images[0].imageUrl}
                            alt={book.bookName}
                            className="rounded"
                            style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="no-image-placeholder">Không có ảnh</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4">
                      <h6 className="mb-1">{book.bookName}</h6>
                      <p className="text-muted mb-1 small">{book.description}</p>
                      <p className="text-primary mb-0 fw-bold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                      </p>
                    </td>
                    <td className="px-4">
                      <p className="mb-1 small"><strong>Danh mục:</strong> {getCategoryName(book.categoryId)}</p>
                      <p className="mb-1 small"><strong>ISBN:</strong> {book.isbn}</p>
                      <p className="mb-1 small"><strong>Kích thước:</strong> {book.length}x{book.width}x{book.height}</p>
                    </td>
                    <td className="px-4">
                      <p className="small mb-0">{getAddressDetails(book.senderAddressId)}</p>
                    </td>
                    <td className="px-4">
                      <Button 
                        className="d-flex align-items-center gap-2 bg-orange-500 hover:bg-orange-600 border-0"
                        onClick={() => handleShowEditModal(book)}
                      >
                        <i className="bi bi-pencil"></i>
                        Cập nhật
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Không có sách nào.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <BookForm
          show={showEditModal}
          onHide={handleCloseEditModal}
          book={selectedBook}
          categories={categories}
          addresses={addresses}
          onSave={handleSaveEdit}
        />
      </Container>
    </div>
  );
};

export default BookList;
