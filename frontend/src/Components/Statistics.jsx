// src/components/Statistics.js
import React from 'react';
import './Statistics.css'
import { selectedMonth } from '../App'; // Adjust the path according to your project structure

const Statistics = ({ data , month }) => {
  return (
    <div className='Stats'>
      <h2>Statistics -{month}</h2>
      <div className='Stats_calc'>
      <div >Total Sale Amount: {data.totalSaleAmount}</div>
      <div>Total Sold Items: {data.totalSoldItems}</div>
      <div>Total Not Sold Items: {data.totalNotSoldItems}</div>
      </div>
    </div>
  );
};

export default Statistics;
