import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getReportByAccountId } from '../../services/ReportService';
import { deleteReport } from '../../services/ReportService';


const ReportList = () => {

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
                window.location.href = '/login';
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await deleteReport(id);
            if (response.status) {
                const storedUserId = Cookies.get('UserId');
                if (storedUserId) {
                    setUserId(storedUserId);
                    const reports = await getReportByAccountId(storedUserId);
                    setReportList(reports);
                    artalert('Xóa báo cáo thành công');
                } else {
                    window.location.href = '/login';
                }
            }
            else {
                alert('Xóa báo cáo thất bại');
            }

        } catch (error) {
            console.error('Error deleting report:', error);
        }
    }

    return (

        <div>
            <a href={`/report`} class="btn btn-primary">Tạo báo cáo mới</a>
            <h1>Report List</h1>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Tiêu đề</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {reportList.map((element, index) => (
                        <tr key={index}>

                            <th scope="row">{element.feedBackId}</th>
                            <td>{element.title}</td>
                            <td>
                                {new Date(element.date).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}
                            </td>
                            <td>
                                {element.status === 1 ? <span style={{ color: 'green' }}>Đã sử lý</span> : element.status === -1 ? <span style={{ color: 'yellow' }}>Chưa sử lý</span> : <span style={{ color: 'red' }}>Đã Hủy</span>}
                            </td>
                            <td>
                                <a href={`/reportdetail/${element.feedBackId}`} class="btn btn-primary">Chi tiết</a>

                                {element.status === -1 && (
                                    <button className="btn btn-danger" onClick={() => handleDelete(element.feedBackId)}>
                                        Hủy
                                    </button>
                                )}


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReportList;