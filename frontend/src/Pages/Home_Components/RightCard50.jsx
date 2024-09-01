import "./Styles/rightCard.css";
export default function RightCard50({ img, text, heading }) {
  return (
    <>
      <div className="row mainCard">
        <div className="col-lg-6 text">
          <div className="headingText">{heading}</div>
          <div className="bodyText">{text}</div>
        </div>
        <div className="col-lg-1"></div>
        <div className="col-lg-5">
          <img className="img img-fluid" src={img} />
        </div>
      </div>
    </>
  );
}
