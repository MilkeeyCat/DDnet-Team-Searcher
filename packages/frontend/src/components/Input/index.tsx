import {FieldProps} from "formik"
import errorIcon from "../../assets/images/error.png"
import classNames from "classnames";

interface OwnProps {
    placeholder?: string;
    type?: "text" | "number" | "password"
}

export const Input: React.FC<FieldProps & OwnProps> = ({field, form, ...props}) => {
    const errorText = form.errors[field.name]

    return (
        <div className={classNames("relative [&>input:not(:placeholder-shown)+span::before]:opacity-100 [&>input:not(:placeholder-shown)]:pt-[15px] [&>input:not(:placeholder-shown)]:pb-[5px]")}>
            <input className="transition-all duration-300 border-[1px] bg-[rgba(0,0,0,.45)] border-[rgba(0,0,0,0)] rounded-[10px] py-2.5 px-[12px] text-[white] outline-0 focus:border-primary-1" type="text" {...field} {...props}/>
            <span data-placeholder={props.placeholder} className="before:absolute before:content-[attr(data-placeholder)] before:text-primary-1 before:transition-all before:duration-300 before:text-[10px] before:left-2.5 before:top-1 before:opacity-0"/>
            {errorText && form.touched[field.name] && <img src={errorIcon} className="absolute top-1/2 -translate-y-1/2 right-2.5 animate-pulse select-none" draggable={false} title={errorText as string}/>}
        </div>
    )
}