import {FieldProps} from "formik"

interface OwnProps {
    title: string;
    subtitle: string;
    id: string
}

export const RadioInput:React.FC<FieldProps & OwnProps> = ({field, form, id, title, subtitle, ...props}) => {
    return (
        <div className={"flex items-center py-[5px] px-2.5 rounded-[5px]"}>
            <input type="radio" className={"w-5 h-5 appearance-none rounded-full border-2 border-primary-1 flex justify-center items-center before:w-2.5 before:h-2.5 before:rounded-full before:scale-0 before:duration-[120ms] before:ease-in-out before:bg-primary-1 checked:before:scale-100"} id={id} {...field} {...props}/>
            <label htmlFor={id} className={"ml-2.5 grow-[1]"}>
                <p className={"font-medium"}>{title}</p>
                <p className={"text-[12px]"}>{subtitle}</p>
            </label>
        </div>
    )
}