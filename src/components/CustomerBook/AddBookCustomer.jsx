import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
const AddBook = () => {
  const [book, setBook] = useState({
    createById: "",
    categoryId: "",
    senderAddressId: "",
    bookName: "",
    author: "",
    description: "",
    price: "", // Converted to integer
    unitInStock: 0, // Converted to integer
    createDate: "",
    isbn: "",
    weight: 0, // Converted to integer
    length: 0, // Converted to integer
    width: 0, // Converted to integer
    height: 0, // Converted to integer
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [createdBookId, setCreatedBookId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const userId = Cookies.get("UserId");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://rmrbdapi.somee.com/odata/BookCategory",
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );
        setCategories(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục", error);
        Swal.fire({
          icon: "error",
          title: "Không thể tải danh mục.",
          text: error.message,
        });
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          "https://rmrbdapi.somee.com/odata/CustomerAddress",
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );
        const filteredAddresses = response.data.filter(
          (address) => address.accountId === parseInt(userId)
        );
        setAddresses(filteredAddresses);
      } catch (error) {
        console.error("Lỗi khi tải địa chỉ:", error);
        Swal.fire({
          icon: "error",
          title: "Không thể tải địa chỉ.",
          text: error.message,
        });
      }
    };

    fetchCategories();
    fetchAddresses();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Define max limits
    const maxValues = {
      weight: 50000,
      length: 200,
      width: 200,
      height: 200,
    };

    if (["weight", "length", "width", "height"].includes(name)) {
      const numericValue = parseInt(value) || 0;
      if (numericValue > maxValues[name]) {
        toast.error(
          `${name.charAt(0).toUpperCase() + name.slice(1)} cannot exceed ${
            maxValues[name]
          }`
        );
        return; // Prevent setting value if it exceeds max
      }
      setBook((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else if (name === "price") {
      const rawValue = value.replace(/[^0-9.]/g, "");
      const formattedValue = rawValue
        ? new Intl.NumberFormat().format(rawValue)
        : "";
      setBook((prev) => ({
        ...prev,
        price: formattedValue,
      }));
    } else {
      setBook((prev) => ({
        ...prev,
        [name]: value,
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

    // Hiển thị hộp thoại xác nhận trước khi lưu sách
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn lưu sách này không?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, lưu sách!",
      cancelButtonText: "Không, hủy bỏ",
    });

    // Nếu người dùng chọn "Có, lưu sách!", tiếp tục lưu sách
    if (result.isConfirmed) {
      // Remove commas from the price before sending it to the backend
      const rawPrice = parseInt(book.price.replace(/[^0-9]/g, "")); // Remove commas

      // Check if the price is zero, and if so, set it to 'Free'
      if (rawPrice === 0) {
        setBook((prev) => ({
          ...prev,
          price: "Free",
        }));
      }

      // Check if the price is less than 1000 but not 'Free'
      if (rawPrice < 1000 && rawPrice !== 0) {
        Swal.fire({
          icon: "error",
          title: "Giá phải ít nhất 1000 đồng!",
        });
        return; // Prevent form submission
      }

      const bookData = {
        ...book,
        price: rawPrice === 0 ? "Free" : rawPrice, // Send price as raw number or 'Free'
        createById: Cookies.get("UserId") || "",
        status: "-1",
        createDate: new Date().toISOString(),
        bookOrders: [],
        bookRates: [],
        comments: [],
        createBy: null,
      };

      try {
        const response = await axios.post(
          "https://rmrbdapi.somee.com/odata/book",
          bookData,
          {
            headers: {
              "Content-Type": "application/json",
              Token: "123-abc",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Thêm sách thành công!",
          });
          setCreatedBookId(response.data.bookId); // Save the newly created book ID
          setShowImageUploadModal(true); // Open the image upload modal
          resetForm();
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi khi thêm sách. Vui lòng thử lại.",
          });
        }
      } catch (error) {
        console.error(
          "Lỗi khi lưu sách:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          icon: "error",
          title: "Lỗi khi lưu sách. Vui lòng thử lại.",
          text: error.message,
        });
      }
    } else {
      // Nếu người dùng chọn "Không, hủy bỏ", không làm gì cả
      console.log("Hành động lưu sách bị hủy bỏ.");
    }
  };

  const resetForm = () => {
    setBook({
      createById: "",
      categoryId: "",
      senderAddressId: "",
      bookName: "",
      description: "",
      price: "",
      unitInStock: 0,
      createDate: "",
      isbn: "",
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
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
      <Container
        className="my-5"
        style={{
          backgroundColor: "#f0f0f0",
          padding: "30px",
          borderRadius: "8px",
        }}
      >
        <Form onSubmit={saveBook}>
          {/* Book Name Section */}
          {/* Submit Button */}
          <Row className="mb-6">
            <Col className="flex justify-end">
              <Button
                type="submit"
                className="py-2 px-8 text-lg w-auto btn-sm bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md shadow-lg hover:from-orange-500 hover:to-orange-700 transition duration-300"
              >
                <span className="mr-2">
                  <i className="fas fa-save"></i>
                </span>
                Save Book
              </Button>
            </Col>
            <h1 className="text-4xl font-bold mb-6 flex items-center">
              <span className="text-orange-500 mr-2 text-5xl">+</span> Thêm sách
            </h1>
            <p className="text-gray-600 mb-8">
              Tải lên sách thật dễ dàng! Thêm mục yêu thích của bạn, chia sẻ với
              bạn bè, gia đình hoặc cộng đồng RMRBD.
            </p>
          </Row>
          <hr className="my-6 border-t-2 border-gray-300" />
          <Row className="mb-6">
            <Col md={6}>
              <Form.Group controlId="bookName">
                <Form.Label className="text-lg font-medium">
                  Tên sách
                </Form.Label>
                <Form.Control
                  type="text"
                  id="bookName"
                  name="bookName"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.bookName}
                  onChange={handleInputChange}
                  required
                  placeholder="Tên sách của bạn là gì"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="author">
                <Form.Label className="text-lg font-medium">
                  Tên tác giả
                </Form.Label>
                <Form.Control
                  type="text"
                  id="author"
                  name="author"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.author}
                  onChange={handleInputChange}
                  required
                  placeholder="Tác giả của cuốn sách là ai"
                />
              </Form.Group>
            </Col>
          </Row>
          <hr className="my-6 border-t-2 border-gray-300" />
          {/* Category Section */}
          <Row className="mb-6">
            <Col md={6}>
              <Form.Group controlId="categoryId">
                <Form.Label className="text-lg font-medium">
                  Thể loại
                </Form.Label>
                <Form.Control
                  as="select"
                  id="categoryId"
                  name="categoryId"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Hãy chọn thể loại cho cuốn sách này</option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option>Hiện tại không có phân loại để chọn</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="isbn">
                <Form.Label className="text-lg font-medium">Mã ISBN</Form.Label>
                <Form.Control
                  type="text"
                  id="isbn"
                  name="isbn"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.isbn}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập mã ISBN"
                />
              </Form.Group>
            </Col>
          </Row>
          <hr className="my-6 border-t-2 border-gray-300" />
          {/* Description Section */}
          <Row className="mb-6">
            <Col md={12}>
              <Form.Group controlId="description">
                <Form.Label className="text-lg font-medium">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  id="description"
                  name="description"
                  rows={3}
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Chia sẻ suy nghĩ của bạn về cuốn sách này, điều gì đã làm cho bạn muốn chia sẻ cuốn sách này đến với mọi người"
                />
              </Form.Group>
            </Col>
          </Row>
          <hr className="my-6 border-t-2 border-gray-300" />
          {/* Price & Units in Stock Section */}
          <Row className="mb-6">
            <Col md={6}>
              <Form.Group controlId="price">
                <Form.Label className="text-lg font-medium">Giá cả</Form.Label>
                <Form.Control
                  type="text"
                  id="price"
                  name="price"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.price}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập giá sách"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="unitInStock">
                <Form.Label className="text-lg font-medium">
                  Số lượng
                </Form.Label>
                <Form.Control
                  type="number"
                  id="unitInStock"
                  name="unitInStock"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.unitInStock}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập số lượng sách"
                />
              </Form.Group>
            </Col>
          </Row>
          <hr className="my-6 border-t-2 border-gray-300" />
          {/* Dimensions Section */}
          <Row className="mb-6">
            <Col md={3}>
              <Form.Group controlId="weight">
                <Form.Label className="text-lg font-medium">
                  Cân Nặng
                </Form.Label>
                <Form.Control
                  type="number"
                  id="weight"
                  name="weight"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.weight}
                  onChange={handleInputChange}
                  max="50000"
                  required
                  placeholder="Nhập cân nặng (g)"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="length">
                <Form.Label className="text-lg font-medium">
                  Chiều dài
                </Form.Label>
                <Form.Control
                  type="number"
                  id="length"
                  name="length"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.length}
                  onChange={handleInputChange}
                  max="200"
                  required
                  placeholder="Nhập chiều dài (cm)"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="width">
                <Form.Label className="text-lg font-medium">Bề Rộng</Form.Label>
                <Form.Control
                  type="number"
                  id="width"
                  name="width"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.width}
                  onChange={handleInputChange}
                  max="200"
                  required
                  placeholder="Nhập bề rộng (cm)"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="height">
                <Form.Label className="text-lg font-medium">Độ cao</Form.Label>
                <Form.Control
                  type="number"
                  id="height"
                  name="height"
                  className="form-control-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-2 rounded-md"
                  value={book.height}
                  onChange={handleInputChange}
                  max="200"
                  required
                  placeholder="Nhập độ cao (cm)"
                />
              </Form.Group>
            </Col>
          </Row>
          <hr className="my-6 border-t-2 border-gray-300" />
          {/* Select Address Button */}
          <Form.Label className="text-lg font-medium">Địa chỉ</Form.Label>
          <Row className="mb-6">
            <Col>
              <Button
                variant="outline"
                onClick={() => setShowAddressModal(true)}
                className="py-2 px-4 text-sm bg-white border border-black text-black hover:bg-gray-100 w-auto"
              >
                {selectedAddress
                  ? `${selectedAddress.addressDetail} - ${selectedAddress.phoneNumber}`
                  : "Chọn địa chỉ"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      {/* Address Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hãy chọn địa chỉ đã có của bạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-unstyled">
            {addresses.map((address) => (
              <li
                key={address.addressId}
                className="cursor-pointer border-b border-gray-300 py-2"
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
      <Modal
        show={showImageUploadModal}
        onHide={() => setShowImageUploadModal(false)}
      >
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
              book.image.forEach((image) => formData.append("image", image));

              try {
                const response = await axios.post(
                  `https://rmrbdapi.somee.com/odata/UploadImage/Book/${createdBookId}`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Token: "123-abc",
                    },
                  }
                );
                if (response.status === 200 || response.status === 201) {
                  toast.success("Image(s) uploaded successfully!");
                  setShowImageUploadModal(false); // Close modal
                } else {
                  toast.error("Error uploading image(s).");
                }
              } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image(s).");
              }
            }}
          >
            Upload
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddBook;
