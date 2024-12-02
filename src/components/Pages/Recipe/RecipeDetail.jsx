import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../../services/RecipeService';
import { saveRecipeRate, updateRecipeRate, getRecipeRatePoint, getCountRecipeRateByRecipeId, checkRated } from '../../services/RecipeRateService';
import { getAccountById } from "../../services/AccountService"
import Cookies from 'js-cookie';
import { FaStar } from 'react-icons/fa'
import "../../../assets/styles/Components/Rating.css"
import CommentRecipes from "../../CommentItem/CommentRecipes";
import { useSocket } from "../../../App"
import { createNotification } from "../../services/NotificationService"
const RecipeDetail = () => {
    const accountId = Cookies.get("UserId");
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null)
    const [imageUrl, setImageUrl] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [accountName, setAccountName] = useState("")
    const maxStars = 5;

    //rating
    const [createById, setCreateById] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [ratepoint, setRatepoint] = useState("");
    const [averageRate, setAverageRate] = useState(0);
    const [countRate, setCountRate] = useState(0);
    const [hover, setHover] = useState(null);
    const [checkRatedStatus, setcheckRated] = useState("");
    const [roleaccountonline, setRoleaccountonline] = useState("");
    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleSaveRecipeRate = async () => {
        try {
            await saveRecipeRate(recipeId, accountId, ratepoint);
            setShowModal(false); // Đóng modal khi lưu thành công
            window.location.reload();
        } catch (error) {
            console.error("Failed to save recipe rate:", error);
        }
    };

    const handleUpdateRecipeRate = async () => {
        try {
            await updateRecipeRate(recipeId, accountId, ratepoint);
            setShowModal(false); // Đóng modal khi lưu thành công
            window.location.reload();
        } catch (error) {
            console.error("Failed to save recipe rate:", error);
        }
    };

    const { socket, accountOnline } = useSocket();
    const handleNotification = (text) => {
        socket.emit("sendNotification", {
            senderName: accountOnline,
            receiverName: accountName,
            content: text,
        });
        const addNotification = () => {
            const newNotificationData = {
                accountId: createById,
                content: text,
                date: new Date().toISOString(),
                status: 1,
            };
            createNotification(newNotificationData); // Không cần await
        };
        addNotification();
    };



    useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                const data = await getRecipeById(recipeId);

                const rateData = await getRecipeRatePoint(recipeId);
                const countrate = await getCountRecipeRateByRecipeId(recipeId);
                const checkrateddata = await checkRated(recipeId, accountId);
                const createbyName = await getAccountById(data.createById);
                const infoacconline = await getAccountById(accountId);
                setcheckRated(checkrateddata?.ratePoint);
                //console.log('Đã rated: ', checkRatedStatus);
                setAverageRate(rateData[0]?.AvgRatePoint);
                setCountRate(countrate || 0);
                setCreateById(data.createById);
                setRecipe(data);
                setRoleaccountonline(infoacconline.roleId);
                //console.log('Đã rated: ', data);
                setAccountName(createbyName.userName);
                setImageUrl(data.images);
            } catch (err) {
                alert('Lượng công thức hiện quá tải, Vui lòng tải lại trang')
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipeData();
    }, [recipeId, accountId]);

    // Calculate how many stars are filled based on averageRate
    let roundedAverageRate = 0;
    if (averageRate > 0) { roundedAverageRate = parseFloat(averageRate.toFixed(2)) }
    const fullStars = Math.floor(roundedAverageRate);
    const halfStar = averageRate % 1 >= 0.5 ? 1 : 0;

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;
    if (!recipe) return <p>Không tìm thấy thông tin công thức.</p>;

    const isLongDescription = recipe.description.length > 300;
    const displayDescription = showFullDescription ? recipe.description : recipe.description.slice(0, 300) + '...';



    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg grid grid-cols-2 gap-8">
            {/* Phần bên trái với lớp nền */}
            <div className="relative">
                {/* Lớp nền */}
                <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-inner p-6 -z-10"></div>

                {/* Phần hình ảnh */}
                <div className="mb-4 z-10 flex flex-wrap gap-4">
                    {imageUrl.map((image, index) => (
                        <img
                            key={index}
                            src={image.imageUrl || 'https://via.placeholder.com/150'}
                            alt={recipe.recipeName}
                            className="w-full rounded-lg shadow-lg"
                        />

                    ))}

                </div>

                {/* Các nút */}


                {/* Các chính sách */}
                <div className="space-y-2 z-10">

                </div>
            </div>

            {/* Right Section */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800">{recipe.recipeName} </h1>
                <p className="text-xl text-gray-600 mt-1">Nhà cung cấp: {accountName || "Hệ thống"}</p>
                <div className="flex items-center mt-2" >
                    {[...Array(maxStars)].map((_, index) => {
                        let starColor = "#e4e5e9"; // Màu sao chưa được đánh giá
                        if (index < fullStars) {
                            starColor = "#ffc107"; // Màu sao đầy
                        } else if (index === fullStars && halfStar) {
                            starColor = "#ffc107"; // Màu sao nửa
                        }
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={index + 1}
                                    disabled // Disable không cho click
                                    style={{ display: "none" }}
                                />
                                <FaStar className="star" size={20}
                                    color={starColor}
                                />
                            </label>
                        );
                    })}

                </div>

                {/* Shipping Information */}


                {/* Detailed Information */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thông tin chi tiết</h2>
                    <ul className="text-gray-700 text-lg">
                        <li><span className="font-semibold">Mã hàng:</span> {recipe.numberOfService}</li>
                        <li><span className="font-semibold">Sự dinh dưỡng:</span> {recipe.nutrition}</li>
                        <li><span className="font-semibold">Hướng dẫn:</span> {recipe.tutorial}</li>
                        <li><span className="font-semibold">Video:</span> {recipe.Video}</li>
                        <li><span className="font-semibold">Giá:</span> {recipe.price ? recipe.price + ' đ' : 'Free'}</li>
                        <li><span className="font-semibold">Thành phần:</span> {recipe.ingredient}</li>
                        <li><span className="font-semibold">Ngày tạo:</span> {new Date(recipe.createDate).toLocaleDateString()}</li>
                    </ul>
                </div>

                {/* Product Description with Show More/Less Toggle */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Mô tả sản phẩm</h2>
                    <p className="text-2xl font-bold text-gray-800">{recipe.recipeName}</p>
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
            {/* <Rating /> */}
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
                            {[...Array(maxStars)].map((_, index) => {
                                let starColor = "#e4e5e9"; // Màu sao chưa được đánh giá
                                if (index < fullStars) {
                                    starColor = "#ffc107"; // Màu sao đầy
                                } else if (index === fullStars && halfStar) {
                                    starColor = "#ffc107"; // Màu sao nửa
                                }
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={index + 1}
                                            disabled // Disable không cho click
                                            style={{ display: "none" }}
                                        />
                                        <FaStar className="star" size={20}
                                            color={starColor}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        <div className="rating-count">({countRate} đánh giá)</div>
                    </div>
                </div>
                <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="rating-bar">
                            <span>{star} sao</span>
                            <div className="bar">
                                <div className="fill" style={{ width: "0%" }}></div>
                            </div>
                            <span>0%</span>
                        </div>
                    ))}
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 text-center">Let us know how you liked this recipe</h2>
                            <div className="text-center">

                                {[...Array(5)].map((star, index) => {
                                    const currentRating = index + 1;
                                    return (
                                        <label key={index}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={currentRating}
                                                onChange={(e) => setRatepoint(e.target.value)}
                                                style={{ display: "none" }}
                                            />
                                            <FaStar className="star" size={50}
                                                color={currentRating <= (hover || ratepoint) ? "#ffc107" : "#e4e5e9"}
                                                onMouseEnter={() => setHover(currentRating)}
                                                onMouseLeave={() => setHover(null)}
                                            />
                                        </label>
                                    );
                                })}
                                {!checkRatedStatus ? (
                                    <p>Your star rating is {ratepoint}</p>
                                ) : (
                                    <>
                                        <p style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                            Your last star rating was {checkRatedStatus} <FaStar color="#ffc107" style={{ marginLeft: '2px', marginBottom: '1.5px' }} />
                                        </p>
                                        <p>Your star rating this time is {ratepoint}</p>
                                    </>
                                )}

                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-custom-orange hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        handleNotification(`${accountOnline} đã đánh giá ${ratepoint} sao về công thức ${recipe.recipeName} của bạn`);
                                        checkRatedStatus ? handleUpdateRecipeRate() : handleSaveRecipeRate();
                                    }}
                                >
                                    {checkRatedStatus ? "Update Ratepoint" : "Save Ratepoint"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <button className="write-review-button" style={{ width: " 100%", height: "70px" }} onClick={handleOpenModal}>
                    <span role="img" aria-label="write">✏️</span> Give your stars for this recipe
                </button>
            </div>
        </div>

    );

};

export default RecipeDetail;
