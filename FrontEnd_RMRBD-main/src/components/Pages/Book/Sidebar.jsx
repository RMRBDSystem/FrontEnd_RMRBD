import React from 'react';

function Sidebar() {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-4">Nhóm Sản Phẩm</h2>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Loại Sách</label>
                <ul className="text-gray-700">
                    <li><input type="checkbox" /> Món Á</li>
                    <li><input type="checkbox" /> Món Âu</li>
                    <li><input type="checkbox" /> Món Việt</li>
                    <li><input type="checkbox" /> Món Hàn</li>
                    <li><input type="checkbox" /> Món Nhật</li>
                </ul>
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Giá</label>
                <ul className="text-gray-700">
                    <li><input type="checkbox" /> 0đ - 150,000đ</li>
                    <li><input type="checkbox" /> 150,000đ - 300,000đ</li>
                    <li><input type="checkbox" /> 300,000đ - 500,000đ</li>
                </ul>
            </div>
            {/* Thêm các bộ lọc khác nếu cần */}
        </div>
    );
}

export default Sidebar;
