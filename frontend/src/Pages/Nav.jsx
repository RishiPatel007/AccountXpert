import { useState , useEffect } from "react";
import "./Styles/nav.css";
import { useLocation, Link } from 'react-router-dom';
import getCookie from "D:/CODING/ACCOUNTXPERT/frontend/src/getCookies.js";
import logo from "../assets/logo.png";
export default function Nav() {
  const [username, setUsername] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const getUsername = async()=>{
      const user = getCookie();
      setUsername(user);
    }
    getUsername()
  }, [location]);

  const handleLogout = ()=>{
    document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-lg-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="">
            <img src={logo} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item ">
                <Link className="nav-link text-center" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link text-center" to="/products">
                  Products
              </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-center" to="/clients">
                  Clients
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-center" to="/stats">
                  Stats
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Our Services
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Invoice
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Purchases
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Estimates
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Products
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            {username ? (
              <div className="loggedInDetails d-lg-flex">
                <div className="welcomeUser">Welcome {username}</div>
                <div className=" logOutButton">
                <Link to="/">
                  <button onClick={handleLogout} className="btn Button">Logout</button>
                </Link>
                </div>
              </div>
            ) : (
              <div className="navbarButtons d-lg-flex">
                <div className="justify-content-md-end loginButton">
                  <Link to="/login">
                    <button className="btn me-md-2" type="button">
                      Login
                    </button>
                  </Link>
                </div>
                <div className="justify-content-md-end signUpButton">
                  <Link to="/signup">
                    <button className="btn me-md-2" type="button">
                      SignUp
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
