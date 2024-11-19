import { useState, useEffect } from 'react';
import { getCoinTransactionByAccountId } from '../../services/Transaction';

const CoinTransaction = () => {
  const [transactions, setTransactions] = useState([]);

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
    <div>
      <h2>Coin Transactions</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            <h3>Transaction {index + 1}</h3>
            <ul>
              <li>Coin Transaction ID: {transaction.coinTransactionId}</li>
              <li>Customer ID: {transaction.customerId}</li>
              <li>Money Fluctuations: {transaction.moneyFluctuations}</li>
              <li>Coin Fluctuations: {transaction.coinFluctuations}</li>
              <li>Date: {transaction.date}</li>
              <li>Status: {transaction.status}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinTransaction;