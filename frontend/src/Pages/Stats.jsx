import React from "react";
import MonthlySalesGraph from "./Stats_Components/MonthlySalesGraph";
import YearlySalesGraph from "./Stats_Components/YearlySalesGraph";
import SalesForecast from "./Stats_Components/SalesForecast";
export default function Stats() {
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
