import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEbookById, getFirstImageByEbookId } from "../../services/EBookService.js";
import { FaShippingFast, FaRedo, FaUsers, FaShoppingCart, FaCreditCard, FaTag, FaCheckCircle } from 'react-icons/fa';
import { Button } from '@material-tailwind/react';
import { Tooltip } from '@mui/material';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import CommentBooks from "../../CommentItem/CommentEbooks"; // Adjusted to CommentEbooks
import Cookies from 'js-cookie';
import "../../../assets/styles/Components/Rating.css";
import { getAccountById } from "../../services/AccountService";
import { getProvinceName, fetchDistrictName, fetchWardName } from '../../services/AddressService';
import { ToastContainer, toast } from 'react-toastify';

const EbookDetail = () => {
    const { ebookId } = useParams(); // Changed bookId to ebookId
    const [ebook, setEbook] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [address, setAddress] = useState(null);
    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');
    const [createById, setCreateById] = useState(null);
    const accountId = Cookies.get("UserId");

    useEffect(() => {
        const fetchEbookData = async () => {
            try {
                const data = await getEbookById(ebookId); // Adjusted to getEbookById
                const imageData = await getFirstImageByEbookId(ebookId); // Adjusted to getFirstImageByEbookId
                setEbook(data);
                setImageUrl(imageData);

                const createbyName = await getAccountById(data.createById);
                setCreateById(data.createById);
                setAccountName(createbyName.userName);

                const addressData = await fetch(`https://rmrbdapi.somee.com/odata/CustomerAddress/${data.senderAddressId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': '123-abc',
                    },
                });

                if (!addressData.ok) {
                    throw new Error('Failed to fetch address data');
                }

                const addressJson = await addressData.json();
                setAddress(addressJson);

                const province = await getProvinceName(addressJson.provinceCode);
                const district = await fetchDistrictName(addressJson.provinceCode, addressJson.districtCode);
                const ward = await fetchWardName(addressJson.districtCode, addressJson.wardCode);

                setProvinceName(province);
                setDistrictName(district);
                setWardName(ward);
            } catch (err) {
                setError('Có lỗi xảy ra khi tải dữ liệu ebook');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEbookData();
    }, [ebookId, accountId]);

    const addToCart = async () => {
        try {
            const customerId = Cookies.get('UserId');
            if (!customerId) {
                toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
                return;
            }

            const clientAddressId = address?.addressId;
            const totalPrice = ebook.price; // Adjusted to ebook.price
            const shipFee = 0; 

            const existingOrderResponse = await fetch(`https://rmrbdapi.somee.com/odata/EbookOrder?$filter=customerId eq ${customerId}`, {
                method: 'GET',
                headers: {
                    'Token': '123-abc',
                    'Content-Type': 'application/json',
                },
            });

            if (!existingOrderResponse.ok) {
                console.error('Failed to fetch existing orders:', existingOrderResponse.status);
                throw new Error('Failed to check for existing orders');
            }

            const allOrdersData = await existingOrderResponse.json();

            const unpaidOrders = allOrdersData.filter(order => order.status === 1);

            const matchingOrder = unpaidOrders.find(order => parseInt(order.clientAddressId, 10) === parseInt(clientAddressId, 10));

            let orderIdToUse = matchingOrder ? matchingOrder.orderId : null;

            if (orderIdToUse) {
                const orderDetailResponse = await fetch(`https://rmrbdapi.somee.com/odata/EbookOrderDetail?$filter=orderId eq ${orderIdToUse} and ebookId eq ${ebook.ebookId}`, { // Adjusted to ebookId
                    method: 'GET',
                    headers: {
                        'Token': '123-abc',
                        'Content-Type': 'application/json',
                    },
                });

                const orderDetailData = await orderDetailResponse.json();

                if (orderDetailData.length === 0) {
                    const addEbookResponse = await fetch('https://rmrbdapi.somee.com/odata/EbookOrderDetail', {
                        method: 'POST',
                        headers: {
                            'Token': '123-abc',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            orderId: orderIdToUse,
                            ebookId: ebook.ebookId, // Adjusted to ebook.ebookId
                            quantity: 1, 
                            price: ebook.price, // Adjusted to ebook.price
                        }),
                    });

                    if (!addEbookResponse.ok) {
                        console.error('Failed to add ebook to order details:', addEbookResponse.status);
                        throw new Error('Failed to add ebook to order details');
                    }

                    console.log('Ebook added to the existing order');
                } else {
                    console.log('Ebook is already in the order');
                }
            } else {
                const newOrderResponse = await fetch('https://rmrbdapi.somee.com/odata/EbookOrder', {
                    method: 'POST',
                    headers: {
                        'Token': '123-abc',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerId: customerId,
                        totalPrice: totalPrice,
                        shipFee: shipFee,
                        price: totalPrice,
                        clientAddressId: clientAddressId,
                        status: 1,
                        purchaseDate: new Date().toISOString(),
                    }),
                });

                if (!newOrderResponse.ok) {
                    console.error('Failed to create new order:', newOrderResponse.status);
                    throw new Error('Failed to create new order');
                }

                const newOrderData = await newOrderResponse.json();
                const newOrderId = newOrderData.orderId;

                const addEbookResponse = await fetch('https://rmrbdapi.somee.com/odata/EbookOrderDetail', {
                    method: 'POST',
                    headers: {
                        'Token': '123-abc',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: newOrderId,
                        ebookId: ebook.ebookId, // Adjusted to ebook.ebookId
                        quantity: 1, 
                        price: ebook.price, // Adjusted to ebook.price
                    }),
                });

                if (!addEbookResponse.ok) {
                    console.error('Failed to add ebook to new order details:', addEbookResponse.status);
                    throw new Error('Failed to add ebook to new order details');
                }

                console.log('New order created and ebook added');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;
    if (!ebook) return <p>Không tìm thấy thông tin ebook.</p>; // Adjusted text

    const isLongDescription = ebook.description.length > 300;
    const displayDescription = showFullDescription ? ebook.description : ebook.description.slice(0, 300) + '...';

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg grid grid-cols-2 gap-8">
                {/* Left Section - Image, Buttons, Policies */}
                <div className="relative">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-inner p-6 -z-10"></div>
    
                    {/* Image */}
                    <div className="mb-4 z-10">
                        <img src={imageUrl || 'https://via.placeholder.com/150'} alt={ebook.ebookName} className="w-full rounded-lg shadow-lg" />
                    </div>
    
                    {/* Buttons */}
                    <div className="flex gap-4 mb-4 z-10">
                        <Button className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg w-1/2" onClick={addToCart}>
                            <FaShoppingCart className="mr-2" /> Thêm vào giỏ hàng
                        </Button>
                        <Button className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg w-1/2">
                            <FaCreditCard className="mr-2" /> Mua ngay
                        </Button>
                    </div>
    
                    {/* Policies */}
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
    
                {/* Right Section - Ebook Details, Description, Rating */}
                <div>
                    {/* Ebook Title and Price */}
                    <h1 className="text-4xl font-bold text-gray-800">{ebook.ebookName}</h1>
                    <p className="text-xl text-gray-600 mt-1">Nhà cung cấp: {accountName}</p>
                    <div className="flex items-baseline mt-4 mb-4">
                        <span className="text-3xl font-bold text-red-600">{ebook.price.toLocaleString()} đ</span>
                        <span className="text-xl text-gray-500 line-through ml-2">{ebook.price.toLocaleString()} đ</span>
                        <span className="text-lg text-white bg-red-600 px-2 py-1 ml-4 rounded">-{ebook.discount}0%</span>
                    </div>
    
                    {/* Rating Section */}
                    <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, index) => {
                            let starColor = "#e4e5e9"; // Default star color
                            if (index < fullStars) {
                                starColor = "#ffc107"; // Full star
                            } else if (index === fullStars && halfStar) {
                                starColor = "#ffc107"; // Half star
                            }
                            return (
                                <label key={index}>
                                    <input type="radio" name="rating" value={index + 1} style={{ display: "none" }} />
                                    <FaStar className="star" size={20} color={starColor} />
                                </label>
                            );
                        })}
                    </div>
    
                    {/* Shipping Information */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <FaShippingFast className="text-2xl text-blue-500" />
                            <div>
                                <p className="text-xl text-gray-700 font-semibold">Giao hàng tiêu chuẩn</p>
                                <p className="text-gray-500 text-base">Yêu cầu khi giao hàng: {ebook.requiredNote}</p>
                                <h3 className="text-xl font-semibold mt-6">Địa chỉ giao hàng</h3>
                                <p>{provinceName}, {districtName}, {wardName}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <div className="bg-yellow-100 text-yellow-600 py-2 px-4 rounded-lg flex items-center">
                                <FaTag className="mr-2" />
                                <span>Mã giảm giá 10K cho đơn hàng từ 130K</span>
                            </div>
                            <div className="bg-blue-100 text-blue-600 py-2 px-4 rounded-lg flex items-center">
                                <BsFillPatchCheckFill className="mr-2" />
                                <span>Mã giảm giá 20K cho đơn hàng từ 280K</span>
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
                            <li className="flex">
                                <span className="font-semibold" style={{ minWidth: '200px' }}>Mã hàng:</span>
                                <span style={{ marginLeft: '20px' }}>{ebook.isbn}</span>
                            </li>
                            <li className="flex">
                                <span className="font-semibold" style={{ minWidth: '200px' }}>Trạng thái:</span>
                                <span style={{ marginLeft: '20px' }}>{ebook.status === 1 ? 'Còn hàng' : 'Hết hàng'}</span>
                            </li>
                            <li className="flex">
                                <span className="font-semibold" style={{ minWidth: '200px' }}>Trọng lượng (gr):</span>
                                <span style={{ marginLeft: '20px' }}>{ebook.weight}</span>
                            </li>
                            <li className="flex">
                                <span className="font-semibold" style={{ minWidth: '200px' }}>Kích thước bao bì:</span>
                                <span style={{ marginLeft: '20px' }}>{ebook.length} x {ebook.width} x {ebook.height} cm</span>
                            </li>
                            <li className="flex">
                                <span className="font-semibold" style={{ minWidth: '200px' }}>Số lượng trong kho:</span>
                                <span style={{ marginLeft: '20px' }}>{ebook.unitInStock}</span>
                            </li>
                            <li className="flex">
                                <span className="font-semibold" style={{ minWidth: '200px' }}>Ngày tạo:</span>
                                <span style={{ marginLeft: '20px' }}>{new Date(ebook.createDate).toLocaleDateString()}</span>
                            </li>
                        </ul>
                    </div>
    
                    {/* Product Description with Show More/Less Toggle */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Mô tả sản phẩm</h2>
                        <p className="text-2xl font-bold text-gray-800">{ebook.ebookName}</p>
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
    
                {/* Rating Section */}
                <div className="rating-container">
                    <div className="rating-header">
                        <h3>Đánh giá sản phẩm</h3>
                    </div>
                    <div className="rating-summary">
                        <div className="rating-score">
                            <span className="score">{roundedAverageRate}</span>
                            <span className="out-of">/5</span>
                        </div>
                        <div className="rating-stars">
                            <div className="stars">
                                {[...Array(5)].map((_, index) => {
                                    let starColor = "#e4e5e9"; // Default star color
                                    if (index < fullStars) {
                                        starColor = "#ffc107"; // Full star
                                    } else if (index === fullStars && halfStar) {
                                        starColor = "#ffc107"; // Half star
                                    }
                                    return (
                                        <label key={index}>
                                            <input type="radio" name="rating" value={index + 1} style={{ display: "none" }} />
                                            <FaStar className="star" size={20} color={starColor} />
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="rating-count">({countRate} đánh giá)</div>
                        </div>
                    </div>
                </div>
    
                {/* Review Button */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <button className="write-review-button" style={{ width: "100%", height: "70px" }} onClick={handleOpenModal}>
                        <span role="img" aria-label="write">✏️</span> Give your stars for this recipe
                    </button>
                </div>
    
            </div>
            <CommentBooks ebookId={ebookId} createById={createById} />
            <ToastContainer />
        </>
    );
};
export default EbookDetail;