import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getReportById } from '../../services/ReportService';
import { updateReport } from '../../services/ReportService';

const ReportResponse = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState({});
    const [response, setResponse] = useState('');
    const [UserId, setUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const reportDetail = await getReportById(reportId);
            if (reportDetail) {
                setReport(reportDetail);
                const storedUserId = Cookies.get('UserId');
                if (storedUserId) {
                    setUserId(storedUserId);
                }
            }
        }

        fetchData();
    }, [reportId]);

    const handleCancel = async (id) => {

        if (response) {
            report.status = 0;
            report.response = response;
            report.employeeId = UserId;
            const response2 = await updateReport(id, report);
            if (response2.status) {
                alert('Cập nhật báo cáo thành công');
                window.location.href = '/reportmod';
            }
        } else {
            alert('Vui lòng nhập chi tiết phản hồi');
        }
    }

    const handleComplete = async (id) => {

        if (response) {
            report.status = 1;
            report.response = response;
            report.employeeId = UserId;
            const response2 = await updateReport(id, report);
            if (response2.status) {
                alert('Cập nhật báo cáo thành công');
                window.location.href = '/reportmod';
            }
        } else {
            alert('Vui lòng nhập chi tiết phản hồi');
        }
    }



    return (
        <div className="container">
            <a href="/reportmod" className="btn btn-primary mb-4">Quay lại danh sách</a>
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

            <div>
                <h1 className="text-center mb-4">Phản hồi</h1>
                {report.status === -1 && (
                    <textarea className="card-text" value={response} onChange={(e) => setResponse(e.target.value)}>
                        {report.response}
                    </textarea>
                )}

                {report.response && (
                    <p>
                        <strong>Phản hồi:</strong> {report.response}
                    </p>
                )}


                <div className="row">

                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-3">
                            {report.status === -1 && (
                                <button className="btn btn-danger" onClick={() => handleCancel(report.feedBackId)}>
                                    Từ chối
                                </button>

                            )}
                        </div>
                        <div className="col-md-3">
                            {report.status === -1 && (
                                <button className="btn btn-success" onClick={() => handleComplete(report.feedBackId)}>
                                    Hoàn thành
                                </button>
                            )}
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ReportResponse;