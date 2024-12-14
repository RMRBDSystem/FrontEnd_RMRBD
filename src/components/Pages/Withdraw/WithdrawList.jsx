import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { getWithdrawCoinTransactionByAccountId } from '../../services/Transaction';
import { Button } from '@mui/material';
import { decryptData } from "../../Encrypt/encryptionUtils";
const WithdrawList = () => {

    const [withdrawList, setWithdrawList] = useState([]);
    const [UserId, setUserId] = useState('');
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/withdrawrequest");
      };
    useEffect(() => {
        const fetchData = async () => {
            const storedUserId = decryptData(Cookies.get("UserId"));
            if (storedUserId) {
                setUserId(storedUserId);
                const withdraws = await getWithdrawCoinTransactionByAccountId(storedUserId);
                setWithdrawList(withdraws);
            } else {
                window.location.href = '/login';
            }
        };
        fetchData();
    }, []);

    return (
        <div className='min-h-screen section-center w-full flex flex-col shadow-lg rounded-lg bg-white dark:bg-gray-800 md:p-8'>
            <div className='flex items-center justify-between p-3 border-b border-solid border-gray-500'>
                <h1 className='text-2xl font-bold'>Yêu Cầu Rút Tiền</h1>
                <Button variant="contained" color="success" onClick={handleClick}>
                    + Thêm Yêu Cầu
                </Button>
            </div>
            <table className="table px-4 py-4 border-b border-solid border-gray-500 text-xl">
                <thead>
                    <tr className='border-b border-solid'>
                        <th scope="col"># ID</th>
                        <th scope="col">Biến động tiền</th>
                        <th scope="col">Biến động xu</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {withdrawList.map((element, index) => (
                        <tr key={index}>
                            <th scope="row">{element.coinTransactionId}</th>
                            <td>{element.moneyFluctuations}đ</td>
                            <td>{element.coinFluctuations} xu</td>
                            <td>{new Date(element.date).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</td>
                            <td>
                                <span style={{ color: element.status === -1 ? 'orange' : element.status === 1 ? 'green' : 'red' }}>
                                    {element.status === -1 ? 'Chưa hoàn thành' : element.status === 1 ? 'Đã hoàn thành' : 'Đã từ chối'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WithdrawList;