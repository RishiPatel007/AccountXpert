import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";
import "./Styles/CreateInvoice.css";

function CreateInvoice() {
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
    invoiceDate: new Date().toISOString().split('T')[0],
    terms: "On Receipt",
    items: [{ description: "", rate: "", qty: "", amount: "" }],
    total: 0,
    subtotal: 0,
    username: getCookie(),
  });
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(null); // New state to track active item index

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/get-personal-data/?username=${getCookie()}`
      )
      .then((res) => {
        console.log(res.data);
        setFormData((prevState) => ({
          ...prevState,
          businessName: res.data.businessName,
          businessEmail: res.data.businessEmail,
          businessAddress: res.data.businessAddress,
          businessPhone: res.data.businessPhone,
          businessNumber: res.data.businessNumber,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addItem = () => {
    setItems([...items, { description: "", price: 0, quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
    updateSubtotal(newItems);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "clientName" && value) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/search-client/?query=${value}`
        );
        setClientSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching client suggestions:", error);
      }
    }
  };

  const handleItemChange = async (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;

    setActiveItemIndex(index); // Set the current item index

    if (name === "description" && value) {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/search-item/?query=${value}`
        );
        setItemSuggestions(res.data);
      } catch (e) {
        console.error("Error fetching item suggestions:", e);
      }
    } else {
      setItemSuggestions([]); // Clear suggestions when the description field is empty
    }

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

  const handleClientSelect = async (client) => {
    setFormData((prevState) => ({
      ...prevState,
      clientName: client.name,
      clientEmail: client.email,
      clientAddress: client.address,
      clientPhone: client.phone,
    }));
    setClientSuggestions([]);
  };

  const handleItemSelect = (index, item) => {
    const newItems = [...items];
    newItems[index].description = item.name;
    newItems[index].price = item.price;
    newItems[index].quantity = 1;

    setItems(newItems);
    updateSubtotal(newItems);
    setFormData((prevState) => ({
      ...prevState,
      items: newItems,
    }));
    setItemSuggestions([]);
    setActiveItemIndex(null); // Clear active item index after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    const response = await axios.post(
      "http://127.0.0.1:8000/api/create-invoice/",
      formData
    );
    if (response.status === 201) {
      setRedirect(true);
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
            <h1>Invoice</h1>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <h5>From</h5>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control input_line"
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
                className="form-control input_line"
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
                className="form-control input_line"
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
                className="form-control input_line"
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
                className="form-control input_line"
                placeholder="123-45-6789"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <h5>Bill To</h5>
            <div className="mb-3 position-relative">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control input_line"
                placeholder="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                autoComplete="off"
              />
              {clientSuggestions.length > 0 && (
                <ul
                  className="list-group-numbered list-group position-absolute w-100 suggestion-dropdown"
                  style={{ zIndex: 1000 }}
                >
                  {clientSuggestions.map((client, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-primary suggestion-item"
                      onClick={() => handleClientSelect(client)}
                    >
                      {client.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control input_line"
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
                className="form-control input_line"
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
                className="form-control input_line"
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
              className="form-control input_line"
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
              className="form-control input_line"
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
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="position-relative">
                    <input
                      type="text"
                      className="form-control input_line"
                      placeholder="Item Description"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                    {index === activeItemIndex &&
                      Array.isArray(itemSuggestions) &&
                      itemSuggestions.length > 0 && (
                        <ul
                          className="position-absolute w-100 list-group-numbered list-group"
                          style={{ zIndex: 1000 }}
                        >
                          {itemSuggestions.map((suggestion, i) => (
                            <li
                              key={i}
                              className="list-group-item list-group-item-primary"
                              onClick={() => handleItemSelect(index, suggestion)}
                            >
                              {suggestion.name} - ₹{suggestion.price}
                            </li>
                          ))}
                        </ul>
                      )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control input_line"
                      placeholder="0.00"
                      name="price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control input_line"
                      placeholder="1"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeItem(index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <div className="text-end">
              <p>Subtotal : ₹{formData.subtotal.toFixed(2)}</p>
              <p>Total (including GST): ₹{formData.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateInvoice;
