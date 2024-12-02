import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById, deleteReport } from '../../services/ReportService';
import { Button, Typography, Card, CardContent, Box, Paper, Stack } from '@mui/material';
import Swal from 'sweetalert2';

const ReportDetail = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState({});
    const navigate = useNavigate();  // Điều hướng trang

    useEffect(() => {
        const fetchData = async () => {
            const reportDetail = await getReportById(reportId);
            if (reportDetail) {
                setReport(reportDetail);
            }
        };

        fetchData();
    }, [reportId]);

    const handleDelete = async (id) => {
        try {
            const response = await deleteReport(id);
            if (response.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Xóa báo cáo thành công',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/listreport');  // Điều hướng về danh sách báo cáo
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xóa báo cáo thất bại',
                    showConfirmButton: true
                });
                navigate('/login');  // Điều hướng đến trang đăng nhập nếu xóa thất bại
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
        <section className='section-center max-w-4xl'>
            <Box sx={{ padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/listreport')}
                    sx={{ marginBottom: '16px' }}
                >
                    Danh sách báo cáo
                </Button>

                <Typography variant="h4" gutterBottom align="center">
                    Chi tiết ý kiến
                </Typography>

                <Card sx={{ marginBottom: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Thông tin ý kiến
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>ID:</strong> {report.feedBackId}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Tiêu đề:</strong> {report.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Nội dung:</strong> {report.content}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Ngày tạo:</strong> {new Date(report.date).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Trạng thái:</strong>{' '}
                            {report.status === 1 ? (
                                <span style={{ color: 'green' }}>Đã xử lý</span>
                            ) : report.status === -1 ? (
                                <span style={{ color: 'orange' }}>Chưa xử lý</span>
                            ) : (
                                <span style={{ color: 'red' }}>Đã hủy</span>
                            )}
                        </Typography>

                        {report.response && (
                            <Typography variant="body1" paragraph>
                                <strong>Phản hồi:</strong> {report.response}
                            </Typography>
                        )}

                        <Box display="flex" justifyContent="center" mt={2}>
                            {report.status === -1 && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(report.feedBackId)}
                                >
                                    Hủy báo cáo
                                </Button>
                            )}
                        </Box>
                        {/* Hiển thị ảnh báo cáo */}
                        {report.imageUrl ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Paper sx={{ padding: 2 }}>
                                    <img src={report.imageUrl} alt="Report Image" className="img-fluid" style={{ Width: '100%', height: '100%' }} />
                                </Paper>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                                <Typography variant="body1">Không có ảnh</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </section>
    );
};

export default ReportDetail;
