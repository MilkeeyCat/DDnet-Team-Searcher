import logo from "../../assets/images/logo.png"

import "./styles.scss"
import {Link} from "react-router-dom"

export const Footer = () => {
    return (
        <footer className={"footer"}>
            <Link to={"/"}><img src={logo}/></Link>
            <div className={"footer__links"}>
                <a href="#">Privacy policy</a>
                <a href="#">Terms of use</a>
                <p>Made with <s>pain</s> love <span>&#60;3</span></p>
            </div>
        </footer>
    )
}