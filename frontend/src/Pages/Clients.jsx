import React, { useState, useEffect } from "react";
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./Styles/Clients.css";
import * as Yup from "yup";

function Clients() {
  const [username, setUsername] = useState(null);
  const location = useLocation();
  const [addbutton, setAddbutton] = useState(true);
  const [clients, setClients] = useState([]);
  const [refreshId, setRefreshId] = useState();
  const [activeClient, setActiveClient] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    _id: null,
  });
  const [errors, setErrors] = useState({});

  const clientSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Client name is too short!")
      .max(50, "Client name is too long!")
      .required("Client name is required"),
    address: Yup.string()
      .min(10, "Address is too short!")
      .max(100, "Address is too long!")
      .required("Address is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone number must be digits only")
      .min(10, "Phone number is too short!")
      .max(15, "Phone number is too long!")
      .required("Phone number is required"),
  });

  useEffect(() => {
    const getUsername = async () => {
      try {
        const user = getCookie();
        setUsername(user);
      } catch (error) {
        console.error("Error fetching cookie:", error);
      }
    };

    getUsername();
  }, [location]);

  useEffect(() => {
    if (username) {
      const fetchClients = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/get-clients/",
            { params: { username } }
          );
          response.data.clients.sort((a, b) => a.name.localeCompare(b.name));
          setClients(response.data.clients || []);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };

      fetchClients();
    }
  }, [username, refreshId]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      await clientSchema.validate(activeClient, { abortEarly: false });

      const newClient = { ...activeClient, username };
      const response = await axios.post(
        "http://localhost:8000/api/add-client/",
        newClient
      );

      if (response.status === 201) {
        const newClientWithId = { ...newClient, _id: response.data._id };
        const updatedClients = [...clients, newClientWithId].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setClients(updatedClients);
        setRefreshId(null);
        setActiveClient({
          name: "",
          address: "",
          email: "",
          phone: "",
          _id: null,
        });
        setErrors({}); // Clear errors
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Error adding client:", error);
      }
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (activeClient._id) {
      try {
        await clientSchema.validate(activeClient, { abortEarly: false });

        const updatedClient = { ...activeClient };
        const response = await axios.put(
          `http://localhost:8000/api/update-client/${activeClient._id}/`,
          updatedClient
        );

        if (response.status === 200) {
          const updatedClients = clients
            .map((client) =>
              client._id === activeClient._id ? updatedClient : client
            )
            .sort((a, b) => a.name.localeCompare(b.name));
          setClients(updatedClients);
          setActiveClient({
            name: "",
            address: "",
            email: "",
            phone: "",
            _id: null,
          });
          setAddbutton(true);
          setErrors({}); // Clear errors
        }
      } catch (error) {
        if (error.name === "ValidationError") {
          const validationErrors = {};
          error.inner.forEach((err) => {
            validationErrors[err.path] = err.message;
          });
          setErrors(validationErrors);
        } else {
          console.error("Error updating client:", error);
        }
      }
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-client/${clientId}/`
      );

      if (response.status === 200) {
        const updatedClients = clients.filter(
          (client) => client._id !== clientId
        );
        setClients(updatedClients);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleListClick = (index) => {
    setActiveClient(clients[index]);
    setAddbutton(false);
  };

  if (username === null) {
    return <div>Loading...</div>;
  }

  if (!username) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="clients-container d-flex flex-column flex-lg-row">
        <div className="form-container">
          <h2>{addbutton ? "Add Client" : "Update Client"}</h2>
          <form onSubmit={addbutton ? handleAddClient : handleUpdateClient}>
            <div className="form-group">
              <label htmlFor="name">Client Name</label>
              <input
                type="text"
                id="name"
                value={activeClient.name}
                onChange={(e) =>
                  setActiveClient({ ...activeClient, name: e.target.value })
                }
                placeholder="Enter client name"
                className={errors.name ? "form-control is-invalid" : "form-control"}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                value={activeClient.address}
                onChange={(e) =>
                  setActiveClient({
                    ...activeClient,
                    address: e.target.value,
                  })
                }
                placeholder="Enter address"
                className={errors.address ? "form-control is-invalid" : "form-control"}
              />
              {errors.address && <div className="text-danger">{errors.address}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={activeClient.email}
                onChange={(e) =>
                  setActiveClient({ ...activeClient, email: e.target.value })
                }
                placeholder="Enter email"
                className={errors.email ? "form-control is-invalid" : "form-control"}
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                value={activeClient.phone}
                onChange={(e) =>
                  setActiveClient({ ...activeClient, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className={errors.phone ? "form-control is-invalid" : "form-control"}
              />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
            </div>

            <button type="submit" className="btn btn-primary">
              {addbutton ? "Add Client" : "Update Client"}
            </button>
          </form>
        </div>

        <div className="clients-list">
          <h2>Client List</h2>
          {clients.length > 0 ? (
            <ul>
              {clients.map((client, index) => (
                <li key={client._id} className="client-item">
                  <div
                    className="client-info"
                    onClick={() => handleListClick(index)}
                  >
                    <h3>{client.name}</h3>
                    <p>Phone: {client.phone}</p>
                  </div>
                  <span
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client._id);
                    }}
                  >
                    &#x2715;
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No clients added yet.</p>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Clients;
