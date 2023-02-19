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
    const rand = Math.random() //TODO: replace it with uuid
    
    return (
        <div className={classNames("flex flex-col", className)}>
            <label htmlFor={id+""+rand} className={"text-[12px] uppercase"}>{label}{required && <span className="text-error">*</span>}</label>
            <input type={"text"} className={`transition-all duration-300 bg-[rgba(0,0,0,.25)] outline-0 border-[1px] border-[rgba(0,0,0,0)] focus:border-primary-1 rounded-[5px] py-3 px-2.5 color-[white] mt-1 [&::-webkit-inner-spin-button]:hidden`} list={datalist && id+"_1"} {...field} {...props} id={id+""+rand}/>
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