import {Button} from "../ui/Button"
import logo from "../../assets/images/logo.png"
import notification from "../../assets/images/notification.svg"
import addIcon from "../../assets/images/add.svg"
import loginIcon from "../../assets/images/login.png"
import signUpIcon from "../../assets/images/sign-up.png"
import {Link} from "react-router-dom"
import classNames from "classnames"
import {useAppDispatch, useAppSelector} from "../../utils/hooks/hooks"
import {Avatar} from "../Avatar"
import {useRef, useState} from "react"
import {setIsCreateEventModalHidden, setIsCreateRunModalHidden} from "../../store/slices/app"
import { useOutsideClickHandler } from "../../utils/hooks/useClickedOutside"
import "./styles.scss"

export const Header = () => {
    const dispatch = useAppDispatch()
    const ref = useRef<null | HTMLDivElement>(null)
    const [isCreateSelectionMenuHidden, setIsSelectionMenuHidden] = useState(true)
    const isAuthed = useAppSelector(state => state.app.isAuthed)
    const {username, avatar} = useAppSelector(state => state.app.user)

    const onOutsideClick = () => {
        setIsSelectionMenuHidden(true)
    }

    useOutsideClickHandler(ref, !isCreateSelectionMenuHidden, onOutsideClick)

    const createRun = () => {
        setIsSelectionMenuHidden(true)
        dispatch(setIsCreateRunModalHidden(false))
    }

    const createEvent = () => {
        setIsSelectionMenuHidden(true)
        dispatch(setIsCreateEventModalHidden(false))
    }


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
                    className={classNames({"header__right": isAuthed, "hidden": !isAuthed})}> {/* authed user part */}
                    <div className={"header__create-selection-menu-wrapper"}>
                        <Button styleType={isCreateSelectionMenuHidden ? "bordered" : "filled"} className={"header__create-btn"} onClick={() => setIsSelectionMenuHidden(!isCreateSelectionMenuHidden)}><img src={addIcon}/></Button>
                        <div ref={ref} className={classNames("header__create-selection-menu", {"hidden": isCreateSelectionMenuHidden})}>
                            <div className={"header__create-selection-menu-item"} onClick={createEvent}>Create event</div>
                            <div className={"header__create-selection-menu-item"} onClick={createRun}>Create run</div>
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