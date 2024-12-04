import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClockIcon from "/images/icon/iconclock.png";
import SpoonIcon from "/images/icon/iconsspoon.png";
import {  FaArrowLeft } from "react-icons/fa";
const BookDetail = () => {
  const { bookId } = useParams(); // Lấy ID từ URL
  const [book, setBook] = useState(null);
  const [accountID, setAccountID] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Hàm lấy chi tiết công thức
  const fetchBookDetail = async (id) => {
    const response = await axios.get(
      `https://rmrbdapi.somee.com/odata/Book/${id}`,
      {
        headers: { "Content-Type": "application/json", Token: "123-abc" },
      }
    );
    const bookData = response.data;
    console.log("Book Data",bookData);
    setBook(bookData);
    setMainImage(bookData.images[0]?.imageUrl);
    return bookData;
  };

  // Hàm lấy thông tin tài khoản
  const fetchAccount = async (createById) => {
    const response = await axios.get(
      `https://rmrbdapi.somee.com/odata/Account/${createById}`,
      {
        headers: { "Content-Type": "application/json", Token: "123-abc" },
      }
    );
    setAccountID(response.data);
    console.log("account data",response.data);

  };

  // Hàm gọi tất cả các API
  const fetchData = async () => {
    try {
      const BookData = await fetchBookDetail(bookId);
      if (BookData.createById) {
        await fetchAccount(BookData.createById);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 
  useEffect(() => {
    fetchData();
  }, [bookId]);

  if (!book || !accountID || !book.images?.length === 0) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {book?.bookName || "N/A"}
        </h1>

        <div className="space-y-4">
          <p className="text-lg">{book?.description || "N/A"}</p>
          <p className="text-lg">
            <strong>Tạo bởi:</strong> {accountID?.userName || "N/A"}
          </p>
          <div className="flex flex-col md:flex-row items-start space-x-4">
            {/* Book Image Section */}
            <div className="md:w-2/3 relative">
              <img
                src={mainImage}
                alt="Main Book"
                className="w-full object-cover rounded-lg shadow-md"
              />
              {/* Thumbnail Images */}
              <div className="flex space-x-4 overflow-x-auto mt-4">
                {book.images?.length > 0 ? (
                  book.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image.imageUrl || ""}
                      alt={`Book image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-75"
                      onClick={() => setMainImage(image.imageUrl)} // Set main image on click
                    />
                  ))
                ) : (
                  <p className="text-lg">N/A</p>
                )}
              </div>
            </div>

            {/* Book Details Section */}
            <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg shadow-md relative">
              {/* Clock Icon */}
              {/* <ClockIcon className="w-6 h-6 text-gray-600 absolute top-2 right-2" /> */}
              <img
                src={ClockIcon}
                alt=""
                className="w-6 h-6 text-gray-600 absolute top-2 right-2"
              />

              {/* Book Details */}
              <p className="text-lg">
                <strong className="text-gray-800">Giá:</strong>{" "}
                {book?.price || "N/A"}đ
              </p>
              <p className="text-lg mb-2">
                <strong className="text-gray-800">Ngày tạo:</strong>{" "}
                {book?.createDate
                  ? new Date(book.createDate).toLocaleDateString("vi-VN") // Định dạng ngày theo chuẩn Việt Nam
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="relative flex items-center mb-8">
            <hr className="flex-grow border-t border-black-300" />
            <img src={SpoonIcon} alt="Icon" className="mx-2 w-6 h-6" />
          </div>

          <div className="flex space-x-4">
            <button
              className="flex items-center justify-center space-x-2 px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition transform duration-300 hover:scale-105"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="text-lg" />
              <span className="text-lg">Quay lại</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetail;
