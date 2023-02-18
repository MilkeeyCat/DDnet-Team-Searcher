import logo from "../../assets/images/logo.png"
import {Link} from "react-router-dom"

export const Footer = () => {
    return (
        <footer className="mt-auto py-5 px-[130px] flex justify-between items-center text-[white] bg-[#201B14]">
            <Link to={"/"}><img src={logo}/></Link>
            <div className="flex">
                <a href="#" className="mx-4">Privacy policy</a>
                <a href="#" className="mx-4">Terms of use</a>
                <p className="mx-4">Made with <s>pain</s> love <span className="text-primary-1">&#60;3</span></p>
            </div>
        </footer>
    )
}