import {useAppSelector} from "../../utils/hooks/hooks"
import errorHint from "../../assets/images/error-hint.png"
import successHint from "../../assets/images/success-hint.png"
import "./styles.scss"

export const ModalInfo = () => {
    const hints = useAppSelector(state => state.hints.hints)

    return (
        <div className="modal-info">
            {hints.map((hint, id) => {
                return (
                    <div className="modal-info__item">
                        {hint.type === "error" && <img className={"modal-info__item-icon"} src={errorHint}/>}
                        {hint.type === "success" && <img className={"modal-info__item-icon"} src={successHint}/>}
                        <p className={"modal-info__item-text"}>{hint.text}</p>
                    </div>
                )
            })}
        </div>
    )
}