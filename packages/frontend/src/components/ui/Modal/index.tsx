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
            className={classNames("fixed inset-0 text-[white] z-10 invisible transition-all duration-500 opacity-0", {"!visible !opacity-100": visible}, {[className as string]: className})}>
            <div className={"absolute inset-0 bg-[rgba(0,0,0,.8)]"} onClick={onClose}/>
            <div className={classNames("max-w-fit w-full absolute -top-full left-1/2 -translate-x-1/2 bg-primary-2 rounded-[10px] transition-all duration-500", {"top-[50px]": visible})} style={{maxWidth: width}}>
                <div className="w-full" style={style}>
                    {children}
                </div>
            </div>
        </div>
    )
}