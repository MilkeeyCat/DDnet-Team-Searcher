import "./styles.scss"
import React, {PropsWithChildren} from "react"
import classNames from "classnames"

interface OwnProps {
    className?: string;
    visible: boolean;
    onClose: () => void;
    title?: string;
    width?: string;
    style?: React.CSSProperties;
}

export const Modal: React.FC<PropsWithChildren<OwnProps>> = ({visible, onClose, children, title, width, style, className}) => {
    if (visible) document.body.classList.add("no-scroll")
    if (!visible) document.body.classList.remove("no-scroll")

    return (
        <div
            className={classNames("pop-up", {"pop-up_visible": visible}, {[className as string]: className})}>
            <div className={"pop-up__bg"} onClick={onClose}/>
            <div className={"pop-up__inner"} style={{maxWidth: width}}>
                <div className={"pop-up__text"} style={style}>
                    {children}
                </div>
            </div>
        </div>
    )
}