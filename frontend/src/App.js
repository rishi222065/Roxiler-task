// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './Components/TransactionsTable';
import Statistics from './Components/Statistics';
import BarChart from './Components/BarChart';
import Dropdown from './Components/Dropdown';
import './App.css';

const getMonthName = (monthNumber) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[parseInt(monthNumber) - 1];
};

const App = () => {
  const [month, setMonth] = useState('3'); // Default to March
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [page, setPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/Transactions', {
        params: {
          month,
          search,
          page,
          per_page: 10,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]); // Default to empty array if there's an error
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/Transactions/statistics', {
        params: { month },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics({}); // Default to empty object if there's an error
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/Transactions/bar-chart', {
        params: { month },
      });
      setBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      setBarChartData([]); // Default to empty array if there's an error
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [month, search, page]);
 

  const handleMonthChange = (selectedMonth) => {
    setMonth(selectedMonth);
  };

  return (
    <div className="App">
      <h1 className='h1_headding'>Transactions Dashboard</h1>
      
      <div className="nav">
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='searchbar'
      />
      <Dropdown selectedMonth={month} onChange={handleMonthChange}/>
     
      </div>
      
      
      <TransactionsTable transactions={transactions} />
      <div className='table_nav'>
      <button onClick={() => setPage(page > 1 ? page - 1 : 1)} className='Prev'>Previous</button>
      <button onClick={() => setPage(page + 1)} className='next'>Next</button>
      </div>
      <Statistics data={statistics} month={getMonthName(month)}/>
      
      <BarChart data={barChartData}  month={getMonthName(month)}/>
    
    </div>
  );
};

export default App;
