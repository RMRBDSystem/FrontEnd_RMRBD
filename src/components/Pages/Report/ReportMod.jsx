import { useState, useEffect } from "react";
import { getAllReport } from "../../services/ReportService";
import { Link } from "react-router-dom";
import {
    FaFilter, FaSearch
} from "react-icons/fa";

const ReportMod = () => {
    const [reportList, setReportList] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const reports = await getAllReport();
            setReportList(reports);
            setFilteredReports(reports);
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        let filtered = reportList.filter((report) =>
            report.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (selectedStatus) {
            filtered = filtered.filter((report) => report.status === parseInt(selectedStatus));
        }
        setFilteredReports(filtered);
    };

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <section className="section-center min-h-screen">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Danh sách báo cáo</h2>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border rounded-md px-4 py-2 w-72"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="bg-[#f77c66] text-white px-4 py-2 rounded-md hover:bg-[#f56949] flex items-center"
                            onClick={handleSearch}
                        >
                            <FaSearch className="w-4 h-4 mr-2" />
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex space-x-4 mb-4">
                    <select
                        className="border rounded-md px-4 py-2 w-48"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="1">Đã xử lý</option>
                        <option value="-1">Chưa xử lý</option>
                        <option value="0">Đã hủy</option>
                    </select>
                    <button
                        className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center"
                        onClick={handleSearch}
                    >
                        <FaFilter className="w-4 h-4 mr-2" />
                        Lọc
                    </button>
                </div>

                {/* Table */}
                <table className="table-auto w-full">
                    <thead className="bg-gray-200">
                        <tr className="text-gray-700">
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Tiêu đề</th>
                            <th className="px-4 py-2 text-left">Ngày tạo</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((element) => (
                            <tr key={element.feedBackId} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{element.feedBackId}</td>
                                <td className="px-4 py-2">{element.title}</td>
                                <td className="px-4 py-2">
                                    {new Date(element.date).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </td>
                                <td className="px-4 py-2">
                                    {element.status === 1 ? (
                                        <span className="text-green-500">Đã xử lý</span>
                                    ) : element.status === -1 ? (
                                        <span className="text-yellow-500">Chưa xử lý</span>
                                    ) : (
                                        <span className="text-red-500">Đã hủy</span>
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    <Link to={`/reportresponse/${element.feedBackId}`} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                                        {element.status !== -1 ? "Chi tiết" : "Xử lý"}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-md mx-1 ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReportMod;