import loginPageBackground from "../../assets/images/login-page-background.png"
import {Field, Form, Formik, FormikHelpers} from "formik"
import {Input} from "../../components/Input"
import {Button} from "../../components/ui/Button"
import {Link} from "react-router-dom"
import {Checkbox} from "../../components/Checkbox"
import {useNavigate} from "react-router-dom"
import {useAppDispatch} from "../../utils/hooks/hooks"
import {composeValidators} from "../../utils/composeValidators"
import {required} from "../../utils/validators/required"
import {maxLength} from "../../utils/validators/maxLength"
import {addHint} from "../../store/slices/hints"
import { LoginForm } from "../../types/LoginForm.type"
import { useLoginUserMutation } from "../../api/users-api"
import { setIsAuthed } from "../../store/slices/app"

import "./styles.scss"

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
        } catch (err: any) {
            const error = err.data.message

            if(typeof error === "object") {
                setFieldError(error.field, error.text)
            } else {
                dispatch(addHint({type: "error", text: error}))
            }            
        }      
    }

    return (
        <>
            <div className={"login-form-wrapper"}>
                <img src={loginPageBackground} alt=""/>
                <div className="login-form-wrapper__inner">
                    <p className="login-form-wrapper__header">Login in your account<br/> and <span
                        className={"selected-text"}>something</span> will happen.</p>
                    <Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
                        <Form className={"login-form"}>
                            <div className={"login-form__row"}>
                                <Field autoComplete={"off"} name={"username"} placeholder={"Username"} component={Input}/>
                                <Field autoComplete={"off"} name={"password"} placeholder={"Password"} type={"password"} component={Input}/>
                            </div>
                            <div className={"login-form__remember-me"}>
                                <Field name={"rememberMe"} as={Checkbox}/>
                                <span>Remember me</span>
                            </div>
                            <Link to={"/forgor-password"} onClick={()=>alert("Sucks to be you!")} className={"login-form__forgor-password"}>Forgor password?</Link>
                            <Button type={"submit"} styleType={"filled"} className={"login-form__btn"}>Login</Button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    )
}