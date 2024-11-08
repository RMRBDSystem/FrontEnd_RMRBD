import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById, getFirstImageByBookId } from '../../services/BookService';
import { FaShippingFast, FaRedo, FaUsers, FaShoppingCart, FaCreditCard, FaTag, FaCheckCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { Button } from '@material-tailwind/react';
import { Tooltip } from '@mui/material';
import { BsFillPatchCheckFill } from 'react-icons/bs';

const BookDetail = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const maxStars = 5;

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const data = await getBookById(bookId);
                const imageData = await getFirstImageByBookId(bookId);
                setBook(data);
                setImageUrl(imageData);
            } catch (err) {
                setError('Có lỗi xảy ra khi tải dữ liệu sách');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;
    if (!book) return <p>Không tìm thấy thông tin sách.</p>;

    const filledStars = Math.round(book.bookRate || 0);
    const isLongDescription = book.description.length > 300;
    const displayDescription = showFullDescription ? book.description : book.description.slice(0, 300) + '...';

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg grid grid-cols-2 gap-8">
            {/* Phần bên trái với lớp nền */}
            <div className="relative">
                {/* Lớp nền */}
                <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-inner p-6 -z-10"></div>

                {/* Phần hình ảnh */}
                <div className="mb-4 z-10">
                    <img src={imageUrl || 'https://via.placeholder.com/150'} alt={book.bookName} className="w-full rounded-lg shadow-lg" />
                </div>

                {/* Các nút */}
                <div className="flex gap-4 mb-4 z-10">
                    <Button className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg w-1/2">
                        <FaShoppingCart className="mr-2" /> Thêm vào giỏ hàng
                    </Button>
                    <Button className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg w-1/2">
                        <FaCreditCard className="mr-2" /> Mua ngay
                    </Button>
                </div>

                {/* Các chính sách */}
                <div className="space-y-2 z-10">
                    <Tooltip title="Thời gian giao hàng">
                        <p className="text-gray-700 font-semibold flex items-center">
                            <FaShippingFast className="text-blue-500 mr-2" />Thời gian giao hàng: <span className="text-gray-500">Giao nhanh và uy tín</span>
                        </p>
                    </Tooltip>
                    <Tooltip title="Chính sách đổi trả">
                        <p className="text-gray-700 font-semibold flex items-center">
                            <FaRedo className="text-green-500 mr-2" />Chính sách đổi trả: <span className="text-gray-500">Đổi trả miễn phí toàn quốc</span>
                        </p>
                    </Tooltip>
                    <Tooltip title="Chính sách khách sỉ">
                        <p className="text-gray-700 font-semibold flex items-center">
                            <FaUsers className="text-yellow-500 mr-2" />Chính sách khách sỉ: <span className="text-gray-500">Ưu đãi khi mua số lượng lớn</span>
                        </p>
                    </Tooltip>
                </div>
            </div>

            {/* Right Section */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800">{book.bookName}</h1>
                <p className="text-xl text-gray-600 mt-1">Nhà cung cấp: {book.createById}</p>
                <div className="flex items-center mt-2">
                    {[...Array(maxStars)].map((_, index) => (
                        <FontAwesomeIcon
                            key={index}
                            icon={index < filledStars ? faStar : faStarOutline}
                            className={index < filledStars ? 'text-yellow-500' : 'text-gray-400'}
                        />
                    ))}
                </div>

                {/* Shipping Information */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center gap-4 mb-4">
                        <FaShippingFast className="text-2xl text-blue-500" />
                        <div>
                            <p className="text-xl text-gray-700 font-semibold">Giao hàng tiêu chuẩn</p>
                            <p className="text-gray-500 text-base">Yêu cầu khi giao hàng: {book.requiredNote}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <div className="bg-yellow-100 text-yellow-600 py-2 px-4 rounded-lg flex items-center">
                            <FaTag className="mr-2" />
                            <span>Mã giảm 10k - tối đa 1</span>
                        </div>
                        <div className="bg-blue-100 text-blue-600 py-2 px-4 rounded-lg flex items-center">
                            <BsFillPatchCheckFill className="mr-2" />
                            <span>Mã giảm 25k - tối đa 2</span>
                        </div>
                        <div className="bg-green-100 text-green-600 py-2 px-4 rounded-lg flex items-center">
                            <FaCheckCircle className="mr-2" />
                            <span>Voucher giảm 5%</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thông tin chi tiết</h2>
                    <ul className="text-gray-700 text-lg">
                        <li><span className="font-semibold">Mã hàng:</span> {book.isbn}</li>
                        <li><span className="font-semibold">Trạng thái:</span> {book.status === 1 ? 'Còn hàng' : 'Hết hàng'}</li>
                        <li><span className="font-semibold">Trọng lượng (gr):</span> {book.weight}</li>
                        <li><span className="font-semibold">Kích thước bao bì:</span> {book.length} x {book.width} x {book.height} cm</li>
                        <li><span className="font-semibold">Số lượng trong kho:</span> {book.unitInStock}</li>
                        <li><span className="font-semibold">Ngày tạo:</span> {new Date(book.createDate).toLocaleDateString()}</li>
                    </ul>
                </div>

                {/* Product Description with Show More/Less Toggle */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Mô tả sản phẩm</h2>
                    <p className="text-2xl font-bold text-gray-800">{book.bookName}</p>
                    <p className="text-gray-600 mt-2 text-lg">{displayDescription}</p>
                    {isLongDescription && (
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-blue-500 mt-2 underline"
                        >
                            {showFullDescription ? 'Rút gọn' : 'Xem thêm'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
