import React from "react";

function UserDetails({
  username,
  password,
  email,
  confirm_password,
  setUsername,
  setPassword,
  setConfirmPassword,
  setEmail,
}) {
  return (
    <>
      <h6 className="mb-3">User Details</h6>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="invalid-feedback">
            Username must be between 3 and 30 characters.
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="invalid-feedback">Enter a valid email address.</div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="invalid-feedback">
            Password must be at least 8 characters long.
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="confirm_password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirm_password"
            placeholder="Confirm password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="invalid-feedback">Passwords do not match.</div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
