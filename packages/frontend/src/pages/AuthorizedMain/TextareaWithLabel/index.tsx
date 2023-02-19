import {FieldProps} from "formik"
import classNames from "classnames"

interface OwnProps {
    label: string;
    id: string;
    required?: boolean
    className?: string
}

export const TextareaWithLabel:React.FC<FieldProps & OwnProps> = ({field, form, id, className, required, label, ...props}) => {
    const rand = Math.random()
    
    return (
        <div className={classNames("flex flex-col", className)}>
            <label htmlFor={id+""+rand} className="text-[12px] uppercase">{label}{required && <span className="text-error">*</span>}</label>
            <textarea className={"bg-[rgba(0,0,0,.25)] rounded-[5px] py-3 outline-0 transition-colors duration-300 border-[1px] border-[rgba(0,0,0,0)] focus:border-primary-1 px-2.5 text-[white] mt-1"} {...field} {...props} id={id+""+rand}/>
        </div>
    )
}