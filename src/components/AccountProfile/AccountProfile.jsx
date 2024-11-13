import { React, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Đảm bảo toast được import đúng
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";

const AccountProfile = () => {
  const [accountID, setaccountID] = useState();
  const [portrait, setPortrait] = useState(null);
  const [bankAccountQR, setBankAccountQR] = useState(null);
  const [frontIDCard, setFrontIDCard] = useState(null);
  const [backIDCard, setBackIDCard] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState();
  const [idCardNumber, setIdCardNumber] = useState();

  useEffect(() => {
    const storedUserId = Cookies.get("UserId");
    console.log("Stored UserId:", storedUserId);
    if (storedUserId) {
      setaccountID(storedUserId);
    }
  }, []);

  const handleSaveAccoutProfile = async () => {
    const url = `https://rmrbdapi.somee.com/odata/AccountProfile/${accountID}`;
    const formData = new FormData();
    formData.append("portrait", portrait);
    formData.append("bankAccountQR", bankAccountQR);
    formData.append("frontIDCard", frontIDCard);
    formData.append("backIDCard", backIDCard);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("iDCardNumber", idCardNumber);
    console.log("Account Profile data", formData);

    try {
      const result = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Token: "123-abc",
        },
      });
      console.log("Response from server", result);
      clear();
      toast.success("Account Profile has been added successfully"); 
    } catch (error) {
      if (error.response && error.response.data) {
        
        toast.error(error.response.data.message); 
      } else {
        
        toast.error("Error submitting profile.");
      }
    }
  };

  const clear = () => {
    setPortrait(null);
    setFrontIDCard(null);
    setBackIDCard(null);
    setDateOfBirth("");
    setIdCardNumber("");
    setBankAccountQR(null);
  };

  const handleFileChange = (e) => {
    setPortrait(e.target.files[0]);
  };
  const handleFileChange2 = (e) => {
    setBankAccountQR(e.target.files[0]);
  };

  const handlebacklIDCardFileChange = (e) => {
    setBackIDCard(e.target.files[0]);
  };

  const handlefrontIDCardFileChange = (e) => {
    setFrontIDCard(e.target.files[0]);
  };
  return (
    <>
      <ToastContainer />
      <Container className="my-5">
        <h2 className="text-center mb-4">Update Profile</h2>
        <Form>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="frontIDCard">
                <Form.Label>Front ID Card</Form.Label>
                <Form.Control type="file" onChange={handlefrontIDCardFileChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="backlIDCard">
                <Form.Label>Back ID Card</Form.Label>
                <Form.Control type="file" onChange={handlebacklIDCardFileChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="portrait">
                <Form.Label>Portrait</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="bankAccountQR">
                <Form.Label>Bank Account QR</Form.Label>
                <Form.Control type="file" onChange={handleFileChange2} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="idCardNumber">
                <Form.Label>ID Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ID Card Number"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={handleSaveAccoutProfile}
                className="w-100"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default AccountProfile;
