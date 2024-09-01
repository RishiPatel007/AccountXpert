import "./Styles/leftCard.css";
export default function LeftCard40({ img, text, heading }) {
  return (
    <>
      <div className="row mainCard">
        <div className="col-lg-5 order-3 order-lg-1">
          <img className="img img-fluid" src={img} />
        </div>
        <div className="col-lg-1 order-2"></div>
        <div className="col-lg-6 text order-1 order-lg-3 text">
          <div className="headingText">{heading}</div>
          <div className="bodyText">{text}</div>
        </div>
      </div>
    </>
  );
}
