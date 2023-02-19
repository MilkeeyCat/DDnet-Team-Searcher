import classNames from "classnames";
import {FieldProps} from "formik"

interface OwnProps {
    title: string;
    subtitle: string;
    id: string;
    className?: {
        label?: string;
        input?: string;
        wrapper?: string;
    };
}

export const RadioInput:React.FC<FieldProps & OwnProps> = ({field, className, form, id, title, subtitle, ...props}) => {
    return (
        <div className={classNames("flex items-center py-[5px] px-2.5 rounded-[5px] bg-primary-3", {[className?.wrapper || ""]: !!className?.wrapper})}>
            <input type="radio" className={classNames("w-5 h-5 appearance-none rounded-full border-2 border-primary-1 flex justify-center items-center before:w-2.5 before:h-2.5 before:rounded-full before:scale-0 before:duration-[120ms] before:ease-in-out before:bg-primary-1 checked:before:scale-100", {[className?.input || ""]: !!className?.input})} id={id} {...field} {...props}/>
            <label htmlFor={id} className={classNames("ml-2.5 grow-[1]", {[className?.label || ""]: !!className?.label})}>
                <p className={"font-medium"}>{title}</p>
                <p className={"text-[12px]"}>{subtitle}</p>
            </label>
        </div>
    )
}