import React, { useState, useEffect } from "react";
import { getAllReport } from "../../services/ReportService";

const ReportMod = () => {
    const [reportList, setReportList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const reports = await getAllReport();
            setReportList(reports);
        };

        fetchData();
    }, []);

    return (
        <div>
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

                                {element.status !== -1 ? (
                                    <a href={`/reportresponse/${element.feedBackId}`} class="btn btn-primary">Chi tiết</a>
                                ) : (
                                    <a href={`/reportresponse/${element.feedBackId}`} class="btn btn-primary">Sử lý</a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReportMod