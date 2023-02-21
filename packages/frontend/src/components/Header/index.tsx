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
        <header className={classNames("py-5 w-full z-[1] bg-[rgba(0,0,0,.36)]", {"absolute t-0": !isAuthed})}>
            <div className="flex justify-between items-end max-w-[1110px] mx-auto">
                <Link to={"/"}>
                    <img src={logo} alt="logotype" className={classNames({"hidden": !isAuthed})}/>
                </Link>
                <div className={classNames({"hidden": isAuthed, "flex items-center [&>:not(:first-child)]:ml-7": !isAuthed})}>
                    <Button styleType={"bordered"}><Link to={"/register"}><img src={signUpIcon} className="inline-block" alt="sign up icon"/> Sign up</Link></Button>
                    <Button styleType={"filled"}><Link to={"/login"}><img src={loginIcon} className="inline-block" alt="login icon"/> Log in</Link></Button>
                </div>
                <div
                    className={classNames({"flex items-center": isAuthed, "hidden": !isAuthed})}> {/* authed user part */}
                    <div className="relative">
                        <Button styleType={isCreateSelectionMenuHidden ? "bordered" : "filled"} className={"p-1"} onClick={() => setIsSelectionMenuHidden(!isCreateSelectionMenuHidden)}><img className="!m-0" src={addIcon}/></Button>
                        <div ref={ref} data-id="header" className={classNames("absolute l-0 min-w-[max(100%,200px)] bg-primary-2 top-[125%] rounded-[10px]", {"hidden": isCreateSelectionMenuHidden})}>
                            <div className="text-[white] px-4 py-2.5 rounded-[10px] transition-all duration-200 cursor-pointer hover:bg-primary-3" onClick={createEvent}>Create event</div>
                            <div className="text-[white] px-4 py-2.5 rounded-[10px] transition-all duration-200 cursor-pointer hover:bg-primary-3" onClick={createRun}>Create run</div>
                        </div>
                    </div>
                    <Button style={{"border": "0"}} className="!p-0 max-w-[25px] w-full ml-5" styleType={"bordered"}><img src={notification}/></Button>
                    <p className="text-[white] mx-5">{username}</p>
                    <Avatar src={avatar} username={username || ""} size={30}/>
                </div>
            </div>
        </header>
    )
}