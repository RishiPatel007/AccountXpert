import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";

function UpdateInvoice() {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    businessPhone: "",
    businessNumber: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    clientPhone: "",
    invoiceNumber: "",
    invoiceDate: "",
    terms: "On Receipt",
    items: [{ description: "", price: 0, quantity: 1 }],
    total: 0,
    subtotal: 0,
    username: getCookie(),
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/show-invoice/${id}/`
        );
        const invoiceData = response.data.data;
        setItems(invoiceData.items || []);
        setFormData(invoiceData);
      } catch (error) {
        console.error("Error fetching the invoice data:", error);
      }
    };

    fetchInvoice();
  }, [id]);

  const addItem = () => {
    setItems([...items, { description: "", price: 0, quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
    setFormData((prevState) => ({
        ...prevState,
        items: newItems,
      }));
    updateSubtotal(newItems);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    const total = newItems[index].price * newItems[index].quantity;
    setItems(newItems);
    updateSubtotal(newItems);
    setFormData((prevState) => ({
      ...prevState,
      items: newItems,
    }));
  };

  const updateSubtotal = (items) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const total = subtotal * 1.18;
    setFormData((prevState) => ({
      ...prevState,
      subtotal,
      total,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.put(
            `http://127.0.0.1:8000/api/update-invoice/${id}/`,
            formData
        );
        if (response.status === 200) {
            setRedirect(true);
        }
    } catch (error) {
        console.error("Error updating the invoice:", error);
    }
};

  if (redirect) {
    return <Navigate to="/invoice" />;
  }

  return (
    <form onSubmit={handleSubmit} method="POST">
      <div className="container my-5">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h1>Update Invoice</h1>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <h5>From</h5>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@business.com"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Street"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="(123) 456 789"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Business Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="123-45-6789"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <h5>Bill To</h5>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@client.com"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Street"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="(123) 456 789"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-3">
            <label className="form-label">Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="INV0001"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Terms</label>
            <select
              className="form-select"
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
            >
              <option>On Receipt</option>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 60</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary mt-5"
            onClick={addItem}
          >
            Add Item
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Item description"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="100.00"
                      name="price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="1"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeItem(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <p>Subtotal: {formData.subtotal.toFixed(2)}</p>
            <p>Total (including tax): {formData.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Update Invoice
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default UpdateInvoice;
