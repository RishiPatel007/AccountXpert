import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./Styles/ShowInvoice.css";

const ShowInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/show-invoice/${id}/`
        );
        setInvoice(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading invoice.</div>;

  if (!invoice) {
    return <Navigate to="/invoice" />;
  }

  const downloadPDF = () => {
    const element = document.querySelector("#downloadPDF");
    window.html2pdf()
      .from(element)
      .set({
        pagebreak: { mode: "avoid-all" },
        margin: [10, 10, 10, 10],
        filename: `invoice_${invoice.invoiceNumber}.pdf`,
      })
      .save();
  };

  return (
    <div className="container my-5">
      <section id="downloadPDF" >
        <h1>Invoice</h1>
        <div className="row mt-4 px-0 pt-5">
          <div className="col-md-5">
            <h5>From</h5>
            <p>
              <strong>Name : </strong> {invoice.businessName}
            </p>
            <p>
              <strong>Email : </strong> {invoice.businessEmail}
            </p>
            <p>
              <strong>Address : </strong> {invoice.businessAddress}
            </p>
            <p>
              <strong>Phone : </strong> {invoice.businessPhone}
            </p>
            <p>
              <strong>Business Number : </strong> {invoice.businessNumber}
            </p>
          </div>
          <div className="col-md-2">
            <br />
          </div>
          <div className="col-md-5">
            <h5>Bill To</h5>
            <p>
              <strong>Name : </strong> {invoice.clientName}
            </p>
            <p>
              <strong>Email : </strong> {invoice.clientEmail}
            </p>
            <p>
              <strong>Address : </strong> {invoice.clientAddress}
            </p>
            <p>
              <strong>Phone : </strong> {invoice.clientPhone}
            </p>
          </div>
        </div>

        <div className="row mt-4 px-0">
          <div className="col-md-3">
            <p>
              <strong>Invoice Number : </strong> {invoice.invoiceNumber}
            </p>
          </div>
          <div className="col-md-3">
            <p>
              <strong>Invoice Date : </strong> {invoice.invoiceDate}
            </p>
          </div>
          <div className="col-md-3">
            <p>
              <strong>Terms : </strong> {invoice.terms}
            </p>
          </div>
        </div>

        <table className="table mt-4">
          <thead>
            <tr>
              <th>Description</th>
              <th>Rate</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row mt-4 px-0">
          <div className="col-12 d-flex justify-content-end">
            <div className="text-end">
              <p>
                <strong>Subtotal:</strong> ₹{invoice.subtotal.toFixed(2)}
              </p>
              <p>
                <strong>Total:</strong> ₹{invoice.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="row mt-4">
        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={downloadPDF}>
            Download PDF
          </button>
          <Link to="/invoice">
            <button className="btn btn-primary">Back to Invoices</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowInvoice;
