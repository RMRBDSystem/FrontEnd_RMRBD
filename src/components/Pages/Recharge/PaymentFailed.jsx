import React from "react";

const PaymentFailed = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Thanh toán thất bại!</h2>
      <p className="text-gray-800">Rất tiếc, đã xảy ra lỗi trong quá trình thanh toán.</p>
      <p className="text-sm text-gray-500 mt-4">Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ.</p>
      <a href="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Trở về trang chủ
      </a>
    </div>
  );
};

export default PaymentFailed;
