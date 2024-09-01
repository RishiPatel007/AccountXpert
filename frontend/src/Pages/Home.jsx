import Header from './Home_Components/Header'
import Skew1 from './Home_Components/Skew1'
import Footer from './Footer'
import LeftCard40 from './Home_Components/LeftCard40'
import RightCard50 from './Home_Components/RightCard50'
import img1 from './Home_Components/images/home_img1.jpg'
import img2 from './Home_Components/images/home_img2.jpg'
import img3 from './Home_Components/images/home_img3.jpg'
import img4 from './Home_Components/images/home_img5.jpeg'
import img5 from './Home_Components/images/home_img4.jpg'
import "./Styles/Home.css";
export default function Home(){
    const heading1 = "Online Invoice Generator"
    const heading2 = "Managing Companies"
    const heading3 = "Managing Products"
    const heading4 = "Online Receipt Maker"
    const heading5 = "Estimate Progress"

    const text1 = "Create and send professional invoices quickly and effortlessly. Automate billing processes, track payments, and manage financial records efficiently, ensuring timely and accurate invoicing for your business"
    const text2 = "Centralize and streamline company information management. Update profiles, oversee operations, and maintain consistent branding to enhance business visibility and improve organizational efficiency."
    const text3 = "Organize and maintain product inventories with ease. Ensure accurate details, track stock levels, and streamline sales processes to optimize inventory management and enhance overall sales performance."
    const text4 = "Generate and issue digital receipts effortlessly. Simplify transaction documentation, enhance customer service, and keep accurate records of purchases for better financial tracking and management."
    const text5 = "Track and manage project estimates with precision. Monitor progress, adjust forecasts, and analyze performance to ensure projects stay on budget and meet deadlines effectively."

    return(
        <>
            <Header />
            <Skew1 color="rgba(51, 51, 51, 0.094)" />
            <div className="imagesSection container-fluid">
                <LeftCard40 img={img1} text = {text1} heading = {heading1}/>
                <RightCard50 img = {img2} text = {text2} heading = {heading2}/>
                <LeftCard40 img = {img3} text = {text3} heading = {heading3}/>
                <RightCard50 img = {img4} text = {text4} heading = {heading4}/>
                <LeftCard40 img = {img5} text = {text5} heading = {heading5}/>
            </div>
            <Footer></Footer>
        </>
    )
}