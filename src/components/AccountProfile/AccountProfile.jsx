import { React, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import Tesseract from "tesseract.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn gửi thông tin không?")) return;
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
      toast.success("Account Profile đã được thêm thành công");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
        setIsLoading(false);
      } else {
        toast.error("Lỗi khi gửi hồ sơ.");
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

    // Clear error message if user selects a valid file
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
          setErrors((prevErrors) => ({
            ...prevErrors,
            frontIDCard: "Không tìm thấy ngày sinh trong ảnh.",
          }));
        }

        // Kiểm tra nếu thiếu số căn cước hoặc ngày sinh
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

  // Handle delete for each image
  const handleDeleteImage = (field, setFile, setPreview) => {
    setFile(null);
    setPreview(null);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  return (
    <>
      <ToastContainer />
      <Container className="my-5">
        <h2 className="text-center mb-4">Cập nhật hồ sơ</h2>
        <Form>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="frontIDCard">
                <Form.Label>Ảnh căn cước mặt trước</Form.Label>
                <Form.Control
                  type="file"
                  name="frontIDCard"
                  onChange={handlefrontIDCardFileChange}
                  disabled={isLoading}
                />
                {errors.frontIDCard && (
                  <Form.Text className="text-danger">
                    {errors.frontIDCard}
                  </Form.Text>
                )}
                {frontIDCardPreview && (
                  <div>
                    <img
                      src={frontIDCardPreview}
                      alt="Front ID Preview"
                      className="mt-2"
                      style={{ width: "100%", maxWidth: "200px" }}
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
                      className="mt-2"
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="backIDCard">
                <Form.Label>Ảnh căn cước mặt sau</Form.Label>
                <Form.Control
                  type="file"
                  name="backIDCard"
                  onChange={(e) =>
                    handleFileChange(e, setBackIDCard, setBackIDCardPreview)
                  }
                  disabled={isLoading}
                />
                {errors.backIDCard && (
                  <Form.Text className="text-danger">
                    {errors.backIDCard}
                  </Form.Text>
                )}
                {backIDCardPreview && (
                  <div>
                    <img
                      src={backIDCardPreview}
                      alt="Back ID Preview"
                      className="mt-2"
                      style={{ width: "100%", maxWidth: "200px" }}
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
                      className="mt-2"
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="dateOfBirth">
                <Form.Label>Ngày sinh</Form.Label>
                <DatePicker
                  selected={dateOfBirth}
                  onChange={(date) => setDateOfBirth(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  disabled={isLoading}
                />
                {errors.dateOfBirth && (
                  <Form.Text className="text-danger">
                    {errors.dateOfBirth}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="portrait">
                <Form.Label>Ảnh chân dung</Form.Label>
                <Form.Control
                  type="file"
                  name="portrait"
                  onChange={(e) =>
                    handleFileChange(e, setPortrait, setPortraitPreview)
                  }
                  disabled={isLoading}
                />
                {errors.portrait && (
                  <Form.Text className="text-danger">
                    {errors.portrait}
                  </Form.Text>
                )}
                {portraitPreview && (
                  <div>
                    <img
                      src={portraitPreview}
                      alt="Portrait Preview"
                      className="mt-2"
                      style={{ width: "100%", maxWidth: "200px" }}
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
                      className="mt-2"
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="bankAccountQR">
                <Form.Label>Mã QR tài khoản ngân hàng</Form.Label>
                <Form.Control
                  type="file"
                  name="bankAccountQR"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      setBankAccountQR,
                      setBankAccountQRPreview
                    )
                  }
                  disabled={isLoading}
                />
                {errors.bankAccountQR && (
                  <Form.Text className="text-danger">
                    {errors.bankAccountQR}
                  </Form.Text>
                )}
                {bankAccountQRPreview && (
                  <div>
                    <img
                      src={bankAccountQRPreview}
                      alt="Bank Account QR Preview"
                      className="mt-2"
                      style={{ width: "100%", maxWidth: "200px" }}
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
                      className="mt-2"
                      disabled={isLoading}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="idCardNumber">
                <Form.Label>Số căn cước</Form.Label>
                <Form.Control
                  type="text"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" onClick={handleSaveAccountProfile}>
            Lưu
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default AccountProfile;