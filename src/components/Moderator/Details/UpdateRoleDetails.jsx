import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AccountDetails = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusEditing, setStatusEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [censorNote, setCensorNote] = useState();

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  const fetchAccountDetails = async () => {
    setLoading(true);
    const headers = { "Content-Type": "application/json", token: "123-abc" };

    try {
      const result = await axios.get(
        `https://localhost:7220/odata/AccountProfile/${accountId}`,
        { headers }
      );
      setAccountDetails(result.data);
      setNewStatus(result.data.status);
      //setNewStatus(result.data.censorNote);
    } catch (error) {
      console.error("Error fetching account details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (newStatus !== accountDetails.status) {
      setLoading(true);
      const headers = { "Content-Type": "application/json", token: "123-abc" };
      const updatedData = { ...accountDetails, status: newStatus };

      try {
        await axios.put(
          `https://localhost:7220/odata/AccountProfile/${accountId}`,
          updatedData,
          { headers }
        );
        setAccountDetails({ ...accountDetails, status: newStatus });
        setStatusEditing(false);
      } catch (error) {
        console.error("Error updating status:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Đang tải...
      </div>
    );
  }

  if (!accountDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Không tìm thấy thông tin tài khoản.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Chi tiết tài khoản
        </h1>

        {/* Account Info */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="font-semibold text-2xl text-gray-700 mb-4">
            Thông tin tài khoản
          </h2>
          <p className="mb-4 text-lg">
            <span className="font-medium">Tên đăng nhập:</span>{" "}
            {accountDetails.account?.userName || "Không có tên"}
          </p>
          <p className="mb-4 text-lg">
            <span className="font-medium">Ngày sinh:</span>{" "}
            {accountDetails.dateOfBirth
              ? format(new Date(accountDetails.dateOfBirth), "dd/MM/yyyy", {
                  locale: vi,
                })
              : "Không có"}
          </p>
          <p className="mb-4 text-lg">
            <span className="font-medium">Số CMND:</span>{" "}
            {accountDetails.idcardNumber || "Không có"}
          </p>
        </div>

        {/* Images */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="font-semibold text-2xl text-gray-700 mb-4">
            Hình ảnh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountDetails.frontIdcard && (
              <div>
                <p className="font-medium text-lg mb-2">Mặt trước CMND:</p>
                <img
                  src={accountDetails.frontIdcard}
                  alt="Mặt trước CMND"
                  className="w-full h-auto object-contain rounded-lg border"
                />
              </div>
            )}
            {accountDetails.backIdcard && (
              <div>
                <p className="font-medium text-lg mb-2">Mặt sau CMND:</p>
                <img
                  src={accountDetails.backIdcard}
                  alt="Mặt sau CMND"
                  className="w-full h-auto object-contain rounded-lg border"
                />
              </div>
            )}
            {accountDetails.portrait && (
              <div>
                <p className="font-medium text-lg mb-2">Ảnh chân dung:</p>
                <img
                  src={accountDetails.portrait}
                  alt="Ảnh chân dung"
                  className="w-full h-auto object-contain rounded-lg border"
                />
              </div>
            )}
            {accountDetails.bankAccountQR && (
              <div>
                <p className="font-medium text-lg mb-2">Mã QR tài khoản:</p>
                <img
                  src={accountDetails.bankAccountQR}
                  alt="Mã QR tài khoản ngân hàng"
                  className="w-full h-auto object-contain rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Update */}
        <div className="mb-6">
          <label className="block text-lg font-semibold">
            Trạng thái tài khoản:
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={1}>Xác nhận</option>
            <option value={-1}>Chờ xác nhận</option>
            <option value={0}>Khóa</option>
          </select>
        </div>
        {/* Censor Update */}
        {/* <div>
          <label className="block text-lg font-semibold">Censor Note:</label>
          <textarea
            value={censorNote}
            onChange={(e) => setCensorNote(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows="4"
          />
        </div> */}
        {/* Action Buttons */}
        <div className="mt-6 text-center space-x-4">
          <button
            onClick={updateStatus}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-xl transform hover:scale-105 transition duration-300"
          >
            Lưu
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-xl transform hover:scale-105 transition duration-300"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
