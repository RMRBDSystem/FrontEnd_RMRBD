import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { getWithdraw } from '../../services/Transaction';
import { decryptData } from "../../Encrypt/encryptionUtils";
const WithdrawMod = () => {
    const [withdrawList, setWithdrawList] = useState([]);
    const [UserId, setUserId] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const storedUserId = decryptData(Cookies.get("UserId"));
            if (storedUserId) {
                setUserId(storedUserId);
                const withdraws = await getWithdraw();
                setWithdrawList(withdraws);
            } else {
                window.location.href = '/login';
            }
        };
        fetchData();
    }, []);


    return (
        <div>
            <div>Duyệt rút xu</div>
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Tên tài khoảng</th>
                            <th>Email</th>
                            <th>Số tiền yêu cầu</th>
                            <th>Số xu biến động</th>
                            <th>Ngày yêu cầu</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawList.map((withdraw) => (
                            <tr key={withdraw.coinTransactionId}>
                                <td>{withdraw.coinTransactionId}</td>
                                <td>{withdraw.customer.userName}</td>
                                <td>{withdraw.customer.email}</td>

                                <td>{withdraw.moneyFluctuations}đ</td>
                                <td>{withdraw.coinFluctuations} xu</td>
                                <td>{new Date(withdraw.date).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</td>
                                <td>
                                    <a href={`/withdrawresponse/${withdraw.coinTransactionId}`} class="btn btn-primary">Duyệt</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default WithdrawMod