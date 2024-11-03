import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const RecipeList_ToastNotification = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [recipeName, setRecipeName] = useState("");
  const [numberOfService, setNumberOfService] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(0);

  const [editId, setEditId] = useState("");
  const [editRecipeName, setEditRecipeName] = useState("");
  const [editisActive, setEditIsActive] = useState(0);
  const [editNumberOfService, setEditNumberOfService] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      // .get("https://localhost:7220/odata/Recipe") // test locahost
      .get("https://rmrbdapi.somee.com/odata/Recipe")
      .then((result) => {
        console.log("API response:", result.data);
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEdit = (recipeId) => {
    if (!recipeId) {
      console.error("Invalid recipe ID:", recipeId);
      return;
    }
    handleShow();
    axios
      // .get(`https://localhost:7220/odata/Recipe/${recipeId}`) // test locahost
      .get(`https://rmrbdapi.somee.com/odata/Recipe/${recipeId}`)
      .then((result) => {
        setEditId(result.data.recipeId);
        setEditRecipeName(result.data.recipeName);
        setEditIsActive(result.data.status);
        setEditNumberOfService(result.data.numberOfService);
        setEditPrice(result.data.price);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  

  const handleSave = () => {
    // const url = "https://localhost:7220/odata/Recipe"; // test locahost
    const url = "https://rmrbdapi.somee.com/odata/Recipe";
    const data = {
      recipeName: recipeName,
      numberOfService: numberOfService,
      status: status,
      price: price,
    };
    axios.post(url, data).then((result) => {
      getData();
      clear();
      toast.success("Recipe has been added");
    });
  };

  const handleUpdate = () => {
    console.log("editId:", editId);
    // const url = `https://localhost:7220/odata/Recipe/${editId}`; //test localhost
    const url = `https://rmrbdapi.somee.com/odata/Recipe/${editId}`;
    console.log("URL:", url);

    const updatedData = {
      RecipeId: editId,
      RecipeName: editRecipeName,
      Price: editPrice,
      Status: editisActive,
      NumberOfService: editNumberOfService,
    };

    console.log("Updated data:", updatedData); 

    axios
      .put(url, updatedData)
      .then((result) => {
        console.log("Update successful:", result.data); // Log kết quả thành công
        getData(); // Sau khi cập nhật thành công, tải lại dữ liệu từ API
        handleClose(); // Đóng modal
        toast.success("Recipe has been updated"); // Hiển thị thông báo thành công
      })
      .catch((error) => {
        console.error("There was an error updating the recipe!", error); // Log lỗi
      });
  };

  const clear = () => {
    setRecipeName("");
    setStatus(0);
    setNumberOfService("");
    setPrice("");
  };

  const handleActiveChange = (e) => {
    setStatus(e.target.checked ? 1 : 0);
  };
  const handleEditActiveChange = (e) => {
    setEditIsActive(e.target.checked ? 1 : 0);
  };
  return (
    <>
      <ToastContainer />
      <Container>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Recipe Name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Number of Services"
              value={numberOfService}
              onChange={(e) => setNumberOfService(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={status === 1}
              onChange={handleActiveChange}
              value={status}
            />
            <label>ISActive</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={() => handleSave()}>
              Submit
            </button>
          </Col>
        </Row>
      </Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Recipe Name</th>
            <th>Number of Services</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.recipeName}</td>
                    <td>{item.numberOfService}</td>
                    <td>{item.price}</td>
                    <td>{item.status === 1 ? "Active" : "Inactive"}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.recipeId)}
                      >
                        Edit
                      </button>
                      
                    </td>
                  </tr>
                );
              })
            : "Loading ..."}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Recipe Name"
                value={editRecipeName}
                onChange={(e) => setEditRecipeName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={editisActive === 1 ? true : false}
                onChange={(e) => handleEditActiveChange(e)}
                value={editisActive}
              />
              <label>ISActive</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Number of Services"
                value={editNumberOfService}
                onChange={(e) => setEditNumberOfService(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Price"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecipeList_ToastNotification;
