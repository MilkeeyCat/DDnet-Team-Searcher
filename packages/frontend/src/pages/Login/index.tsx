import { Field, Form, Formik, FormikHelpers } from "formik"
import { Input } from "../../components/Input"
import { Button } from "../../components/ui/Button"
import { Link } from "react-router-dom"
import { Checkbox } from "../../components/Checkbox"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../utils/hooks/hooks"
import { composeValidators } from "../../utils/composeValidators"
import { required } from "../../utils/validators/required"
import { maxLength } from "../../utils/validators/maxLength"
import { hint } from "../../store/slices/hints"
import { LoginForm } from "../../types/LoginForm.type"
import { useLoginUserMutation } from "../../api/users-api"
import { setIsAuthed } from "../../store/slices/app"
import { LoginResponse } from "@app/shared/types/api/users.types"

export const Login = () => {
    const [ loginUser ] = useLoginUserMutation()

    const initialValues: LoginForm = {username: "", password: "", rememberMe: false}
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const validateUsernameField = (value: string | number) => composeValidators(value, [required, maxLength(50)])
    const validatePasswordField = (value: string | number) => composeValidators(value, [required, maxLength(50)])

    const validation = (values: LoginForm) => {
        const errors: { [key: string]: any } = {}

        const usernameField = validateUsernameField(values.username)
        const passwordField = validatePasswordField(values.password)

        if (usernameField) errors.username = usernameField
        if (passwordField) errors.password = passwordField

        return errors
    }

    const onSubmit = async (values: LoginForm, {setFieldError}: FormikHelpers<LoginForm>) => {
        const {rememberMe, ...data} = values
    
        try {
            await loginUser(data).unwrap()

            dispatch(setIsAuthed(true))
            navigate("/")
        } catch (e) { // if it's in catch block because of response code then err will have LoginResponse type
            const err = e as LoginResponse
            
            const error = err.data
            
            if(typeof error === "object") {
                setFieldError(error.field, error.text)
            } else {
                dispatch(hint({type: "error", text: error || ""}))
            }            
        }      
    }

    return (
        <>
            <div className={`bg-[url("/src/assets/images/login-page-background.png")] mb-[150px] h-[1093px]`}>
                <div className="pt-[120px] w-fit mx-auto">
                    <p className="text-[white] text-[40px]">Login in your account<br/> and <span
                        className={"selected-text"}>something</span> will happen.</p>
                    <Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
                        <Form>
                            <div className="flex flex-wrap mt-[100px] [&>*:not(:first-child)]:ml-[65px]">
                                <Field autoComplete={"off"} name={"username"} placeholder={"Username"} component={Input}/>
                                <Field autoComplete={"off"} name={"password"} placeholder={"Password"} type={"password"} component={Input}/>
                            </div>
                            <div className="mt-2.5 text-[white]">
                                <Field name={"rememberMe"} as={Checkbox}/>
                                <span className="ml-2.5">Remember me</span>
                            </div>
                            <Link to={"/forgor-password"} onClick={()=>alert("Sucks to be you!")} className="mt-2.5 text-[white] block">Forgor password?</Link>
                            <Button type={"submit"} styleType={"filled"} className="mt-[35px]">Login</Button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    )
}