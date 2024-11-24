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
        <h2 className="text-2xl font-medium">Transactions history</h2>
      </div>
      <span className="ml-2 text-gray-600 mb-6">This page only shows the transaction history of your Coins purchased through TikTok.com. <a href="/termsofpurchase" className="text-blue-500 hover:underline">View Terms of Purchase for Coins</a></span>
      <div className="grid gap-6">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Transaction #{index + 1}
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Coin Transaction ID: {transaction.coinTransactionId}</span>
                </li>
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Customer ID: {transaction.customerId}</span>
                </li>
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Money Fluctuations: {transaction.moneyFluctuations}</span>
                </li>
                <li className="flex items-center">
                  <FaExchangeAlt className="mr-2 text-blue-500" />
                  <span>Coin Fluctuations: {transaction.coinFluctuations}</span>
                </li>
                <li className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-green-500" />
                  <span>Date: {transaction.date}</span>
                </li>
                <li className="flex items-center">
                      <FaCheckCircle className="mr-2 text-green-500" />
                      <span className="text-green-600">Status: {transaction.status}</span>
                </li>
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default CoinTransaction;
