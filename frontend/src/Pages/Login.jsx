import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import applyBootstrapValidation from "D:/CODING/ACCOUNTXPERT/frontend/src/bootstrapValidation.js";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  
  useEffect(() => {
    applyBootstrapValidation();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username, password };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", data);
      if (response.status === 200) {
        document.cookie = `username = ${response.data.username}`
        setRedirect(true);
      } else if (response.status === 400) {
        setMessage("Username or Password is incorrect");
      } else {
        setMessage("Something went wrong with login");
      }
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header text-white text-center" style={{background:"rgb(255, 136, 0)"}}>
              <h5 className="card-title mb-0">Login</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate className="validated-form">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className={`form-control`}
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    Username must be between 3 and 30 characters.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control`}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    Password must be at least 8 characters long.
                  </div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn text-white" style={{background:"rgb(255, 136, 0)"}}>
                    Login
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <a href="#" className="text-decoration-none">
                Forgot Password?
              </a>
            </div>
          </div>
          {message && <div className="alert alert-danger mt-3 text-center">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
