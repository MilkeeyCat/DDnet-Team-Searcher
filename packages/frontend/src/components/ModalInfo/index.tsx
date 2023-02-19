import {useAppSelector} from "../../utils/hooks/hooks"
import errorHint from "../../assets/images/error-hint.png"
import successHint from "../../assets/images/success-hint.png"

export const ModalInfo = () => {
    const hints = useAppSelector(state => state.hints.hints)

    return (
        <div className="fixed right-5 bottom-5 z-10">
            {hints.map((hint, id) => {
                return (
                    <div className="flex items-center bg-primary-2 p-2.5 mt-4 rounded-[10px] min-w-[250px] animate-[1s_fade-up_4s_forwards,1s_fade-down]" key={id}>
                        {hint.type === "error" && <img className="max-w-[30px] max-h-[40px]" src={errorHint}/>}
                        {hint.type === "success" && <img className="max-w-[30px] max-h-[40px]" src={successHint}/>}
                        <p className="ml-2.5 text-[white]/80">{hint.text}</p>
                    </div>
                )
            })}
        </div>
    )
}