import {FieldProps} from "formik"
import "./styles.scss"
import classNames from "classnames"

interface OwnProps {
    label: string;
    id: string;
    required?: boolean
    className?: string
}

export const TextareaWithLabel:React.FC<FieldProps & OwnProps> = ({field, form, id, className, required, label, ...props}) => {
    return (
        <div className={classNames("textarea-with-label", className)}>
            <label htmlFor={id} className={"textarea-with-label__label"}>{label}{required && <span>*</span>}</label>
            <textarea className={"textarea-with-label__textarea"} {...field} {...props} id={id}/>
        </div>
    )
}