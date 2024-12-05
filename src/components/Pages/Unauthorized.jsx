import React from 'react';

const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Rất tiếc, bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền hạn của bạn hoặc liên hệ với quản trị viên để biết thêm chi tiết.
                </p>
                <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Trở về trang chủ
                </a>
            </div>
        </div>
    );
}

export default Unauthorized;
