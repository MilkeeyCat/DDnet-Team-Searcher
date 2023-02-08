import {FieldProps} from "formik"
import "./styles.scss"
import classNames from "classnames"

interface OwnProps {
    label: string;
    id: string;
    required?: boolean;
    datalist?: string[];
    className?: string;
}

export const InputWithLabel:React.FC<FieldProps & OwnProps> = ({field, form, id, required, className, datalist, label, ...props}) => {
    return (
        <div className={classNames("input-with-label", className)}>
            <label htmlFor={id} className={"input-with-label__label"}>{label}{required && <span>*</span>}</label>
            <input type={"text"} className={"input-with-label__input"} list={datalist && id+"_1"} {...field} {...props} id={id}/>
            {datalist &&
            <datalist id={id+"_1"}>
                {datalist.map(el => {
                    return (
                        <option key={el} value={el}></option>
                    )
                })}
            </datalist>}
        </div>
    )
}