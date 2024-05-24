//BarChart.js
import React from 'react';
import './BarChart.css'
import { Bar } from 'react-chartjs-2'; // Import Bar from react-chartjs-2
import { Chart, LineController, LineElement, PointElement, LinearScale, Title,CategoryScale,BarElement} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale ,BarElement);

const BarChart = ({ data, month }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map((d) => d.priceRange),
    datasets: [
      {
        label: 'Items Count',
        data: data.map((d) => d.itemCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className='bar_chart'>
      <h2>Price Range Bar Chart {month}</h2>
      <Bar data={chartData} /> 
    </div>
  );
};

export default BarChart;
