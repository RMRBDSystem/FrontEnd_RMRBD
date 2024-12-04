import React, { useState } from "react";

const FAQPage = () => {
  const sections = [
    {
      id: "subscriber",
      title: "Trở thành Người Đăng Ký",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>H: Làm thế nào để tôi đăng ký?</strong>
            <br />
            Đ: Truy cập trang đăng ký của chúng tôi để khám phá các lựa chọn phù hợp nhất với nhu cầu ẩm thực của bạn. Bạn có thể chọn giữa các gói đăng ký hàng tháng hoặc hàng năm để truy cập vào các công thức nấu ăn và sách điện tử độc quyền.
          </p>
          <p className="text-lg">
            <strong>H: Có hỗ trợ truy cập quốc tế không?</strong>
            <br />
            Đ: Có, đăng ký có sẵn cho người dùng trên toàn cầu. Giá sẽ được hiển thị bằng đồng tiền địa phương của bạn khi thanh toán.
          </p>
        </>
      ),
    },
    {
      id: "subscription",
      title: "Lợi Ích Của Đăng Ký",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>H: Tôi sẽ nhận được những lợi ích gì khi đăng ký?</strong>
            <br />
            Đ: Người đăng ký sẽ được truy cập không giới hạn vào hàng nghìn công thức nấu ăn được chọn lọc, các hướng dẫn nấu ăn chi tiết và nội dung độc quyền. Bạn cũng sẽ nhận được quyền truy cập miễn phí hoặc giảm giá vào sách điện tử cao cấp và sách nấu ăn in từ các đầu bếp hàng đầu.
          </p>
          <p className="text-lg">
            <strong>H: Tôi có thể truy cập vào nội dung mới không?</strong>
            <br />
            Đ: Có, chúng tôi thường xuyên cập nhật bộ sưu tập với các công thức nấu ăn mới, các hướng dẫn ẩm thực, và các ấn bản đặc biệt của sách điện tử.
          </p>
        </>
      ),
    },
    {
      id: "account-management",
      title: "Tạo Tài Khoản & Quản Lý Tài Khoản",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>H: Làm thế nào để tôi tạo tài khoản?</strong>
            <br />
            Đ: Sau khi đăng ký, bạn sẽ nhận được một email chào mừng với liên kết để thiết lập tài khoản của mình. Làm theo hướng dẫn để tạo tên người dùng và mật khẩu, giúp bạn dễ dàng truy cập vào tất cả các giao dịch mua của mình.
          </p>
          <p className="text-lg">
            <strong>H: Làm thế nào để tôi cập nhật thông tin cá nhân?</strong>
            <br />
            Đ: Đăng nhập vào bảng điều khiển tài khoản của bạn, nơi bạn có thể cập nhật email, mật khẩu hoặc các thông tin tài khoản khác. Nếu gặp vấn đề, bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi.
          </p>
        </>
      ),
    },
    {
      id: "purchase",
      title: "Mua Công Thức Nấu Ăn và Sách Nấu Ăn",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>H: Làm thế nào để tôi mua các công thức nấu ăn hoặc sách điện tử riêng lẻ?</strong>
            <br />
            Đ: Chỉ cần duyệt qua cửa hàng của chúng tôi, chọn các mục bạn quan tâm và thêm vào giỏ hàng. Bạn có thể mua chúng riêng lẻ mà không cần đăng ký, tuy nhiên, các thành viên sẽ nhận được giảm giá đặc biệt.
          </p>
          <p className="text-lg">
            <strong>H: Các bạn có cung cấp thẻ quà tặng không?</strong>
            <br />
            Đ: Có, bạn có thể mua thẻ quà tặng sách điện tử hoặc công thức nấu ăn cho bạn bè và gia đình. Thông điệp quà tặng cá nhân hóa có sẵn khi thanh toán.
          </p>
        </>
      ),
    },
    {
      id: "billing",
      title: "Thanh Toán & Hoàn Tiền",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>H: Các phương thức thanh toán nào được chấp nhận?</strong>
            <br />
            Đ: Chúng tôi chấp nhận các thẻ tín dụng lớn, PayPal và Google Pay. Các gói đăng ký sẽ được tự động thanh toán dựa trên chu kỳ thanh toán của bạn.
          </p>
          <p className="text-lg">
            <strong>H: Chính sách hoàn tiền hoạt động như thế nào?</strong>
            <br />
            Đ: Hoàn tiền có thể có sẵn cho các trường hợp cụ thể và sẽ được xử lý trong vòng 7-10 ngày làm việc. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng nếu bạn tin rằng bạn đủ điều kiện nhận hoàn tiền.
          </p>
        </>
      ),
    },
    {
      id: "app-access",
      title: "Truy Cập Ứng Dụng",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>H: Tôi có thể truy cập các giao dịch mua của mình qua ứng dụng không?</strong>
            <br />
            Đ: Có, người đăng ký có thể truy cập các công thức nấu ăn và sách điện tử trực tiếp qua ứng dụng của chúng tôi. Chỉ cần đăng nhập bằng email liên kết với tài khoản của bạn.
          </p>
          <p className="text-lg">
            <strong>H: Ứng dụng có sẵn trên tất cả các thiết bị không?</strong>
            <br />
            Đ: Ứng dụng của chúng tôi hiện có sẵn trên các thiết bị iOS và Android. Tải xuống từ Apple App Store hoặc Google Play.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Liên Hệ Với Chúng Tôi",
      content: (
        <>
          <p className="text-lg">
            Nếu bạn có câu hỏi thêm, vui lòng liên hệ với chúng tôi:
          </p>
          <ul className="text-lg mt-4 space-y-2">
            <li><strong>Email:</strong> support@recipehub.com</li>
            <li><strong>Điện thoại:</strong> (555) 123-4567</li>
            <li><strong>Giờ hỗ trợ:</strong> Thứ Hai đến Thứ Sáu, từ 9 sáng đến 5 chiều</li>
          </ul>
        </>
      ),
    }
  ];


  // Khởi tạo openSections là một mảng rỗng, chỉ mở khi người dùng nhấp vào
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (sectionId) => {
    setOpenSections((prevOpenSections) =>
      prevOpenSections.includes(sectionId)
        ? prevOpenSections.filter((id) => id !== sectionId)
        : [...prevOpenSections, sectionId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-250 flex flex-col justify-center relative overflow-hidden">
      <img
        src="https://play.tailwindcss.com/img/beams.jpg"
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
        width="1920"
      />
      <div className="section-center relative z-10 max-w-5xl p-8 mb-12 mt-24">
        <h1 className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-center text-orange-900 bg-orange-50 rounded-full">
          Câu hỏi thường gặp: Thị trường công thức nấu ăn và sách nấu ăn
        </h1>
        <p className="font-heading text-5xl xs:text-6xl md:text-7xl font-bold">
          Bạn hỏi? Chúng tôi <span className="font-serif italic">trả lời.</span>
        </p>
        {/* Section Navigation */}
        <nav className="mb-12 mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Chuyển đến mục:</h2>
          <ul className="text-lg space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-blue-600 hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Accordion Sections */}
        {sections.map((section) => (
          <div
            key={section.id}
            className={`accordion border border-solid border-gray-300 p-4 rounded-xl mb-8 ${openSections.includes(section.id) ? "bg-indigo-50 border-indigo-600" : ""
              }`}
          >
            <button
              className="accordion-toggle inline-flex items-center justify-between text-left text-lg font-normal leading-8 text-gray-900 w-full transition duration-500 "
              onClick={() => toggleSection(section.id)}
              aria-expanded={openSections.includes(section.id)}
            >
              <h5>{section.title}</h5>
              <svg
                className={`w-6 h-6 text-gray-900 transition duration-500 ${openSections.includes(section.id) ? "hidden" : "block"}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 12H18M12 18V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <svg
                className={`w-6 h-6 text-gray-900 transition duration-500 ${openSections.includes(section.id) ? "block" : "hidden"}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 12H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            {openSections.includes(section.id) && (
              <div className="accordion-content w-full overflow-hidden mt-4">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
