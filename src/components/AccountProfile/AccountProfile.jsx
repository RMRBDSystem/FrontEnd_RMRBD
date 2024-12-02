import { React, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import Tesseract from "tesseract.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const AccountProfile = () => {
  const [accountID, setAccountID] = useState();
  const [portrait, setPortrait] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState(null);
  const [bankAccountQR, setBankAccountQR] = useState(null);
  const [bankAccountQRPreview, setBankAccountQRPreview] = useState(null);
  const [frontIDCard, setFrontIDCard] = useState(null);
  const [frontIDCardPreview, setFrontIDCardPreview] = useState(null);
  const [backIDCard, setBackIDCard] = useState(null);
  const [backIDCardPreview, setBackIDCardPreview] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [idCardNumber, setIdCardNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    portrait: "",
    frontIDCard: "",
    backIDCard: "",
    bankAccountQR: "",
    idCardNumber: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const storedUserId = Cookies.get("UserId");
    if (storedUserId) {
      setAccountID(storedUserId);
    }
  }, []);

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
        title: 'Lỗi',
        text: 'Vui lòng điền đầy đủ thông tin.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const confirmSave = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn gửi thông tin không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });

    if (!confirmSave.isConfirmed) return;

    const url = `https://rmrbdapi.somee.com/odata/AccountProfile/${accountID}`;
    const formData = new FormData();
    formData.append("portrait", portrait);
    formData.append("bankAccountQR", bankAccountQR);
    formData.append("frontIDCard", frontIDCard);
    formData.append("backIDCard", backIDCard);
    formData.append("dateOfBirth", dateOfBirth.toISOString().split("T")[0]);
    formData.append("iDCardNumber", idCardNumber);

    setIsLoading(true);
    try {
      const result = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Token: "123-abc",
        },
      });
      console.log("API Response:", result.data);
      clear();
      Swal.fire({
        title: 'Thành công',
        text: 'Đơn đăng kí của bạn đã được gửi thành công!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire({
          title: 'Lỗi',
          text: error.response.data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setIsLoading(false);
      } else {
        Swal.fire({
          title: 'Lỗi',
          text: 'Lỗi khi gửi hồ sơ.',
          icon: 'error',
          confirmButtonText: 'OK'
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
    if (file) {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    }
  };

  const handlefrontIDCardFileChange = (e) => {
    const file = e.target.files[0];
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
        const idMatch = text.match(/\b\d{10,12}\b/);
        if (idMatch) {
          setIdCardNumber(idMatch[0]);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            frontIDCard: "Không tìm thấy số căn cước trong ảnh.",
          }));
        }

        const dateMatch = text.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);
        if (dateMatch) {
          const [_, day, month, year] = dateMatch;
          const date = new Date(`${year}-${month}-${day}`);
          setDateOfBirth(date);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            frontIDCard: "Không tìm thấy ngày sinh trong ảnh.",
          }));
        }

        if (!idMatch && !dateMatch) {
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

  const handleDeleteImage = (field, setFile, setPreview) => {
    setFile(null);
    setPreview(null);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  return (
    <section className="section-center max-w-4xl bg-white rounded shadow-lg my-4">
      <ToastContainer />
      <Container className="items-center font-medium text-xl">
        <h2 className="section-title">Thông tin tài khoản người bán</h2>
        <Form>
          <Row className="mb-4">
            <Form.Label>Thêm ảnh CCCD mặt trước</Form.Label>
            {!frontIDCardPreview ? (
              <Form.Group controlId="frontIDCard">
                <label
                  htmlFor="fileInput"
                  className="block cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:bg-gray-300 hover:border-gray-600"
                >
                  <h1 className="material-icons text-6xl">cloud_upload</h1>
                  <p className="text-lg">Ảnh CCCD Mặt Trước</p>
                </label>
                <input
                  type="file"
                  id="fileInput"
                  name="frontIDCard"
                  multiple
                  accept="image/*"
                  onChange={handlefrontIDCardFileChange}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                />
                {errors.frontIDCard && (
                  <Form.Text className="text-danger mt-2">{errors.frontIDCard}</Form.Text>
                )}
              </Form.Group>
            ) : (
              <div className="mt-3">
                <img
                  src={frontIDCardPreview}
                  alt="Front ID Preview"
                  className="img-fluid rounded"
                  style={{ maxWidth: "200px" }}
                />
                <div className="mt-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteImage("frontIDCard", setFrontIDCard, setFrontIDCardPreview)}
                    disabled={isLoading}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              </div>
            )}
          </Row>
          <Row className="mb-4">
            <Form.Label>Số căn cước công dân</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập số căn cước công dân"
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value)}
              disabled={isLoading}
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
              disabled={isLoading}
              className="form-control"
            />
            {errors.dateOfBirth && (
              <Form.Text className="text-danger">{errors.dateOfBirth}</Form.Text>
            )}
          </Row>
          <Row className="mb-4">
            <Form.Label>Ảnh CCCD mặt sau</Form.Label>
            {!backIDCardPreview ? (
              <Form.Group controlId="backIDCard">
                <label
                  htmlFor="backIDCardInput"
                  className="block cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:bg-gray-300 hover:border-gray-600"
                >
                  <h1 className="material-icons text-6xl">cloud_upload</h1>
                  <p className="text-lg">Ảnh CCCD Mặt Sau</p>
                </label>
                <input
                  type="file"
                  id="backIDCardInput"
                  name="backIDCard"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setBackIDCard, setBackIDCardPreview)}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                />
                {errors.backIDCard && (
                  <Form.Text className="text-danger mt-2">{errors.backIDCard}</Form.Text>
                )}
              </Form.Group>
            ) : (
              <div className="mt-3">
                <img
                  src={backIDCardPreview}
                  alt="Back ID Preview"
                  className="img-fluid rounded"
                  style={{ maxWidth: "200px" }}
                />
                <div className="mt-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteImage("backIDCard", setBackIDCard, setBackIDCardPreview)}
                    disabled={isLoading}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              </div>
            )}
          </Row>
          <Row className="mb-4">
            <Form.Label>Ảnh chân dung</Form.Label>
            {!portraitPreview ? (
              <Form.Group controlId="portrait">
                <label
                  htmlFor="portraitInput"
                  className="block cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:bg-gray-300 hover:border-gray-600"
                >
                  <h1 className="material-icons text-6xl">cloud_upload</h1>
                  <p className="text-lg">Ảnh chân dung</p>
                </label>
                <input
                  type="file"
                  id="portraitInput"
                  name="portrait"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setPortrait, setPortraitPreview)}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                />
                {errors.portrait && (
                  <Form.Text className="text-danger mt-2">{errors.portrait}</Form.Text>
                )}
              </Form.Group>
            ) : (
              <div className="mt-3">
                <img
                  src={portraitPreview}
                  alt="Portrait Preview"
                  className="img-fluid rounded"
                  style={{ maxWidth: "200px" }}
                />
                <div className="mt-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteImage("portrait", setPortrait, setPortraitPreview)}
                    disabled={isLoading}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              </div>
            )}
          </Row>



          <Row className="mb-4">
            <Form.Label>Mã QR tài khoản ngân hàng</Form.Label>
            {!bankAccountQRPreview ? (
              <Form.Group controlId="bankAccountQR">
                <label
                  htmlFor="bankAccountQRInput"
                  className="block cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:bg-gray-300 hover:border-gray-600"
                >
                  <h1 className="material-icons text-6xl">cloud_upload</h1>
                  <p className="text-lg">Mã QR tài khoản ngân hàng</p>
                </label>
                <input
                  type="file"
                  id="bankAccountQRInput"
                  name="bankAccountQR"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setBankAccountQR, setBankAccountQRPreview)}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                />
                {errors.bankAccountQR && (
                  <Form.Text className="text-danger mt-2">{errors.bankAccountQR}</Form.Text>
                )}
              </Form.Group>
            ) : (
              <div className="mt-3">
                <img
                  src={bankAccountQRPreview}
                  alt="Bank Account QR Preview"
                  className="img-fluid rounded"
                  style={{ maxWidth: "200px" }}
                />
                <div className="mt-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteImage("bankAccountQR", setBankAccountQR, setBankAccountQRPreview)}
                    disabled={isLoading}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              </div>
            )}
          </Row>
            <Button className="font-semibold" variant="primary" onClick={handleSaveAccountProfile} disabled={isLoading}>
              {isLoading ? 'Đang gửi...' : 'Gửi thông tin'}
            </Button>
        </Form>
      </Container>
    </section>
  );
};

export default AccountProfile;
