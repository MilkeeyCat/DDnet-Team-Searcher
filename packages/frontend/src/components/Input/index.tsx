import {FieldProps} from "formik"
import "./styles.scss"
import errorIcon from "../../assets/images/error.png"

interface OwnProps {
    placeholder?: string;
    type?: "text" | "number" | "password"
}

export const Input: React.FC<FieldProps & OwnProps> = ({field, form, ...props}) => {

    const errorText = form.errors[field.name]

    return (
        <div className={"input-wrapper"}>
            <input className={"input"} type="text" {...field} {...props}/>
            <span data-placeholder={props.placeholder}/>
            {errorText && form.touched[field.name] && <img src={errorIcon} className={"input__icon input__icon-error"} title={errorText as string}/>}
        </div>
    )
}