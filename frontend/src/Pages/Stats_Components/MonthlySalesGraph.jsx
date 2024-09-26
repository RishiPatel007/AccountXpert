import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlySalesGraph = () => {
  const [monthlySales, setMonthlySales] = useState({});

  useEffect(() => {
    const fetchSalesData = async () => {
      const response = await axios.get(`http://localhost:8000/api/monthly-sales-data?username=${getCookie()}`);
      const salesData = response.data;
      const monthlyData = {};

      salesData.forEach(({ date, sales }) => {
        const [day, month, year] = date.split('-');
        const monthKey = `${month}-${year}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }

        monthlyData[monthKey] += sales;
      });

      setMonthlySales(monthlyData);
    };

    fetchSalesData();
  }, []);

  const labels = Object.keys(monthlySales).sort();
  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Sales',
        data: labels.map((month) => monthlySales[month]),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointRadius: 6, 
        pointHoverRadius: 8, 
        fill: true,
        tension : 0.5,
      },
    ],
  };

  return (
    <div>
      <h2>Monthly Sales</h2>
      <Line data={data} />
    </div>
  );
};

export default MonthlySalesGraph;
