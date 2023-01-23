import {FieldProps} from "formik"

import "./styles.scss"

interface OwnProps {

}

export const Checkbox:React.FC<FieldProps & OwnProps> = ({field, form, ...props}) => {
    return <input type="checkbox" className={"checkbox"} {...props}/>
}