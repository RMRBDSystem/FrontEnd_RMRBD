import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getReportById } from '../../services/ReportService';
import { deleteReport } from '../../services/ReportService';

const ReportDetail = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const reportDetail = await getReportById(reportId);
            if (reportDetail) {
                setReport(reportDetail);
            }
        }

        fetchData();
    }, [reportId]);

    const handleDelete = async (id) => {
        try {
            const response = await deleteReport(id);
            if (response.status) {
                alert('Xóa báo cáo thành công');
                window.location.href = '/listreport';
            } else {
                alert('Xóa báo cáo thất bại');
                window.location.href = '/login';
            }
        }
        catch (error) {
            console.error('Error deleting report:', error);
        }
    }

    return (
        <div className="container">
            <a href="/listreport" className="btn btn-primary">Danh sách báo cáo</a>
            <h1 className="text-center mb-4">Chi tiết ý kiến</h1>

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Thông tin ý kiến</h5>
                            <p className="card-text">
                                <strong>ID:</strong> {report.feedBackId}
                            </p>
                            <p className="card-text">
                                <strong>Tiêu đề:</strong> {report.title}
                            </p>
                            <p className="card-text">
                                <strong>Nội dung:</strong> {report.content}
                            </p>
                            <p className="card-text">
                                <strong>Ngày tạo:</strong> {new Date(report.date).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}
                            </p>
                            <p className="card-text">
                                <strong>Trạng thái:</strong> {(() => {
                                    if (report.status === 1) return <span style={{ color: 'green' }}>Đã sử lý</span>;
                                    else if (report.status === -1) return <span style={{ color: 'yellow' }}>Chưa sử lý</span>;
                                    else if (report.status === 0) return <span style={{ color: 'red' }}>Đã Hủy</span>;
                                })()}
                            </p>

                            {report.response && (
                                <p>
                                    <strong>Phản hồi:</strong> {report.response}
                                </p>
                            )}
                            <div className="row">
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    {report.status === -1 && (
                                        <button className="btn btn-danger" onClick={() => handleDelete(report.feedBackId)}>
                                            Hủy
                                        </button>
                                    )}
                                </div>
                                <div className="col-md-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {report.imageUrl ? (
                    <div className="col-md-6">
                        <img src={report.imageUrl} alt="Report Image" className="img-fluid" />
                    </div>
                ) : (
                    <div className="col-md-6">
                        Không có ảnh
                    </div>
                )}
            </div>

        </div>
    );
}

export default ReportDetail;