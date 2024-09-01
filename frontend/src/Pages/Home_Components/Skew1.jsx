import "./Styles/skew1.css";
import Card from './Card'
export default function Skew1({ color }) {

  const headingText1 = "Invoice"
  const bodyText1 = "Efficiently generate professional invoices, handle payments, and track financial records, enhancing your business's financial management and overall operational efficiency."
  const buttonText1 = "Create Invoice"
  
  const headingText2 = "Companies"
  const bodyText2 = "Centralize company information, manage profiles, and maintain consistent branding, enhancing business visibility, and operational efficiency for better performance."
  const buttonText2 = "Manage Companies"

  const headingText3 = "Products"
  const bodyText3 = "Organize and manage your product inventory, ensuring accurate details and smooth sales processes, improving inventory management and sales operations."
  const buttonText3 = "Manage Products"

  return (
    <>
      <section className="trapezium-section" style={{backgroundColor : color}}>
        <div className="main">
            <div className="title">
            The Easiest Invoicing Software You’ll Ever Use
            </div>
            <div className="row mt-5">
                <Card headingText={headingText1} bodyText={bodyText1} buttonText={buttonText1}link = "/invoice"></Card>
                <Card headingText={headingText2} bodyText={bodyText2} buttonText={buttonText2}link = "/companies"></Card>
                <Card headingText={headingText3} bodyText={bodyText3} buttonText={buttonText3}link = "/products"></Card>
            </div>
        </div>
      </section>
    </>
  );
}
