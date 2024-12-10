import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Tesseract from "tesseract.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { FaTrashAlt, FaCloudUploadAlt } from "react-icons/fa";
import {
  getAccountProfile,
  updateToSellerResubmit,
  convertURLToFile,
} from "../services/CustomerService/api";

const EditRoleUpdated = () => {
  const { accountID } = useParams();
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
  const [accountProfile, setAccountProfileData] = useState({});

  // State lưu lỗi cho từng trường
  const [errors, setErrors] = useState({
    portrait: "",
    frontIDCard: "",
    backIDCard: "",
    bankAccountQR: "",
    idCardNumber: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    // Định nghĩa một hàm bất đồng bộ để lấy dữ liệu tài khoản
    const fetchData = async () => {
      try {
        // Gọi API để lấy thông tin tài khoản theo `accountID`
        const data = await getAccountProfile(accountID);
        setAccountProfileData(data);
        setFrontIDCardPreview(data.frontIdcard);
        setBackIDCardPreview(data.backIdcard);
        setPortraitPreview(data.portrait);
        setBankAccountQRPreview(data.bankAccountQR);

        // Nếu có ảnh mặt trước của thẻ ID (frontIdcard), chuyển URL thành file và xử lý
        if (data.frontIdcard) {
          const file = await convertURLToFile(
            data.frontIdcard,
            "frontIdcard.jpg"
          );

           // Gọi hàm xử lý file ảnh mặt trước để lấy số CCCD và ngày sinh
          handlefrontIDCardFileChange({ target: { files: [file] } });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.message,
        });
      }
    };
    fetchData();
  }, [accountID]);

  const handleSaveAccountProfile = async () => {
    let formErrors = {};

    // Kiểm tra xem các trường dữ liệu đã được điền đầy đủ chưa
    if (!portraitPreview) formErrors.portrait = "Vui lòng chọn ảnh chân dung.";
    if (!frontIDCardPreview)
      formErrors.frontIDCard = "Vui lòng chọn ảnh căn cước mặt trước.";
    if (!backIDCardPreview)
      formErrors.backIDCard = "Vui lòng chọn ảnh căn cước mặt sau.";
    if (!bankAccountQRPreview)
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

    if (!result.isConfirmed) return;

    const formData = new FormData();
    // Chuyển ảnh thành file
    if (portraitPreview && typeof portraitPreview === "string") {
      const file = await convertURLToFile(portraitPreview, "portrait.jpg");
      formData.append("portrait", file);
    } else {
      formData.append("portrait", portrait);
    }

    if (frontIDCardPreview && typeof frontIDCardPreview === "string") {
      const file = await convertURLToFile(
        frontIDCardPreview,
        "frontIdcard.jpg"
      );
      formData.append("frontIDCard", file);
    } else {
      formData.append("frontIDCard", frontIDCard);
    }

    if (backIDCardPreview && typeof backIDCardPreview === "string") {
      const file = await convertURLToFile(backIDCardPreview, "backIdcard.jpg");
      formData.append("backIDCard", file);
    } else {
      formData.append("backIDCard", backIDCard);
    }

    if (bankAccountQRPreview && typeof bankAccountQRPreview === "string") {
      const file = await convertURLToFile(
        bankAccountQRPreview,
        "bankAccountQR.jpg"
      );
      formData.append("bankAccountQR", file);
    } else {
      formData.append("bankAccountQR", bankAccountQR);
    }

    formData.append("dateOfBirth", dateOfBirth.toISOString().split("T")[0]);
    formData.append("iDCardNumber", idCardNumber);


    try {
      setIsLoading(true);

      await updateToSellerResubmit(accountID, formData);
      clear();
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Thông tin tài khoản đã được thêm thành công.",
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Lỗi khi gửi hồ sơ.",
        text: "Đã xảy ra sự cố khi gửi hồ sơ.",
      });
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

    // Xóa lỗi nều người dùng chọn một bức ảnh valid
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
    setFrontIDCardPreview(URL.createObjectURL(file));

    Tesseract.recognize(file, "vie", {
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
        console.error("OCR Error: ", err);
        setErrors((prevErrors) => ({
          ...prevErrors,
          frontIDCard: "Lỗi khi nhận diện văn bản từ ảnh.",
        }));
      });
  };

  // Handle delete for each image
  const handleDeleteImage = (field, setFile, setPreview) => {
    setFile(null);
    setPreview(null);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    if(field ==="frontIDCard") {
      setIdCardNumber("");
      setDateOfBirth(null);
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
            onClick={handleSaveAccountProfile}
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

export default EditRoleUpdated;
