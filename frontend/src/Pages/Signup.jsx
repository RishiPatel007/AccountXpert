import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import axios from "axios";
import applyBootstrapValidation from 'D:/CODING/ACCOUNTXPERT/frontend/src/bootstrapValidation.js';
import UserDetails from "./Signup_Components/UserDetails";
import CompanyDetails from "./Signup_Components/CompanyDetails";
import AdditionalDetails from "./Signup_Components/AdditionalDetails";
import "./Styles/Signup.css";

export default function SignUp() {
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);  // For redirection

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const [company_name, setCompanyName] = useState("");
  const [company_email, setCompanyEmail] = useState("");
  const [company_phone, setCompanyPhone] = useState("");
  const [company_type, setCompanyType] = useState("");
  const [company_address, setCompanyAddress] = useState("");

  const [tax_id, setTaxId] = useState("");
  const [gst_number, setGSTNumber] = useState("");
  const [invoice_prefix, setInvoicePrefix] = useState("");
  const [default_currency, setDefaultCurrency] = useState("USD");

  useEffect(() => {
    applyBootstrapValidation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    const data = {
      username,
      email,
      password,
      companyDetails: {
        name : company_name,
        email : company_email,
        phone : company_phone,
        type : company_type,
        address : company_address,
        tax_id,
        gst_number,
        invoice_prefix,
        default_currency,
      },
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/signup/", data);
      console.log(response)
      if (response.status === 201 ) {
        setRedirect(true); 
      } else if (response.status === 400 ) {
        setMessage('Username already exists');
      } else {
        setMessage('An error occurred during signup.');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage('An error occurred during signup.');
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header text-white" style={{background:"rgb(255, 136, 0)"}}>
          <h5 className="card-title mb-0">User & Company Information</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate className="validated-form">
            <UserDetails
              username={username}
              password={password}
              confirm_password={confirm_password}
              email={email}
              setUsername={setUsername}
              setPassword={setPassword}
              setEmail={setEmail}
              setConfirmPassword={setConfirmPassword}
            />
            <CompanyDetails
              company_name={company_name}
              setCompanyName={setCompanyName}
              company_email={company_email}
              setCompanyEmail={setCompanyEmail}
              company_phone={company_phone}
              setCompanyPhone={setCompanyPhone}
              company_type={company_type}
              setCompanyType={setCompanyType}
              company_address={company_address}
              setCompanyAddress={setCompanyAddress}
            />
            <AdditionalDetails
              tax_id={tax_id}
              setTaxId={setTaxId}
              gst_number={gst_number}
              setGSTNumber={setGSTNumber}
              invoice_prefix={invoice_prefix}
              setInvoicePrefix={setInvoicePrefix}
              default_currency={default_currency}
              setDefaultCurrency={setDefaultCurrency}
            />
            <div className="row">
              <div className="col-md-12 text-center">
                <button type="submit" className="btn text-white" style={{background:"rgb(255, 136, 0)"}}>
                  Save Details
                </button>
              </div>
            </div>
            {message && <div className="alert-message">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
