import React, { useState, useEffect } from 'react';
import getCookie from 'D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js'; 
import axios from 'axios';
import { useLocation, Link, Navigate } from 'react-router-dom';
import "./Styles/Invoice.css";

const groupInvoicesByYearAndMonth = (invoices) => {
  if (!Array.isArray(invoices)) {
    console.error('Expected an array but got:', invoices);
    return {};
  }

  const grouped = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.invoiceDate);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(invoice);
    return acc;
  }, {});

  return grouped;
};

const Invoice = () => {
  const [username, setUsername] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [openYear, setOpenYear] = useState(null);
  const [openMonth, setOpenMonth] = useState(null);
  const location = useLocation();

  const getInvoices = async () => {
    try {
      const data = { "username": getCookie() };
      const res = await axios.post("http://127.0.0.1:8000/api/list-invoices/", data);
      setInvoices(res.data.data || []); 
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/delete-invoice/${id}/`);
      setInvoices(invoices.filter(invoice => invoice._id !== id)); 
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };
  
  useEffect(() => {
    const user = getCookie();
    setUsername(user);
    if (user) {
      getInvoices();
    }
  }, [location]);

  if (username === null) {
    return <div>Loading...</div>;
  }

  if (!username) {
    return <Navigate to="/login" />;
  }

  const groupedInvoices = groupInvoicesByYearAndMonth(invoices);

  const toggleYear = (year) => {
    setOpenYear(openYear === year ? null : year);
    setOpenMonth(null);
  };

  const toggleMonth = (month) => {
    setOpenMonth(openMonth === month ? null : month);
  };

  return (
    <div className="container my-5">
      <div className="heading d-flex justify-content-between align-items-center">
        <h2 className="mb-4 invoiceText">Invoices</h2>
        <div className="mb-4 createButton">
          <Link to="/invoice/create-invoice">
            <button className="btn Button">Create Invoice</button>
          </Link>
        </div>
      </div>

      <div className='d-flex flex-column align-items-center'>

      {Object.keys(groupedInvoices).length > 0 ? (
        Object.keys(groupedInvoices).sort((a, b) => b - a).map((year) => (
          <div key={year} className="mb-2">
            <div 
              className={`year-header ${openYear === year ? 'active' : ''}`} 
              onClick={() => toggleYear(year)}
            >
              {year}<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </div>
            {openYear === year && Object.keys(groupedInvoices[year])
              .sort((a, b) => new Date(`${b} 1, ${year}`) - new Date(`${a} 1, ${year}`))
              .map((month) => (
                <div key={month} className="mb-2">
                  <div 
                    className={`month-header ${openMonth === month ? 'active' : ''}`} 
                    onClick={() => toggleMonth(month)}
                  >
                    {month}<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
                  </div>
                  {openMonth === month && (
                    <div className="table-responsive">
                      <table className="invoiceTable table table-bordered">
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Date</th>
                            <th>Client</th>
                            <th>Total Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedInvoices[year][month]
                            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
                            .map((invoice) => (
                              <tr key={invoice._id}>
                                <td>{invoice.invoiceNumber}</td>
                                <td>{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</td>
                                <td>{invoice.clientName}</td>
                                <td>₹{invoice.total.toFixed(2)}</td>
                                <td className="d-flex justify-content-around flex-wrap">
                                  <Link to={`/invoice/show-invoice/${invoice._id}`}>
                                    <div className="orangeButton">
                                      <button className="btn m-1">Show</button>
                                    </div>
                                  </Link>
                                  <Link to={`/invoice/update-invoice/${invoice._id}`}>
                                    <div className="orangeButton">
                                      <button className="btn m-1 ">Edit</button>
                                    </div>
                                  </Link>
                                  <button 
                                    className="btn btn-danger m-1"
                                    onClick={() => deleteInvoice(invoice._id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))
      ) : (
        <div>No invoices found</div>
      )}
      </div>
    </div>
  );
};

export default Invoice;
