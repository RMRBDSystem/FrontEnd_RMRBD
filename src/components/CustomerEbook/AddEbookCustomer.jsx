import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // Import SweetAlert2
import Cookies from "js-cookie";
import { FaCloudUploadAlt } from "react-icons/fa";

const EbookCustomer = () => {
  const [newEbook, setNewEbook] = useState({
    EbookName: "",
    Description: "",
    Price: 0,
    Status: 1,
    Pdf: null,
    image: null,
    CategoryId: "", // New field for category selection
  });

  const [categories, setCategories] = useState([]); // Store categories from API
  const fileInputRef = useRef(null);

  // Fetch categories from the API
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
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  // Retrieve the logged-in user data from cookies
  const userName = Cookies.get("UserName"); // Get userName from cookies
  const UserId = Cookies.get("UserId"); // Get UserId from cookies (after login)

  // Handle image selection
  const handleimageChange = (e) => {
    const file = e.target.files[0]; // Get the first (and only) selected file
    if (file) {
      setNewEbook((prev) => ({
        ...prev,
        image: file, // Set the selected image
      }));
    }
  };

  // Handle PDF file selection
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEbook((prev) => ({
        ...prev,
        Pdf: file, // Set the selected PDF
      }));
    }
  };

  // Handle form submission to add ebook
  const addEbook = async (e) => {
    e.preventDefault();

    // Check for missing fields
    const missingFields = [];

    if (!newEbook.EbookName) missingFields.push("Tên Ebook");
    if (!newEbook.Description) missingFields.push("Mô tả");
    if (newEbook.Price === null || newEbook.Price === undefined)
      missingFields.push("Giá");
    if (!newEbook.image) missingFields.push("Hình ảnh");
    if (!newEbook.Pdf) missingFields.push("Tài liệu PDF");
    if (!newEbook.CategoryId) missingFields.push("Danh mục"); // Check if category is selected

    // Ensure the user is logged in and UserId is available
    if (!userName || !UserId) {
      missingFields.push("Người dùng chưa đăng nhập hoặc thiếu UserId");
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Thiếu trường thông tin",
        text: `Vui lòng điền đầy đủ các trường yêu cầu: ${missingFields.join(
          ", "
        )}`,
      });
      return;
    }

    // Prepare FormData to send the file along with other fields
    const ebookData = new FormData();

    // Append form fields (ensure you're using the exact field names expected by the API)
    ebookData.append("ebookName", newEbook.EbookName);
    ebookData.append("description", newEbook.Description);
    ebookData.append("price", parseInt(newEbook.Price, 10));
    ebookData.append("categoryId", newEbook.CategoryId); // Append the selected category

    // Append UserId as createById
    ebookData.append("createById", UserId); // Use UserId, not userName

    // Append the status, if required
    ebookData.append("status", newEbook.Status || 1);

    // Append image if provided
    if (newEbook.image) {
      ebookData.append("image", newEbook.image);
    }

    // Append PDF file if provided
    if (newEbook.Pdf) {
      ebookData.append("document", newEbook.Pdf);
    }

    // Log the FormData being sent to the server
    console.log("FormData being sent to the API:", ebookData);

    try {
      // Send request to the API
      const response = await axios.post(
        "https://rmrbdapi.somee.com/odata/UploadPDF",
        ebookData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Token: "123-abc",
          },
        }
      );

      // Log the response for successful ebook addition
      console.log("Ebook đã được thêm thành công:", response.data);

      // Show success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Ebook đã được thêm thành công!",
        text: "Ebook của bạn đã được thêm thành công.",
      });
      resetForm();
    } catch (error) {
      console.error(
        "Lỗi khi thêm Ebook:",
        error.response ? error.response.data : error.message
      );

      if (error.response && error.response.data) {
        const errorMessage = error.response.data.errors
          ? Object.values(error.response.data.errors).join(", ")
          : error.response.data.message || "Lỗi không xác định";

        Swal.fire({
          icon: "error",
          title: "Lỗi khi thêm Ebook",
          text: `Lỗi khi thêm Ebook: ${errorMessage}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi thêm Ebook",
          text: `Lỗi khi thêm Ebook: ${error.message}`,
        });
      }
    }
  };

  // Reset form after submission
  const resetForm = () => {
    setNewEbook({
      EbookName: "",
      Description: "",
      Price: 0,
      Status: 1,
      Pdf: null,
      image: null, // Reset image
      CategoryId: "", // Reset category selection
    });
  };

  return (
    <Container
      className="my-5"
      style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "8px",
      }}
    >
      {/* Ebook Form */}
      <Form onSubmit={addEbook} className="space-y-4">
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
              Thêm sách điện tử
            </Button>
          </Col>
          <h1 className="text-4xl font-bold mb-6 flex items-center">
            <span className="text-orange-500 mr-2 text-5xl">+</span> Thêm sách
          </h1>
          <p className="text-gray-600 mb-8">
            Tải lên sách điện tử thật dễ dàng! Thêm mục yêu thích của bạn, chia
            sẻ với bạn bè, gia đình hoặc cộng đồng RMRBD.
          </p>
        </Row>
        <hr className="my-6 border-t-2 border-gray-500" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ebook Name and Price */}
          <div>
            <Form.Group controlId="EbookName" className="mb-4">
              <Form.Label className="block text-lg">
                Tên sách điện tử
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên Ebook"
                value={newEbook.EbookName}
                onChange={(e) =>
                  setNewEbook({ ...newEbook, EbookName: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </Form.Group>
          </div>

          <div>
            <Form.Group controlId="Price" className="mb-4">
              <Form.Label className="block text-lg">Giá</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giá Ebook"
                value={newEbook.Price}
                onChange={(e) =>
                  setNewEbook({ ...newEbook, Price: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </Form.Group>
          </div>
        </div>
        <hr className="my-6 border-t-2 border-gray-500" />

        {/* Description (Full Width) */}
        <div className="mb-4">
          <Form.Group controlId="Description" className="mb-4">
            <Form.Label className="block text-lg">Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Nhập mô tả Ebook"
              value={newEbook.Description}
              onChange={(e) =>
                setNewEbook({ ...newEbook, Description: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </Form.Group>
        </div>
        <hr className="my-6 border-t-2 border-gray-500" />

        {/* Category */}
        <Form.Group controlId="CategoryId" className="mb-4">
          <Form.Label className="block text-lg">Danh mục</Form.Label>
          <Form.Control
            as="select"
            value={newEbook.CategoryId}
            onChange={(e) =>
              setNewEbook({ ...newEbook, CategoryId: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <hr className="my-6 border-t-2 border-gray-500" />

        {/* File Uploads */}
        <div className="mb-4">
          {/* Image Upload Section */}
          <Form.Group controlId="image" className="mb-4">
            <Form.Label className="block text-lg">Ảnh bìa</Form.Label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleimageChange}
              className="hidden"
              required
            />
            {/* Cloud icon trigger with flexbox centering */}
            <div
              onClick={() => document.getElementById("image").click()}
              className="cursor-pointer flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
              <p className="text-gray-600">Chọn ảnh</p>
            </div>
          </Form.Group>
        </div>

        <hr className="my-6 border-t-2 border-gray-500" />

        <div className="mb-4">
          {/* PDF Upload Section */}
          <Form.Group controlId="Pdf" className="mb-4">
            <Form.Label className="block text-lg">
              Sách điện tử (PDF)
            </Form.Label>
            <input
              type="file"
              name="Pdf"
              id="Pdf"
              accept=".pdf"
              onChange={handlePdfChange}
              className="hidden"
              required
            />
            {/* Cloud icon trigger with flexbox centering */}
            <div
              onClick={() => document.getElementById("Pdf").click()}
              className="cursor-pointer flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
              <p className="text-gray-600">Chọn sách</p>
            </div>
          </Form.Group>
        </div>
      </Form>
    </Container>
  );
};

export default EbookCustomer;
