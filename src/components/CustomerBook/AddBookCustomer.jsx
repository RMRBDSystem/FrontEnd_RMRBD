import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const AddBook = () => {
  const [book, setBook] = useState({
    createById: '',
    categoryId: '',
    senderAddressId: '',
    bookName: '',
    author: '',
    description: '',
    price: '',
    unitInStock: '1',
    createDate: '',
    isbn: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    image: null,
    requiredNote: "KHONGCHOXEMHANG"
  });
  
  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const userId = Cookies.get('UserId');
  const [isBookFormVisible, setIsBookFormVisible] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);

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
        console.error('Lỗi khi tải danh mục:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải danh mục.'
        });
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
        console.error('Lỗi khi tải địa chỉ:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải địa chỉ.'
        });
      }
    };

    fetchCategories();
    fetchAddresses();
  }, [userId]);

  const handleImageDrop = useCallback((acceptedFiles) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 10; // Số lượng tệp tối đa cho phép

    // Kiểm tra tổng số tệp (đã có + mới)
    const totalFiles = (book.image?.length || 0) + acceptedFiles.length;
    if (totalFiles > maxFiles) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: `Tối đa ${maxFiles} hình ảnh được phép`
      });
      return;
    }

    const validFiles = acceptedFiles.filter(file => {
      if (!validImageTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Loại tệp không hợp lệ',
          text: `${file.name} không phải là loại hình ảnh hợp lệ (chỉ JPG, PNG hoặc GIF)`
        });
        return false;
      }
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Tệp quá lớn',
          text: `${file.name} quá lớn (tối đa 5MB)`
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      // Cập nhật trạng thái sách với các tệp mới
      setBook(prev => ({
        ...prev,
        image: prev.image ? [...prev.image, ...validFiles] : validFiles
      }));

      // Tạo và lưu trữ URL xem trước cho các hình ảnh mới
      const newPreviews = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);
      
      console.log(`Đã thêm ${validFiles.length} hình ảnh mới. Tổng cộng: ${totalFiles}`);
    }
  }, [book.image]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: true, // Cho phép chọn nhiều tệp
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = useCallback((index) => {
    setBook(prev => {
      const newImages = [...(prev.image || [])];
      newImages.splice(index, 1);
      return {
        ...prev,
        image: newImages
      };
    });

    setPreviewImages(prev => {
      const newPreviews = [...prev];
      if (newPreviews[index]?.url) {
        URL.revokeObjectURL(newPreviews[index].url);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  }, []);

  // Thêm hiệu ứng dọn dẹp
  useEffect(() => {
    return () => {
      // Dọn dẹp URL khi thành phần bị hủy
      previewImages.forEach(image => {
        if (image?.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [previewImages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Xác thực các trường biểu mẫu
    const safeTrim = (value) => value?.trim() || '';
    const safeNumber = (value) => Number(value) || 0;

    const bookData = {
      bookName: safeTrim(book.bookName),
      description: safeTrim(book.description),
      author: safeTrim(book.author),
      price: safeNumber(book.price?.replace(/[,\.]/g, '')),
      unitInStock: safeNumber(book.unitInStock),
      categoryId: safeNumber(book.categoryId),
      isbn: safeTrim(book.isbn),
      weight: safeNumber(book.weight),
      length: safeNumber(book.length),
      width: safeNumber(book.width),
      height: safeNumber(book.height),
      senderAddressId: safeNumber(book.senderAddressId)
    };

    // Xác thực các trường bắt buộc
    const requiredFields = {
      bookName: 'Tên sách',
      author: 'Tên tác giả',
      description: 'Mô tả',
      price: 'Giá',
      categoryId: 'Danh mục',
      senderAddressId: 'Địa chỉ gửi',
      isbn: 'ISBN'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, label]) => !bookData[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      const errorMessage = `Vui lòng điền vào các trường bắt buộc sau: ${missingFields.join(', ')}`;
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage
      });
      return;
    }

    // Thêm xác thực cụ thể cho senderAddressId
    if (!selectedAddress || !book.senderAddressId) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng chọn địa chỉ gửi'
      });
      return;
    }

    // Nếu xác thực thành công, hiển thị phần tải lên hình ảnh
    setIsBookFormVisible(false);
  };

  const resetForm = () => {
    // Xóa URL xem trước
    previewImages.forEach(image => {
      if (image.url) {
        URL.revokeObjectURL(image.url);
      }
    });
    setPreviewImages([]);

    // Đặt lại trạng thái địa chỉ đã chọn
    setSelectedAddress(null);

    // Đặt lại tất cả dữ liệu sách bao gồm hình ảnh
    setBook({
      createById: '',
      categoryId: '',
      senderAddressId: '',
      bookName: '',
      author: '',
      description: '',
      price: '',
      unitInStock: '1',
      createDate: '',
      isbn: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      image: null
    });

    // Hiển thị biểu mẫu sách
    setIsBookFormVisible(true);
  };

  const handleAddressSelect = (address) => {
    setBook((prev) => ({
      ...prev,
      senderAddressId: address.addressId,
    }));
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const numberInputClass = `peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           transition-all duration-200 outline-none
                           placeholder-transparent
                           [appearance:textfield]
                           [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none`;

  // Định nghĩa handleImageUpload trước khi sử dụng trong JSX
  const handleImageUpload = useCallback(async () => {
    if (!book.image || book.image.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Không có hình ảnh',
        text: 'Vui lòng chọn ít nhất một hình ảnh'
      });
      return;
    }

    try {
      // Hiển thị trạng thái tải lên
      Swal.fire({
        title: 'Đang tải lên...',
        text: 'Đang tải lên sách và hình ảnh...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const safeTrim = (value) => value?.trim() || '';
      const safeNumber = (value) => Number(value) || 0;

      // Format book data with proper types and required fields
      const bookData = {
        bookName: book.bookName?.trim(),
        description: book.description?.trim(),
        author: book.author?.trim(),
        price: parseFloat(book.price?.replace(/[,\.]/g, '')),
        unitInStock: parseInt(book.unitInStock, 10),
        status: -1,
        createById: parseInt(userId, 10),
        categoryId: parseInt(book.categoryId, 10),
        isbn: book.isbn?.trim(),
        weight: parseFloat(book.weight) || 0,
        length: parseFloat(book.length) || 0,
        width: parseFloat(book.width) || 0,
        height: parseFloat(book.height) || 0,
        senderAddressId: parseInt(book.senderAddressId, 10),
        createDate: new Date().toISOString(),
        requiredNote: "KHONGCHOXEMHANG" // Add this required field
      };

      // Validate that all required numeric fields are actual numbers
      const numericFields = ['price', 'unitInStock', 'createById', 'categoryId', 'senderAddressId'];
      for (const field of numericFields) {
        if (isNaN(bookData[field])) {
          throw new Error(`${field} must be a valid number`);
        }
      }

      // Chuẩn bị FormData hình ảnh trước để đảm bảo chúng ta có hình ảnh hợp lệ
      const formData = new FormData();
      book.image.forEach((image) => formData.append('image', image));

      // Đầu tiên, thử tải lên hình ảnh đến một vị trí tạm thời hoặc xác thực chúng
      // Đây là một chỗ giữ chỗ - bạn có thể cần điều chỉnh dựa trên khả năng API của bạn
      try {
        // Xác thực hình ảnh (kích thước, định dạng, v.v.)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const invalidImages = book.image.filter(img => !validImageTypes.includes(img.type));
        
        if (invalidImages.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Loại tệp không hợp lệ',
            text: 'Vui lòng chỉ tải lên hình ảnh JPG, PNG hoặc GIF'
          });
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        const oversizedImages = book.image.filter(img => img.size > maxSize);
        
        if (oversizedImages.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Tệp quá lớn',
            text: 'Một số hình ảnh quá lớn. Kích thước tối đa là 5MB mỗi hình ảnh'
          });
          return;
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Lỗi xác thực hình ảnh'
        });
        return;
      }

      // Bây giờ tiến hành tạo sách và tải lên hình ảnh
      try {
        // Tải lên dữ liệu sách
        const bookResponse = await axios.post(
          'https://rmrbdapi.somee.com/odata/Book',
          bookData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': '123-abc'
            }
          }
        );

        if (bookResponse?.status === 201 || bookResponse?.status === 200) {
          const newBookId = bookResponse.data.bookId;
          const totalImages = book.image.length;
          let successfulUploads = 0;

          // Tải lên hình ảnh từng cái một
          try {
            // Hiển thị thông báo tải lên
            const loadingToast = Swal.fire({
              title: 'Đang tải lên...',
              text: `Đang tải lên hình ảnh (0/${totalImages})...`,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });

            // Tải lên từng hình ảnh tuần tự
            for (let i = 0; i < book.image.length; i++) {
              const formData = new FormData();
              formData.append('image', book.image[i]);

              console.log(`Đang tải lên hình ảnh ${i + 1}/${totalImages}: ${book.image[i].name}`);

              const imageResponse = await axios.post(
                `https://rmrbdapi.somee.com/odata/UploadImage/Book/${newBookId}`,
                formData,
                { 
                  headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Token': '123-abc'
                  }
                }
              );

              if (imageResponse?.status === 200 || imageResponse?.status === 201) {
                successfulUploads++;
                // Cập nhật thông báo tải lên
                Swal.update(loadingToast, {
                  title: `Đang tải lên hình ảnh (${successfulUploads}/${totalImages})...`
                });
              } else {
                console.error(`Không thể tải lên hình ảnh ${i + 1}`);
              }
            }

            // Đóng thông báo tải lên
            Swal.close(loadingToast);

            if (successfulUploads === totalImages) {
              Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: `Đã tải lên thành công sách với ${successfulUploads} hình ảnh!`
              });
              resetForm();
              setIsBookFormVisible(true);
            } else if (successfulUploads > 0) {
              Swal.fire({
                icon: 'warning',
                title: 'Thành công một phần',
                text: `Đã tải lên ${successfulUploads} trong số ${totalImages} hình ảnh`
              });
              resetForm();
              setIsBookFormVisible(true);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Tải lên thất bại',
                text: 'Không thể tải lên bất kỳ hình ảnh nào'
              });
              // Tùy chọn xử lý trường hợp không có hình ảnh nào được tải lên
            }

          } catch (uploadError) {
            console.error('Lỗi tải lên hình ảnh:', uploadError);
            console.error('Phản hồi lỗi:', uploadError.response?.data);
            
            if (successfulUploads > 0) {
              Swal.fire({
                icon: 'warning',
                title: 'Thành công một phần',
                text: `Thành công một phần: đã tải lên ${successfulUploads} trong số ${totalImages} hình ảnh`
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Tải lên thất bại',
                text: 'Không thể tải lên hình ảnh. Sách đã được tạo nhưng hình ảnh không thể tải lên.'
              });
            }
            
            // Đặt lại biểu mẫu và quay lại biểu mẫu sách
            resetForm();
            setIsBookFormVisible(true);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tạo sách. Vui lòng thử lại.'
          });
        }
      } catch (error) {
        console.error('Error details:', error.response?.data);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.response?.data?.message || 'Lỗi tải lên sách và hình ảnh.'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Lỗi tải lên sách và hình ảnh.'
      });
    }
  }, [book, userId]);

  // Cập nhật trình xử lý nút Quay lại
  const handleBack = () => {
    // Xóa hình ảnh xem trước và thu hồi URL đối tượng
    previewImages.forEach(image => {
      if (image.url) {
        URL.revokeObjectURL(image.url);
      }
    });
    setPreviewImages([]);
    
    // Đặt lại trạng thái hình ảnh
    setBook(prev => ({
      ...prev,
      image: null
    }));
    
    // Hiển thị biểu mẫu sách
    setIsBookFormVisible(true);
  };

  return (
    <div 
    >
      <Container className="my-8 px-4 max-w-4xl mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isBookFormVisible ? (
            <motion.div
              key="bookForm"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Thêm Sách Mới
              </h2>

              <Form onSubmit={handleSubmit} className="space-y-4">
                {/* Phần Tên Sách & Tác Giả */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Form.Control
                      type="text"
                      id="bookName"
                      name="bookName"
                      value={book.bookName || ''}
                      onChange={(e) => setBook(prev => ({
                        ...prev,
                        bookName: e.target.value
                      }))}
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                transition-all duration-200 outline-none
                                placeholder-transparent"
                      placeholder="Tên Sách"
                    />
                    <Form.Label
                      htmlFor="bookName"
                      className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                                transition-all duration-200 
                                peer-placeholder-shown:text-base 
                                peer-placeholder-shown:text-gray-400
                                peer-placeholder-shown:top-3.5
                                peer-focus:-top-2.5 
                                peer-focus:text-sm
                                peer-focus:text-gray-600
                                bg-white px-2
                                pointer-events-none"
                    >
                      Tên Sách
                    </Form.Label>
                  </div>

                  <div className="relative">
                    <Form.Control
                      type="text"
                      id="author"
                      name="author"
                      value={book.author || ''}
                      onChange={(e) => setBook(prev => ({
                        ...prev,
                        author: e.target.value
                      }))}
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                transition-all duration-200 outline-none
                                placeholder-transparent"
                      placeholder="Tên Tác Giả"
                    />
                    <Form.Label
                      htmlFor="author"
                      className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                                transition-all duration-200 
                                peer-placeholder-shown:text-base 
                                peer-placeholder-shown:text-gray-400
                                peer-placeholder-shown:top-3.5
                                peer-focus:-top-2.5 
                                peer-focus:text-sm
                                peer-focus:text-gray-600
                                bg-white px-2
                                pointer-events-none"
                    >
                      Tên Tác Giả
                    </Form.Label>
                  </div>
                </div>

                {/* Lựa Chọn Danh Mục */}
                <div className="relative">
                  <Form.Select
                    id="categoryId"
                    name="categoryId"
                    value={book.categoryId || ''}
                    onChange={(e) => setBook(prev => ({
                      ...prev,
                      categoryId: e.target.value
                    }))}
                    required
                    className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                              transition-all duration-200 outline-none
                              appearance-none"
                  >
                    <option value="">Chọn Danh Mục</option>
                    {categories.map((category) => (
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

                {/* Mô Tả */}
                <div className="relative">
                  <Form.Control
                    as="textarea"
                    id="description"
                    name="description"
                    value={book.description || ''}
                    onChange={(e) => setBook(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    required
                    className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                              transition-all duration-200 outline-none
                              placeholder-transparent"
                    placeholder="Mô Tả"
                  />
                  <Form.Label
                    htmlFor="description"
                    className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                              transition-all duration-200 
                              peer-placeholder-shown:text-base 
                              peer-placeholder-shown:text-gray-400
                              peer-placeholder-shown:top-3.5
                              peer-focus:-top-2.5 
                              peer-focus:text-sm
                              peer-focus:text-gray-600
                              bg-white px-2
                              pointer-events-none"
                  >
                    Mô Tả
                  </Form.Label>
                </div>

                {/* Phần Giá & Kho */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Form.Control
                      type="text"
                      id="price"
                      name="price"
                      value={book.price || ''}
                      onChange={(e) => setBook(prev => ({
                        ...prev,
                        price: e.target.value
                      }))}
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                transition-all duration-200 outline-none
                                placeholder-transparent"
                      placeholder="Giá"
                    />
                    <Form.Label
                      htmlFor="price"
                      className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                                transition-all duration-200 
                                peer-placeholder-shown:text-base 
                                peer-placeholder-shown:text-gray-400
                                peer-placeholder-shown:top-3.5
                                peer-focus:-top-2.5 
                                peer-focus:text-sm
                                peer-focus:text-gray-600
                                bg-white px-2
                                pointer-events-none"
                    >
                      Giá (VND)
                    </Form.Label>
                  </div>

                  <div className="relative">
                    <Form.Control
                      type="number"
                      id="unitInStock"
                      name="unitInStock"
                      value={book.unitInStock || '1'}
                      onChange={(e) => setBook(prev => ({
                        ...prev,
                        unitInStock: e.target.value
                      }))}
                      required
                      min="1"
                      className={`${numberInputClass} peer`}
                      placeholder="Số Lượng Trong Kho"
                    />
                    <Form.Label
                      htmlFor="unitInStock"
                      className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                                transition-all duration-200 
                                peer-placeholder-shown:text-base 
                                peer-placeholder-shown:text-gray-400
                                peer-placeholder-shown:top-3.5
                                peer-focus:-top-2.5 
                                peer-focus:text-sm
                                peer-focus:text-gray-600
                                bg-white px-2
                                pointer-events-none"
                    >
                      Số Lượng Trong Kho
                    </Form.Label>
                  </div>
                </div>

                {/* Phần Kích Thước */}
                <div className="grid md:grid-cols-4 gap-4">
                  {['weight', 'length', 'width', 'height'].map((dimension) => (
                    <div key={dimension} className="relative">
                      <Form.Control
                        type="number"
                        id={dimension}
                        name={dimension}
                        value={book[dimension] || ''}
                        onChange={(e) => setBook(prev => ({
                          ...prev,
                          [dimension]: e.target.value
                        }))}
                        required
                        className={`${numberInputClass} peer`}
                        placeholder={dimension}
                      />
                      <Form.Label
                        htmlFor={dimension}
                        className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                                  transition-all duration-200 
                                  peer-placeholder-shown:text-base 
                                  peer-placeholder-shown:text-gray-400
                                  peer-placeholder-shown:top-3.5
                                  peer-focus:-top-2.5 
                                  peer-focus:text-sm
                                  peer-focus:text-gray-600
                                  bg-white px-2
                                  pointer-events-none"
                      >
                        {dimension.charAt(0).toUpperCase() + dimension.slice(1)} (cm)
                      </Form.Label>
                    </div>
                  ))}
                </div>

                {/* Trường ISBN */}
                <div className="relative">
                  <Form.Control
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={book.isbn || ''}
                    onChange={(e) => setBook(prev => ({
                      ...prev,
                      isbn: e.target.value
                    }))}
                    required
                    className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                              transition-all duration-200 outline-none
                              placeholder-transparent"
                    placeholder="ISBN"
                  />
                  <Form.Label
                    htmlFor="isbn"
                    className="absolute left-3 -top-2.5 text-gray-600 text-sm 
                              transition-all duration-200 
                              peer-placeholder-shown:text-base 
                              peer-placeholder-shown:text-gray-400
                              peer-placeholder-shown:top-3.5
                              peer-focus:-top-2.5 
                              peer-focus:text-sm
                              peer-focus:text-gray-600
                              bg-white px-2
                              pointer-events-none"
                  >
                    ISBN
                  </Form.Label>
                </div>

                {/* Lựa Chọn Địa Chỉ - cập nhật kiểu dáng */}
                <Button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium 
                            px-6 py-2 rounded-lg transition-all duration-200 
                            border-2 border-gray-200 hover:border-gray-300
                            shadow-sm hover:shadow
                            transform hover:-translate-y-0.5"
                >
                  {selectedAddress 
                    ? `${selectedAddress.addressDetail} - ${selectedAddress.phoneNumber}`
                    : 'Chọn Địa Chỉ'}
                </Button>

                {/* Nút Gửi */}
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold 
                              px-6 py-2 rounded-lg transition-all duration-200 
                              transform hover:-translate-y-0.5"
                  >
                    Lưu Sách
                  </Button>
                </div>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="imageUpload"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Tải Lên Hình Ảnh Sách
              </h2>
              
              <div className="space-y-6">
                <div className="w-full p-12 border-2 border-dashed border-gray-300 rounded-lg 
                              hover:border-blue-500 transition-colors duration-200
                              min-h-[300px] flex items-center justify-center">
                  <div {...getRootProps()} className="text-center w-full">
                    <input {...getInputProps()} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-center">
                        <svg 
                          className="w-16 h-16 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-lg">
                        Kéo và thả hình ảnh vào đây
                      </p>
                      <p className="text-gray-400">
                        hoặc nhấp để chọn tệp
                      </p>
                    </motion.div>
                  </div>
                </div>

                {previewImages.length > 0 && (
                  <motion.div 
                    className="grid grid-cols-3 gap-4 mt-6"
                    layout
                  >
                    {previewImages.map((image, index) => (
                      <motion.div
                        key={image.url}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative group aspect-square bg-gray-100 rounded-lg"
                      >
                        <img
                          src={image.url}
                          alt={image.name || `Hình ảnh ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-3 -right-3 w-7 h-7 
                                   bg-red-500 hover:bg-red-600
                                   text-white text-lg font-bold
                                   rounded-full flex items-center justify-center
                                   shadow-lg transform hover:scale-110
                                   transition-all duration-200
                                   cursor-pointer
                                   z-50"
                          aria-label={`Xóa ${image.name || `hình ảnh ${index + 1}`}`}
                        >
                          ×
                        </motion.button>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-200 rounded-lg">
                          <div className="absolute bottom-2 left-2 right-2 text-white text-sm truncate px-2">
                            {image.name || `Hình ảnh ${index + 1}`}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  className="px-6 py-2"
                >
                  Quay Lại
                </Button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImageUpload}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Tải Lên Hình Ảnh
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Modal Địa Chỉ */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Chọn Địa Chỉ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="address-list">
            {addresses.map(address => (
              <li
                key={address.addressId}
                className="address-item"
                onClick={() => handleAddressSelect(address)}
              >
                <div className="address-detail">{address.addressDetail}</div>
                <div className="address-phone">{address.phoneNumber}</div>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddBook;