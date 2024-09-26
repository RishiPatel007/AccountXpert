import React from "react";
import MonthlySalesGraph from "./Stats_Components/MonthlySalesGraph";
import YearlySalesGraph from "./Stats_Components/YearlySalesGraph";
import SalesForecast from "./Stats_Components/SalesForecast";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import getCookie from "../../../../../CODING/ACCOUNTXPERT/frontend/src/getCookies";
export default function Stats() {
  const [username , setUsername] = useState(getCookie())

  if (username === null) {
    return <div>Loading...</div>;
  }

  if (!username) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="text-center">
        <div className="row">
            <div className="col">

          <MonthlySalesGraph></MonthlySalesGraph>
            </div>
            <div className="col">

          <YearlySalesGraph></YearlySalesGraph>
            </div>
        </div>
        <div className="row align-items-center">
          <SalesForecast></SalesForecast>
        </div>
      </div>
    </>
  );
}
