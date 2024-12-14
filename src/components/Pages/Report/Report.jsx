import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { saveReportImage, saveReport } from '../../services/ReportService';
import { TextField, Button, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';  // Import SweetAlert2
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import { useSocket } from '../../../App'
import { getAccountByRoleId} from '../../services/AccountService'
import { createNotification } from '../../services/NotificationService'
import { decryptData } from "../../Encrypt/encryptionUtils";
const ReportPage = () => {
    const imageInput = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [UserId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state
    const navigate = useNavigate();  // Initialize useNavigate hook

    const [listModer,setListModer]=useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const storedUserId = decryptData(Cookies.get("UserId"));
                if (storedUserId) {
                    setUserId(storedUserId);
                }
                const stored = await getAccountByRoleId();
                const extractedModeratornames = stored.map(account => ({
                    Id: account.accountId,
                    userName: account.userName
                }));
                setListModer(extractedModeratornames);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReport();
    }, [listModer]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !content) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập đầy đủ thông tin',
                showConfirmButton: true
            });
            return;
        }

        const report = {
            CustomerId: UserId,
            Title: title,
            Content: content,
            Status: -1
        };

        setLoading(true);  // Set loading state to true

        try {
            const response = await saveReport(report);

            if (!response) {
                Swal.fire({
                    icon: 'error',
                    title: 'Báo cáo thất bại',
                    showConfirmButton: true
                });
                setLoading(false);
                return;
            }

            if (image) {
                const responseImage = await saveReportImage(response.feedBackId, image);
                if (responseImage) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Cảm ơn vì đã cung cấp ý kiến',
                        showConfirmButton: true
                    }).then(() => {
                        navigate('/listreport');  // Navigate to the report list page
                    });
                } else {
                    setLoading(false);
                }
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Cảm ơn vì đã cung cấp ý kiến',
                    showConfirmButton: true
                }).then(() => {
                    navigate('/listreport');  // Navigate to the report list page
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Báo cáo thất bại',
                text: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
                showConfirmButton: true
            });
            setLoading(false);
        }
    };

    const { socket, accountOnline } = useSocket();
    
    const handleNotification = (text) => {
        for (let i = 0; i < listModer.length; i++) {
            // Gửi thông báo qua socket
            socket.emit("sendNotification", {
                senderName: accountOnline,
                receiverName: listModer[i].userName,
                content: text,
            });
        
            // Tạo thông báo mới
            const newNotificationData = {
                accountId: listModer[i].Id,
                content: text,
                date: new Date().toISOString(),
                status: 1,
            };
        
            // Gọi hàm tạo thông báo (không cần await nếu bạn không cần phải chờ)
            createNotification(newNotificationData);
        }
        
    };

    return (
        <section className="section-center">
            <div className="report-page max-w-4xl container text-center bg-white shadow-lg rounded p-3 my-3 mx-auto">
                <span className="material-icons text-6xl">
                    email
                </span>
                <Typography variant="h5" color="" gutterBottom><strong>Đơn Khiếu Nại</strong></Typography>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Title Input */}
                    <Box mb={3}>
                        <TextField
                            label="Tiêu đề"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            fullWidth
                            error={title === ""}
                            helperText={title === "" ? "Vui lòng nhập tiêu đề" : ""}
                        />
                    </Box>

                    {/* Content Textarea */}
                    <Box mb={3}>
                        <TextField
                            label="Nội dung"
                            id="content"
                            name="content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            required
                            fullWidth
                            multiline
                            rows={4}
                            error={content === ""}
                            helperText={content === "" ? "Vui lòng nhập nội dung" : ""}
                        />
                    </Box>

                    {/* Image Input */}
                    <Box mb={3}>
                        <label
                            htmlFor="fileInput"
                            className="block cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:bg-gray-300 hover:border-gray-600"
                        >
                            <h1 className="material-icons text-6xl">cloud_upload</h1>
                            <p className="text-lg">Tải hình ảnh lên (nếu có)</p>
                            <input
                                type="file"
                                id="fileInput"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange} // Handle file change event
                                ref={imageInput} // Assign ref to input
                                style={{ display: 'none' }} // Hide input element if needed
                            />
                            {image && (
                                <Box mt={2}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Uploaded Image"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => {
                                            setImage(null);
                                            imageInput.current.value = ''; // Clear input value
                                        }}
                                        sx={{ mt: 1 }}
                                    >
                                        Gỡ bỏ
                                    </Button>
                                </Box>
                            )}
                        </label>
                    </Box>

                    {/* Submit and History buttons */}
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            type="submit"
                            sx={{ mr: 2 }}
                            disabled={loading}
                            onClick={() => handleNotification(`${accountOnline} đã gửi khiếu nại về hệ thống`)} // Correctly placed here
                        >
                            {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
                        </Button>
                        <Button variant="outlined" color="error" size="large" href="/listreport">
                            Xem lịch sử báo cáo
                        </Button>
                    </Box>
                </form>
            </div>
        </section>
    );
};

export default ReportPage;
