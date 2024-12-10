import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import Tesseract from "tesseract.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrashAlt, FaCloudUploadAlt } from "react-icons/fa";
import { useSocket } from "../../App";
import { getAccountByRoleId } from "../services/AccountService";
import { createNotification } from "../services/NotificationService";
import { updateToSeller } from "../services/CustomerService/api";

const UpdateToSeller = () => {
  const [accountID, setAccountID] = useState();
  const [portrait, setPortrait] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState(null);
  const [bankAccountQR, setBankAccountQR] = useState(null);
  const [bankAccountQRPreview, setBankAccountQRPreview] = useState(null);
  const [frontIDCard, setFrontIDCard] = useState(null);
  const [frontIDCardPreview, setFrontIDCardPreview] = useState(null);
  const [backIDCard, setBackIDCard] = useState(null);
  const [backIDCardPreview, setBackIDCardPreview] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [idCardNumber, setIdCardNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // State lưu lỗi cho từng trường
  const [errors, setErrors] = useState({
    portrait: "",
    frontIDCard: "",
    backIDCard: "",
    bankAccountQR: "",
    idCardNumber: "",
    dateOfBirth: "",
  });
  const { socket, accountOnline } = useSocket();
  const [listModer, setListModer] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const storedUserId = Cookies.get("UserId");
        if (storedUserId) {
          setAccountID(storedUserId);
        }
        const stored = await getAccountByRoleId();
        const extractedModeratornames = stored.map((account) => ({
          Id: account.accountId,
          userName: account.userName,
        }));
        setListModer(extractedModeratornames);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReport();
  }, []);
  // Xử lý post thông tin lên db cho bảng AccountProfile
  const handleSaveAccountProfile = async () => {
    let formErrors = {};
    if (!portrait) formErrors.portrait = "Vui lòng chọn ảnh chân dung.";
    if (!frontIDCard)
      formErrors.frontIDCard = "Vui lòng chọn ảnh căn cước mặt trước.";
    if (!backIDCard)
      formErrors.backIDCard = "Vui lòng chọn ảnh căn cước mặt sau.";
    if (!bankAccountQR)
      formErrors.bankAccountQR = "Vui lòng chọn mã QR tài khoản ngân hàng.";
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra!",
        text: "Vui lòng điền đầy đủ thông tin.",
      });
      return;
    }
    // Cửa sổ confirm cho người dùng
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn gửi thông tin không?",
      text: "Thông tin bạn đã điền sẽ được gửi đi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, gửi thông tin",
      cancelButtonText: "Hủy",
    });
    // Trả về nếu người dùng cancel
    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append("portrait", portrait);
    formData.append("bankAccountQR", bankAccountQR);
    formData.append("frontIDCard", frontIDCard);
    formData.append("backIDCard", backIDCard);
    formData.append("dateOfBirth", dateOfBirth.toISOString().split("T")[0]);
    formData.append("iDCardNumber", idCardNumber);

    setIsLoading(true);

    try {
      const result = await updateToSeller(accountID, formData);
      console.log("API Response:", result.data);
      clear();
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Account Profile đã được thêm thành công.",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Bạn đã gửi hồ sơ rồi, vui lòng chờ duyệt",
        });
        setIsLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi gửi hồ sơ.",
          text: "Đã xảy ra sự cố khi gửi hồ sơ.",
        });
        setIsLoading(false);
      }
    }
  };

  const clear = () => {
    setPortrait(null);
    setPortraitPreview(null);
    setFrontIDCard(null);
    setFrontIDCardPreview(null);
    setBackIDCard(null);
    setBackIDCardPreview(null);
    setDateOfBirth(new Date());
    setIdCardNumber("");
    setBankAccountQR(null);
    setBankAccountQRPreview(null);
    setErrors({});
    setIsLoading(false);
  };

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
    // Khi người dùng chọn ảnh, ẩn thông báo lỗi nếu có
    if (file) {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    }
  };

  const handlefrontIDCardFileChange = (e) => {
    const file = e.target.files[0];

    // Xóa thông báo lỗi nếu có tệp hợp lệ
    if (file) {
      setErrors((prevErrors) => ({ ...prevErrors, frontIDCard: "" }));
    }

    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        frontIDCard: "Vui lòng chọn một bức ảnh khác",
      }));
      return;
    }

    setFrontIDCard(file);

    // Tạo URL cho ảnh vừa chọn để hiển thị trước (preview)
    setFrontIDCardPreview(URL.createObjectURL(file));

    // Sử dụng thư viện Tesseract.js để nhận diện văn bản từ ảnh
    Tesseract.recognize(file, "vie", {
      // In ra thông tin tiến trình nhận diện văn bản
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        // Kiểm tra số căn cước
        const idMatch = text.match(/\b\d{10,12}\b/);
        if (idMatch) {
          setIdCardNumber(idMatch[0]);
        } else {
          setIdCardNumber("");
          setErrors((prevErrors) => ({
            ...prevErrors,
            frontIDCard: "Không tìm thấy số căn cước trong ảnh.",
          }));
        }

        // Kiểm tra ngày sinh (DD/MM/YYYY)
        const dateMatch = text.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);
        if (dateMatch) {
          // Nếu có, lưu ngày sinh vào state dưới dạng đối tượng Date
          const [_, day, month, year] = dateMatch;
          const date = new Date(`${year}-${month}-${day}`);
          setDateOfBirth(date);
        } else {
          setDateOfBirth(null);
          setErrors((prevErrors) => ({
            ...prevErrors,
            frontIDCard: "Không tìm thấy ngày sinh trong ảnh.",
          }));
        }

        // Kiểm tra nếu thiếu số căn cước hoặc ngày sinh
        if (!idMatch && !dateMatch) {
          setIdCardNumber("");
          setDateOfBirth(null);
          setErrors((prevErrors) => ({
            ...prevErrors,
            frontIDCard:
              "Ảnh không chứa thông tin yêu cầu (số căn cước và ngày sinh).",
          }));
        }
      })
      .catch((err) => {
        // Xử lý lỗi nếu Tesseract nhận diện văn bản thất bại
        console.error("OCR Error: ", err);
        setErrors((prevErrors) => ({
          ...prevErrors,
          frontIDCard: "Lỗi khi nhận diện văn bản từ ảnh.",
        }));
      });
  };

  // Xóa ảnh
  const handleDeleteImage = (field, setFile, setPreview) => {
    setFile(null);
    setPreview(null);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    if (field === "frontIDCard") {
      setIdCardNumber("");
      setDateOfBirth(null);
    }
  };

  const handleNotification = (text) => {
    for (let i = 0; i < listModer.length; i++) {
      // Gửi thông báo qua socket
      socket.emit("sendNotification", {
        senderName: accountOnline,
        receiverName: listModer[i].userName,
        content: text,
      });

      // Tạo thông báo mới
      const newNotificationData = {
        accountId: listModer[i].Id,
        content: text,
        date: new Date().toISOString(),
        status: 1,
      };

      // Gọi hàm tạo thông báo (không cần await nếu bạn không cần phải chờ)
      createNotification(newNotificationData);
    }
  };

  return (
    <Container className="my-5 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 flex items-center">
        <span className="text-orange-500 mr-2 text-5xl">+</span> Trở thành người
        bán hàng
      </h1>
      <p className="text-gray-600 mb-8">
        Chúng tôi giúp bạn kết nối với hàng nghìn độc giả và tạo ra cơ hội phát
        triển không giới hạn!
      </p>
      <Form>
        {/* Front ID Card */}
        <Row className="mb-6">
          <Col>
            <Form.Group controlId="frontIDCard">
              <Form.Label className="text-lg">
                Ảnh căn cước mặt trước
              </Form.Label>

              {/* Hidden file input */}
              <input
                type="file"
                name="frontIDCard"
                id="frontIDCard"
                onChange={handlefrontIDCardFileChange}
                disabled={isLoading}
                className="hidden"
                accept="image/*"
              />

              {/* Cloud icon trigger with flexbox centering */}
              <div
                onClick={() => document.getElementById("frontIDCard").click()}
                className="cursor-pointer flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {/* Cloud Icon */}
                <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
                {/* Text below the icon */}
                <p className="text-gray-600">Chọn ảnh</p>
              </div>

              {errors.frontIDCard && (
                <Form.Text className="text-red-500">
                  {errors.frontIDCard}
                </Form.Text>
              )}

              {/* Image preview */}
              {frontIDCardPreview && (
                <div className="mt-2">
                  <img
                    src={frontIDCardPreview}
                    alt="Front ID Preview"
                    className="w-full max-w-[200px] rounded-md shadow-lg"
                  />
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteImage(
                        "frontIDCard",
                        setFrontIDCard,
                        setFrontIDCardPreview
                      )
                    }
                    disabled={isLoading}
                    className="mt-2 inline-flex items-center bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-md"
                  >
                    <FaTrashAlt className="mr-2" /> Xóa ảnh
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        {/* Birthday and ID Card Number */}
        <Row className="mb-4">
          <Form.Label>Số căn cước công dân</Form.Label>
          <Form.Control
            type="text"
            value={idCardNumber}
            onChange={(e) => setIdCardNumber(e.target.value)}
            disabled={true}
            isInvalid={!!errors.idCardNumber}
          />
          {errors.idCardNumber && (
            <Form.Text className="text-danger">{errors.idCardNumber}</Form.Text>
          )}
        </Row>

        <Row className="mb-4">
          <Form.Label>Ngày sinh</Form.Label>
          <DatePicker
            selected={dateOfBirth}
            onChange={(date) => setDateOfBirth(date)}
            dateFormat="dd/MM/yyyy"
            disabled={true}
            className="form-control"
          />
          {errors.dateOfBirth && (
            <Form.Text className="text-danger">{errors.dateOfBirth}</Form.Text>
          )}
        </Row>

        {/* Back ID Card */}
        <Row className="mb-6">
          <Col>
            <Form.Group controlId="backIDCard">
              <Form.Label className="text-lg">Ảnh căn cước mặt sau</Form.Label>

              {/* Hidden file input */}
              <input
                type="file"
                name="backIDCard"
                id="backIDCard"
                onChange={(e) =>
                  handleFileChange(e, setBackIDCard, setBackIDCardPreview)
                }
                disabled={isLoading}
                className="hidden"
                accept="image/*"
              />

              {/* Cloud icon trigger with flexbox centering */}
              <div
                onClick={() => document.getElementById("backIDCard").click()}
                className="cursor-pointer flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {/* Cloud Icon */}
                <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
                {/* Text below the icon */}
                <p className="text-gray-600">Chọn ảnh</p>
              </div>

              {errors.backIDCard && (
                <Form.Text className="text-red-500">
                  {errors.backIDCard}
                </Form.Text>
              )}

              {/* Image preview */}
              {backIDCardPreview && (
                <div className="mt-2">
                  <img
                    src={backIDCardPreview}
                    alt="Back ID Preview"
                    className="w-full max-w-[200px] rounded-md shadow-lg"
                  />
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteImage(
                        "backIDCard",
                        setBackIDCard,
                        setBackIDCardPreview
                      )
                    }
                    disabled={isLoading}
                    className="mt-2 inline-flex items-center bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-md"
                  >
                    <FaTrashAlt className="mr-2" /> Xóa ảnh
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Portrait Image */}
        <Row className="mb-6">
          <Col>
            <Form.Group controlId="portrait">
              <Form.Label className="text-lg">Ảnh chân dung</Form.Label>

              {/* Hidden file input */}
              <input
                type="file"
                name="portrait"
                id="portrait"
                onChange={(e) =>
                  handleFileChange(e, setPortrait, setPortraitPreview)
                }
                disabled={isLoading}
                className="hidden"
                accept="image/*"
              />

              {/* Cloud icon trigger with flexbox centering */}
              <div
                onClick={() => document.getElementById("portrait").click()}
                className="cursor-pointer flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {/* Cloud Icon */}
                <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
                {/* Text below the icon */}
                <p className="text-gray-600">Chọn ảnh</p>
              </div>

              {errors.portrait && (
                <Form.Text className="text-red-500">
                  {errors.portrait}
                </Form.Text>
              )}

              {/* Image preview */}
              {portraitPreview && (
                <div className="mt-2">
                  <img
                    src={portraitPreview}
                    alt="Portrait Preview"
                    className="w-full max-w-[200px] rounded-md shadow-lg"
                  />
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteImage(
                        "portrait",
                        setPortrait,
                        setPortraitPreview
                      )
                    }
                    disabled={isLoading}
                    className="mt-2 inline-flex items-center bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-md"
                  >
                    <FaTrashAlt className="mr-2" /> Xóa ảnh
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Bank Account QR Code */}
        <Row className="mb-6">
          <Col>
            <Form.Group controlId="bankAccountQR">
              <Form.Label className="text-lg">
                Mã QR tài khoản ngân hàng
              </Form.Label>

              {/* Hidden file input */}
              <input
                type="file"
                name="bankAccountQR"
                id="bankAccountQR"
                onChange={(e) =>
                  handleFileChange(e, setBankAccountQR, setBankAccountQRPreview)
                }
                disabled={isLoading}
                className="hidden"
                accept="image/*"
              />

              {/* Cloud icon trigger with flexbox centering */}
              <div
                onClick={() => document.getElementById("bankAccountQR").click()}
                className="cursor-pointer flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {/* Cloud Icon */}
                <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
                {/* Text below the icon */}
                <p className="text-gray-600">Chọn mã QR</p>
              </div>

              {errors.bankAccountQR && (
                <Form.Text className="text-red-500">
                  {errors.bankAccountQR}
                </Form.Text>
              )}

              {/* Image preview */}
              {bankAccountQRPreview && (
                <div className="mt-2">
                  <img
                    src={bankAccountQRPreview}
                    alt="Bank Account QR Preview"
                    className="w-full max-w-[200px] rounded-md shadow-lg"
                  />
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteImage(
                        "bankAccountQR",
                        setBankAccountQR,
                        setBankAccountQRPreview
                      )
                    }
                    disabled={isLoading}
                    className="mt-2 inline-flex items-center bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-md"
                  >
                    <FaTrashAlt className="mr-2" /> Xóa ảnh
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Save Button */}
        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="primary"
            onClick={() => {
              handleNotification(
                `${accountOnline} đã gửi thông tin đăng kí bán hàng về hệ thống`
              );
              handleSaveAccountProfile();
            }}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? <span>Đang gửi...</span> : <span>Gửi thông tin</span>}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UpdateToSeller;
