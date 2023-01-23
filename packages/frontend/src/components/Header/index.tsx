import {Button} from "../ui/Button"
import "./styles.scss"
import logo from "../../assets/images/logo.png"
import notification from "../../assets/images/notification.svg"
import addIcon from "../../assets/images/add.svg"

import loginIcon from "../../assets/images/login.png"
import signUpIcon from "../../assets/images/sign-up.png"
import {Link, useLocation} from "react-router-dom"
import classNames from "classnames"
import {useAppDispatch, useAppSelector} from "../../utils/hooks/hooks"
import {Avatar} from "../Avatar"
import {useState} from "react"
import {setIsCreateRunModalHidden} from "../../store/slices/app"

export const Header = () => {
    const {pathname} = useLocation()
    const [isCreateSelectionMenuHidden, setIsSelectionMenuHidden] = useState(true)
    const dispatch = useAppDispatch()

    // const isMainPage = pathname === "/"

    const isAuthed = useAppSelector(state => state.app.isAuthed)
    const {username, avatar} = useAppSelector(state => state.app.user)

    return (
        <header className={classNames("header", {"login-register": !isAuthed})}>
            <div className={"inner"}>
                <Link to={"/"}>
                    <img src={logo} alt="logotype" className={classNames({"hidden": !isAuthed})}/>
                </Link>
                <div className={classNames({"hidden": isAuthed, "header__right header__buttons": !isAuthed})}>
                    <Button styleType={"bordered"}><Link to={"/register"}><img src={signUpIcon} alt="sign up icon"/> Sign up</Link></Button>
                    <Button styleType={"filled"}><Link to={"/login"}><img src={loginIcon} alt="login icon"/> Log in</Link></Button>
                </div>
                <div
                    className={classNames({"header__right": isAuthed, "hidden": !isAuthed})}> {/* authed user header */}
                    <div className={"header__create-selection-menu-wrapper"}>
                        <Button styleType={isCreateSelectionMenuHidden ? "bordered" : "filled"} className={"header__create-btn"} onClick={() => setIsSelectionMenuHidden(!isCreateSelectionMenuHidden)}><img src={addIcon}/></Button>
                        <div className={classNames("header__create-selection-menu", {"hidden": isCreateSelectionMenuHidden})}>
                            <div className={"header__create-selection-menu-item"}>Create event</div>
                            <div className={"header__create-selection-menu-item"} onClick={() => {
                                setIsSelectionMenuHidden(true)
                                dispatch(setIsCreateRunModalHidden(false))
                            }}>Create run</div>
                        </div>
                    </div>
                    <Button style={{"border": "0"}} className={"header__notification"} styleType={"bordered"}><img
                        src={notification}/></Button>
                    <p className={"header__username"}>{username}</p>
                    <Avatar src={avatar} username={username || ""} size={30}/>
                </div>
            </div>
        </header>
    )
}