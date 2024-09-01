import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";
import {
  Chart as ChartJS,
  BarElement,
} from "chart.js";
import axios from "axios";
ChartJS.register(
  BarElement,
);

const YearlySalesGraph = () => {
  const [yearlySales, setYearlySales] = useState({});

  useEffect(() => {
    const fetchSalesData = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/sales-data?username=${getCookie()}`
      );
      const salesData = response.data;
      const yearlyData = {};

      salesData.forEach(({ date, sales }) => {
        const [day, month, year] = date.split("-");

        if (!yearlyData[year]) {
          yearlyData[year] = 0;
        }

        yearlyData[year] += sales;
      });

      setYearlySales(yearlyData);
    };

    fetchSalesData();
  }, []);

  const labels = Object.keys(yearlySales).sort();
  const data = {
    labels,
    datasets: [
      {
        label: "Yearly Sales",
        data: labels.map((year) => yearlySales[year]),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h2>Yearly Sales</h2>
      <Bar data={data} />
    </div>
  );
};

export default YearlySalesGraph;
