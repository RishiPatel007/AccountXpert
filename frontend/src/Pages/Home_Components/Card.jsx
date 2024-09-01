import "./Styles/card.css";
import {Link} from 'react-router-dom'

export default function Card({headingText , bodyText , buttonText , link}){
    return(
        <div className="col-lg cardx">
            <div className="cardHeading">
                {headingText}
            </div>
            <div className = "cardBody">
                {bodyText}
            </div>
            <div>
                <Link to={link}>
                    <button className="btn text-white Button">{buttonText}</button>
                </Link>
            </div>
        </div>
    )
}