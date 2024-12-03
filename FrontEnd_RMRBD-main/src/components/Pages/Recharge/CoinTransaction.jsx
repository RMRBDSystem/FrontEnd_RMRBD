import { useState, useEffect } from 'react';
import { getCoinTransactionByAccountId } from '../../services/Transaction';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';

const CoinTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await getCoinTransactionByAccountId(localStorage.getItem('UserId'));
      if (response) {
        setTransactions(response);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="max-w-[1140px] mx-auto p-6 bg-white rounded-lg shadow-2xl mb-10">
      <div className='flex items-center justify-start mb-2'>
        <FaArrowLeft
          className="min-w-[24px] h-[24px] text-gray-600 mr-2 cursor-pointer hover:text-gray-900"
          onClick={handleGoBack}></FaArrowLeft>
        <h2 className="text-2xl font-medium">Lịch sử giao dịch</h2>
      </div>
      <span className="ml-2 text-gray-600 mb-6">Trang này chỉ hiển thị lịch sử giao dịch qua phương thức PayOS. <a href="/termsofpurchase" className="text-blue-500 hover:underline">Xem điều khoảng</a></span>
      <div className="grid gap-6">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ngày giao dịch: {new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                }).format(new Date(transaction.date))}
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Mã giao dịch: {transaction.coinTransactionId}</span>
                </li>
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Biến động tiền: {transaction.moneyFluctuations}</span>
                </li>
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Biến động xu: {transaction.coinFluctuations}</span>
                </li>
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Chi tiết giao dịch: {transaction.detail}</span>
                </li>
                <li className="flex items-center">
                  {transaction.status === 1 ? (
                    <FaCheckCircle className="mr-2 text-green-500" />
                  ) : (
                    <FaTimesCircle className="mr-2 text-red-500" />
                  )}
                </li>
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Không có lịch sử giao dịch.</p>
        )}
      </div>
    </div>
  );
};

export default CoinTransaction;
