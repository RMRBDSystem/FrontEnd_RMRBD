import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Table from "react-bootstrap/Table";
import { FaBan, FaCheckCircle, FaRegClock } from "react-icons/fa";
import Cookies from "js-cookie";
const AccountProfile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [censorID, setCensorID] = useState();

  useEffect(() => {
    const storedUserId  = Cookies.get("UserId");
    if (storedUserId) {
      setCensorID(storedUserId);
    }
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get("https://rmrbdapi.somee.com/odata/AccountProfile", {
        headers: { "Content-Type": "application/json", token: "123-abc" },
      });

      const accountProfiles = result.data;

      // Lấy dữ liệu của từng Account từ API Account
      const accountDataPromises = accountProfiles.map(async (profile) => {
        try {
          const accountResult = await axios.get(`https://rmrbdapi.somee.com/odata/Account/${profile.accountId}`, {
            headers: { "Content-Type": "application/json", token: "123-abc" },
          });

          return { ...profile, Account: accountResult.data };
        } catch (error) {
          console.error("Error fetching account data:", error);
          return { ...profile, Account: null };
        }
      });

      const updatedData = await Promise.all(accountDataPromises);

      setData(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching account profiles:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (accountId, newStatus) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái không?");
    if (!confirmed) {
      return;
    }

    const updatedItem = data.find((item) => item.accountId === accountId);

    // Cập nhật status ở bảng AccountProfile
    const updateAccountProfileData = { ...updatedItem, status: newStatus , censorId: censorID};

    // Nếu status = 1 thì cập nhật roleId ở bảng Account thành 2
    if (newStatus === 1) {
      updatedItem.Account.roleId = 2;
    }

    const updatePromises = [];

    // 1. Cập nhật status ở bảng AccountProfile
    const accountProfileUpdatePromise = axios.put(
      `https://rmrbdapi.somee.com/odata/AccountProfile/${accountId}`,
      updateAccountProfileData,
      {
        headers: { "Content-Type": "application/json", Token: "123-abc" },
      }
    );
    updatePromises.push(accountProfileUpdatePromise);

    // 2. Cập nhật roleId trong bảng Account nếu status = 1
    if (newStatus === 1) {
      const accountUpdatePromise = axios.put(
        `https://rmrbdapi.somee.com/odata/Account/${accountId}`,
        updatedItem.Account,
        {
          headers: { "Content-Type": "application/json", Token: "123-abc" },
        }
      );
      updatePromises.push(accountUpdatePromise);
    }

    // Gửi tất cả các yêu cầu update cùng lúc
    try {
      await Promise.all(updatePromises);

      // Làm mới dữ liệu sau khi cập nhật thành công
      getData();

      toast.success("Trạng thái và role đã được cập nhật!");
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const handleDetails = (accountId) => {
    console.log(`Viewing details for account ID: ${accountId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ToastContainer />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Account Name</th>
            <th>Date of birth</th>
            <th>Front ID Card</th>
            <th>Back ID Card</th>
            <th>Portrait</th>
            <th>Bank Account QR</th>
            <th>ID Card Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.Account?.userName || "NoName"}</td>
                <td>{item.dateOfBirth}</td>
                <td>{item.frontIdcard && <img alt="Front ID Card" style={{ width: "100px", height: "100px" }} src={item.frontIdcard} />}</td>
                <td>{item.backIdcard && <img alt="Back ID Card" style={{ width: "100px", height: "100px" }} src={item.backIdcard} />}</td>
                <td>{item.portrait && <img alt="Portrait" style={{ width: "100px", height: "100px" }} src={item.portrait} />}</td>
                <td>{item.bankAccountQR && <img alt="Bank Account QR" style={{ width: "100px", height: "100px" }} src={item.bankAccountQR} />}</td>
                <td>{item.idcardNumber}</td>
                <td>
                  <FaBan
                    style={{
                      color: item.status === 0 ? "red" : "grey",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                    title="Blocked"
                    onClick={() => handleStatusChange(item.accountId, 0)}
                  />
                  <FaCheckCircle
                    style={{
                      color: item.status === 1 ? "green" : "grey",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                    title="Approved"
                    onClick={() => handleStatusChange(item.accountId, 1)}
                  />
                  <FaRegClock
                    style={{
                      color: item.status === -1 ? "orange" : "grey",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                    title="Uncensored"
                    onClick={() => handleStatusChange(item.accountId, -1)}
                  />
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleDetails(item.accountId)}>
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AccountProfile;
