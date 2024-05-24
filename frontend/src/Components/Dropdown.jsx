// src/components/Dropdown.js
import React from 'react';
import './Dropdown.css'

const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const Dropdown = ({ selectedMonth, onChange }) => {
  return (
    <div className='dropdown'>
          <select value={selectedMonth} onChange={(e) => onChange(e.target.value)}>
      {months.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </select>
    </div>

  );
};

export default Dropdown;
