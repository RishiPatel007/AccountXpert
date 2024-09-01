import React from "react";

function CompanyDetails({
  company_name,
  setCompanyName,
  company_email,
  setCompanyEmail,
  company_phone,
  setCompanyPhone,
  company_type,
  setCompanyType,
  company_address,
  setCompanyAddress,
}) {
  return (
    <>
      <h6 className="mb-3">Company Details</h6>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="company_name" className="form-label">
            Company Name
          </label>
          <input
            type="text"
            className="form-control"
            id="company_name"
            placeholder="Enter company name"
            value={company_name}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <div className="invalid-feedback">
            Company name must be between 3 and 50 characters.
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="company_email" className="form-label">
            Company Email
          </label>
          <input
            type="email"
            className="form-control"
            id="company_email"
            placeholder="Enter company email"
            value={company_email}
            onChange={(e) => setCompanyEmail(e.target.value)}
            required
          />
          <div className="invalid-feedback">Enter a valid email address.</div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="company_phone" className="form-label">
            Company Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="company_phone"
            placeholder="Enter company phone"
            value={company_phone}
            onChange={(e) => setCompanyPhone(e.target.value)}
            required
          />
          <div className="invalid-feedback">
            Company phone number must be valid.
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="company_type" className="form-label">
            Company Type
          </label>
          <select
            className="form-control"
            id="company_type"
            value={company_type}
            onChange={(e) => setCompanyType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select company type
            </option>
            <option value="LLC">LLC</option>
            <option value="Corporation">Corporation</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
          </select>
          <div className="invalid-feedback">Please select a company type.</div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-12">
          <label htmlFor="company_address" className="form-label">
            Company Address
          </label>
          <textarea
            className="form-control"
            id="company_address"
            rows="3"
            placeholder="Enter company address"
            value={company_address}
            onChange={(e) => setCompanyAddress(e.target.value)}
            required
          ></textarea>
          <div className="invalid-feedback">
            Company address must be between 10 and 100 characters.
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyDetails;
