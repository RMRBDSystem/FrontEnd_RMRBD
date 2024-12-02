import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md text-gray-800 mb-10">
      <h1 className="text-2xl font-black mb-6">
        Điều khoảng và điều kiện dịch vụ nạp xu
      </h1>
      <p className="mb-4">
        <strong>Ngày áp dụng:</strong> Tháng 10, 2024
      </p>
      <p className="mb-6">
        Các điều khoản và điều kiện này ("Điều khoản") điều chỉnh việc mua xu ảo ("Xu") và nội dung số (bao gồm sách điện tử, công thức nấu ăn và các tài liệu khác) trên trang web của chúng tôi ("Trang web"). Bằng cách thực hiện giao dịch, bạn đồng ý với các Điều khoản này.
      </p>

      <h2 className="text-lg font-semibold mb-4">1. Điều kiện để mua Xu và nội dung</h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          Để thực hiện mua hàng, bạn cần:
          <ul className="list-decimal ml-8 space-y-1">
            <li>Là người dùng đã đăng ký trên Trang web.</li>
            <li>
              Đủ 18 tuổi hoặc đạt độ tuổi trưởng thành theo quy định pháp luật tại nơi cư trú.
            </li>
          </ul>
        </li>
        <li>
          Xu chỉ được sử dụng trong phạm vi Trang web và không thể đổi thành tiền mặt hoặc sử dụng cho các mục đích ngoài nền tảng.
        </li>
        <li>
          Chúng tôi có quyền từ chối giao dịch nếu phát hiện vi phạm hoặc nghi ngờ có hoạt động gian lận.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mb-4">2. Phương thức thanh toán và giao dịch</h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          Chúng tôi chấp nhận thanh toán qua thẻ ngân hàng, ví điện tử và các phương thức khác được liệt kê trên Trang web.
        </li>
        <li>
          Nếu giao dịch thất bại do lỗi từ ngân hàng hoặc nhà cung cấp dịch vụ thanh toán, chúng tôi sẽ hủy giao dịch.
        </li>
        <li>
          Nếu tài khoản của bạn vô tình được cộng thêm Xu nhiều hơn số lượng đã mua, chúng tôi có quyền điều chỉnh lại số dư.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mb-4">3. Chính sách hoàn tiền</h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          Bạn có thể yêu cầu hoàn tiền trong vòng 14 ngày kể từ ngày giao dịch, với điều kiện Xu hoặc nội dung chưa được sử dụng.
        </li>
        <li>
          Để yêu cầu hoàn tiền, vui lòng liên hệ với đội ngũ hỗ trợ khách hàng và cung cấp thông tin chi tiết về giao dịch.
        </li>
        <li>
          Khoản tiền hoàn sẽ được xử lý về phương thức thanh toán ban đầu và có thể mất đến 7 ngày làm việc để hoàn tất.
        </li>
        <li>
          Chúng tôi có quyền từ chối yêu cầu hoàn tiền nếu phát hiện lạm dụng hoặc vi phạm chính sách.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mb-4">4. Thay đổi Điều khoản</h2>
      <p className="mb-6">
        Chúng tôi có thể cập nhật các Điều khoản này mà không cần thông báo trước. Việc bạn tiếp tục sử dụng Trang web sau khi Điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi.
      </p>

      <h2 className="text-lg font-semibold mb-4">5. Liên hệ Hỗ trợ</h2>
      <p>
        Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng liên hệ với chúng tôi qua email:{" "}
        <a
          href="mailto:support@example.com"
          className="text-blue-500 hover:underline"
        >
          support@example.com
        </a>
        .
      </p>
    </div>
  );
};

export default TermsAndConditions;
