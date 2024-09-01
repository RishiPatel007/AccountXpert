import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="footer-logo">
              <h3>Account Xpert</h3>
              <p>Manage your accounts effortlessly.</p>
              <div className="social-icons">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Product</h5>
            <ul className="footer-links">
              <li><Link to="/invoice-generator">Online Invoice Generator</Link></li>
              <li><Link to="/receipt-maker">Receipt Maker</Link></li>
              <li><Link to="/estimate-maker">Estimate Maker</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Resources</h5>
            <ul className="footer-links">
              <li><Link to="/invoice-templates">Invoice Templates</Link></li>
              <li><Link to="/receipt-templates">Receipt Template</Link></li>
              <li><Link to="/estimate-templates">Estimate Templates</Link></li>
              <li><Link to="/profit-calculator">Profit Margin Calculator</Link></li>
              <li><Link to="/blog">Our Blog</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Company</h5>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/customers">Customers</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Get Started</h5>
            <a href="/register" className="btn btn-primary mb-2">TRY IT FREE</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
