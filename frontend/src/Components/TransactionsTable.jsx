//TransactionsTable.js
import React from 'react';
import './TransactionsTable.css'

const TransactionsTable = ({ transactions }) => {
  return (
    <table className='TransactionsTable'>
      <thead className='TransactionsTable_heading'>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Date of Sale</th>
          <th>Category</th>
          <th>Sold</th>
        </tr>
      </thead>
      <tbody className='TransactionsTable_body'>
        {transactions.map((transaction) => (
          <tr key={transaction._id}>
            <td>{transaction.title}</td>
            <td>{transaction.description}</td>
            <td>{transaction.price}</td>
            <td>{transaction.dateOfSale}</td>
            <td>{transaction.category}</td>
            <td>{transaction.sold ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
