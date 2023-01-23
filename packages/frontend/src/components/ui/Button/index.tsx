import {CSSProperties, PropsWithChildren} from "react"
import classNames from "classnames"
import "./styles.scss"

interface OwnProps {
    type?: "submit" | "reset" | "button"
    styleType: "filled" | "bordered";
    style?: CSSProperties;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    tabIndex?: number;
    disabled?: boolean
}

export const Button:React.FC<PropsWithChildren<OwnProps>> = ({type = "button", tabIndex, styleType, disabled, onClick, style, className, ...props}) =>  {
    return (
        <button disabled={disabled} tabIndex={tabIndex} className={classNames("button", `button_${styleType}`, className)} type={type} style={style || {}} onClick={onClick}>{props.children}</button>
    )
}