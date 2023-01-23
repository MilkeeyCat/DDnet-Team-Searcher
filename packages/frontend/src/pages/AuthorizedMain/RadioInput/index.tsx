import {FieldProps} from "formik"
import "./styles.scss"

interface OwnProps {
    title: string;
    subtitle: string;
    id: string
}

export const RadioInput:React.FC<FieldProps & OwnProps> = ({field, form, id, title, subtitle, ...props}) => {
    return (
        <div className={"input_radio-wrapper"}>
            <input type="radio" className={"input_radio"} id={id} {...field} {...props}/>
            <label htmlFor={id} className={"input_radio__right"}>
                <p className={"input_radio__title"}>{title}</p>
                <p className={"input_radio__subtitle"}>{subtitle}</p>
            </label>
        </div>
    )
}