import React from "react";

function AdditionalDetails({
  tax_id,
  setTaxId,
  gst_number,
  setGSTNumber,
  invoice_prefix,
  setInvoicePrefix,
  default_currency,
  setDefaultCurrency,
}) {
  return (
    <>
      <h6 className="mb-3">Additional Details</h6>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="tax_id" className="form-label">
            Tax ID
          </label>
          <input
            type="text"
            className="form-control"
            id="tax_id"
            placeholder="Enter Tax ID"
            value={tax_id}
            onChange={(e) => setTaxId(e.target.value)}
            required
          />
          <div className="invalid-feedback">Tax ID is required.</div>
        </div>
        <div className="col-md-6">
          <label htmlFor="gst_number" className="form-label">
            GST Number
          </label>
          <input
            type="text"
            className="form-control"
            id="gst_number"
            placeholder="Enter GST Number"
            value={gst_number}
            onChange={(e) => setGSTNumber(e.target.value)}
            required
          />
          <div className="invalid-feedback">GST number is required.</div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="invoice_prefix" className="form-label">
            Invoice Prefix
          </label>
          <input
            type="text"
            className="form-control"
            id="invoice_prefix"
            placeholder="Enter Invoice Prefix"
            value={invoice_prefix}
            onChange={(e) => setInvoicePrefix(e.target.value)}
            required
          />
          <div className="invalid-feedback">
            Invoice prefix is required.
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="default_currency" className="form-label">
            Default Currency
          </label>
          <select
            className="form-control"
            id="default_currency"
            value={default_currency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          <div className="invalid-feedback">
            Please select a default currency.
          </div>
        </div>
      </div>
    </>
  );
}

export default AdditionalDetails;
