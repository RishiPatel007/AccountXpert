import "./Styles/header.css";
import {Link} from 'react-router-dom'
export default function Header() {
  return (
    <>
      <div className="mainHeader row mt-5">
        <div className="col-lg-6">
          <div className="heading1">Invoice Your Customers in Seconds</div>
          <div className="heading2">
            <div>
              The world's simplest way to invoice customers, from your phone or
              laptop. Save time, stay organized and look professional.
            </div>
            <div>
              For contractors, freelancers, owner-operators, creatives, and
              other small business owners.
            </div>
            <Link to='/invoice'>
            <div className="invoiceButton ">
              <button className="btn text-center text-white Button">
                <span className="">Create an invoice now</span>
                <span>
                <svg className="plusSign" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M446.67-446.67H200v-66.66h246.67V-760h66.66v246.67H760v66.66H513.33V-200h-66.66v-246.67Z"/></svg>
                </span>
              </button>
            </div>
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <img
            src="https://openwebsolutions.in/blog/wp-content/uploads/2019/09/accounting-software-development.jpeg"
            alt=""
            height={"500px"}
          />
        </div>
      </div>
    </>
  );
}
