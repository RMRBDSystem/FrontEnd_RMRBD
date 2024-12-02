import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';  // Thêm useNavigate để điều hướng
import { getReportByAccountId, deleteReport } from '../../services/ReportService';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const ReportList = () => {
    const navigate = useNavigate();  // Khai báo useNavigate để điều hướng
    const [UserId, setUserId] = useState('');
    const [reportList, setReportList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const storedUserId = Cookies.get('UserId');
            if (storedUserId) {
                setUserId(storedUserId);
                const reports = await getReportByAccountId(storedUserId);
                setReportList(reports);
            } else {
                // Sử dụng navigate thay vì window.location.href để điều hướng
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);

    const handleDelete = async (id) => {
        try {
            const response = await deleteReport(id);
            if (response.status) {
                const storedUserId = Cookies.get('UserId');
                if (storedUserId) {
                    setUserId(storedUserId);
                    const reports = await getReportByAccountId(storedUserId);
                    setReportList(reports);
                    Swal.fire({
                        icon: 'success',
                        title: 'Xóa báo cáo thành công',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    navigate('/login');  // Điều hướng đến login nếu không có UserId
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xóa báo cáo thất bại',
                    showConfirmButton: true
                });
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi khi xóa báo cáo',
                text: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
                showConfirmButton: true
            });
        }
    };

    return (
        <section className='min-h-96 section-center max-w-4xl'>
            <Typography variant="h4" gutterBottom>
                Danh sách báo cáo
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/report')}  // Dùng navigate thay vì href
                sx={{ marginBottom: '16px' }}
            >
                Tạo báo cáo mới
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Tiêu đề</strong></TableCell>
                            <TableCell><strong>Ngày tạo</strong></TableCell>
                            <TableCell><strong>Trạng thái</strong></TableCell>
                            <TableCell><strong>Hành động</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportList.map((element, index) => (
                            <TableRow key={index}>
                                <TableCell>{element.feedBackId}</TableCell>
                                <TableCell>{element.title}</TableCell>
                                <TableCell>
                                    {new Date(element.date).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}
                                </TableCell>
                                <TableCell>
                                    {element.status === 1 ? (
                                        <span style={{ color: 'green' }}>Đã xử lý</span>
                                    ) : element.status === -1 ? (
                                        <span style={{ color: 'orange' }}>Chưa xử lý</span>
                                    ) : (
                                        <span style={{ color: 'red' }}>Đã hủy</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => navigate(`/reportdetail/${element.feedBackId}`)}  // Dùng navigate thay vì href
                                    >
                                        Chi tiết
                                    </Button>
                                    {element.status === -1 && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(element.feedBackId)}
                                            sx={{ marginLeft: '8px' }}
                                        >
                                            Hủy
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    );
};

export default ReportList;
