import {FieldProps} from "formik"

export const Checkbox:React.FC<FieldProps> = ({field, form, ...props}) => {
    return <input type="checkbox" className="appearance-none w-5 h-5 bg-[rgba(0,0,0,.45)] bg-center bg-no-repeat checked:bg-[url('/src/assets/images/check-mark.png')]" {...props}/>
}