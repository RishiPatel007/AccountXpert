import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";

const SalesForecast = () => {
  const [forecastedSales, setForecastedSales] = useState({});

  useEffect(() => {
    const fetchForecastedSales = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/sales-forecast?username=${getCookie()}`
      );
      setForecastedSales(response.data);
    };

    fetchForecastedSales();
  }, []);

  const labels = Object.keys(forecastedSales);
  const data = {
    labels,
    datasets: [
      {
        label: "Forecasted Sales",
        data: Object.values(forecastedSales),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        pointRadius: 6, 
        pointHoverRadius: 8, 
        tension: 0.6,
      },
    ],
  };

  return (
    <div>
      <h2>Sales Forecasting</h2>
      <Line data={data}/>
    </div>
  );
};

export default SalesForecast;
