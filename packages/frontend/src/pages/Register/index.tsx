import registerPageBackground from "../../assets/images/register-page-background.png"
import registrationSuccessful from "../../assets/images/successful-register.png"
import {Field, Form, Formik, FormikHelpers} from "formik"
import {Input} from "../../components/Input"
import {Button} from "../../components/ui/Button"

import "./styles.scss"
import {composeValidators} from "../../utils/composeValidators"
import {required} from "../../utils/validators/required"
import {maxLength} from "../../utils/validators/maxLength"
import {email} from "../../utils/validators/email"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import classNames from "classnames"

import defaultTee from "../../assets/images/voxel.png"
import {useAppDispatch} from "../../utils/hooks/hooks"
// import {register} from "../../store/thunks/app"
import {addHint} from "../../store/slices/hints"
import { useRegisterUserMutation } from "../../api/users-api"
import { RegistrationForm } from "../../types/RegistrationForm.type"

export const Register = () => {
    const [registerUser, registerUserResult] = useRegisterUserMutation()


    const [userEmail, setUserEmail] = useState<null | string>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [currentTierId, setCurrentTierId] = useState(0)
    const [isFormValid, setIsFormValid] = useState<null | boolean>(null)
    const initialValues: RegistrationForm = {username: "", email: "", password: "", confirmPassword: "", tier: 0}
    const tiers: [string, string][] = [[defaultTee, "F Tier"], [defaultTee, "E Tier"], [defaultTee, "D Tier"], [defaultTee, "C Tier"], [defaultTee, "B Tier"], [defaultTee, "A Tier"], [defaultTee, "S Tier ☠"]]
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const validateUsernameField = (value: string | number) => composeValidators(value, [required, maxLength(50)])
    const validateEmailField = (value: string | number) => composeValidators(value, [required, email, maxLength(50)])
    const validatePasswordField = (value: string | number) => composeValidators(value, [required, maxLength(50)])

    useEffect(() => {
        if(!isFormValid && currentStep === 2) {
            setCurrentStep(1)
            setIsFormValid(null)
        }
    }, [isFormValid])

    const validation = (values: RegistrationForm) => {
        const errors: { [key: string]: any } = {}

        const usernameField = validateUsernameField(values.username)
        const emailField = validateEmailField(values.email)
        const passwordField = validatePasswordField(values.password)
        const confirmPasswordField = validatePasswordField(values.password)

        if (usernameField) errors.username = usernameField
        if (emailField) errors.email = emailField
        if (passwordField) errors.password = passwordField
        if (confirmPasswordField) errors.confirmPassword = confirmPasswordField

        if(Object.keys(errors).length && currentStep === 2) {
            setIsFormValid(false)
        }

        return errors
    }

    const onSubmit = async (values: RegistrationForm, {setFieldError}: FormikHelpers<RegistrationForm>) => {
        if(currentStep !== 2) {
            setCurrentStep(2)
            return
        }

        const {confirmPassword, ...data} = values

        try {
            const res = await registerUser(data).unwrap()
            
            setCurrentStep(3)
            setUserEmail(values.email)
        } catch (err: any) {
            let error = err.data.message
            
            if(typeof error === "object") {
                setFieldError(error.field, error.text)
            } else {
                setCurrentStep(1)
                dispatch(addHint({type: "error", text: error}))
            }
        }
    }

    return (
        <>
            <div className={"register-form-wrapper"}>
                <img src={registerPageBackground}/>
                <div className={"register-form-wrapper__inner"}>
                    <p className={classNames("register-form-wrapper__header", {"hidden": currentStep === 3})}>Create your account<br/> and become the part of
                        the <span
                            className={"selected-text"}><s>community.</s></span></p>
                    <Formik initialValues={initialValues} validateOnBlur={true} validate={validation}
                            onSubmit={onSubmit}>
                        <Form className={"register-form"}>
                            <div className={`register-form-wrapper__steps register-form-wrapper__step-${currentStep}`}>
                                <div> {/* First Step */}
                                    <div className={"register-form-wrapper__step-narrow"}>
                                        <div className={"register-form__row"}>
                                            <Field autoComplete={"off"} name={"username"} placeholder={"Username"}
                                                   component={Input}/>
                                            <Field autoComplete={"off"} name={"email"} placeholder={"Email"}
                                                   component={Input}/>
                                        </div>
                                        <div className={"register-form__row"}>
                                            <Field autoComplete={"off"} name={"password"} type={"password"} placeholder={"Password"}
                                                   component={Input}/>
                                            <Field autoComplete={"off"} name={"confirmPassword"}
                                                   placeholder={"Confirm password"}
                                                   type={"password"}
                                                   component={Input}/>
                                        </div>
                                        <Button styleType={"filled"}
                                                className={"register-form__btn"}
                                                onClick={() => setCurrentStep(2)}
                                                tabIndex={1}>Next</Button>
                                    </div>
                                </div>

                                <div> {/* Second Step */}
                                    <div className={"register-form-wrapper__step-narrow"}>
                                        <div className={"tier-selection"}>
                                            <p className={"tier-selection__header"}>Select a tier you think in:</p>
                                            <div className={"tier-selection__slider-wrapper"}>
                                                <Field onInput={(e: KeyboardEvent) => {
                                                    let target = e.target
                                                    //@ts-ignore
                                                    if (e?.target?.type !== "range") {
                                                        target = document.getElementById("range")
                                                    }
                                                    //@ts-ignore
                                                    const min = target?.min
                                                    //@ts-ignore
                                                    const max = target?.max
                                                    //@ts-ignore
                                                    const val = target?.value

                                                    setCurrentTierId(val)

                                                    //@ts-ignore
                                                    target.style.backgroundSize = (val - min) * 100 / (max - min) + "% 100%"

                                                }} type={"range"} name={"tier"} step={1} min={0} max={6}
                                                       className={"tier-selection__slider"} component={"input"}/>

                                                <div className={"tier-selection__slider-data"}>
                                                    {[...new Array(7)].map((_, id) => {
                                                        return (
                                                            <div>
                                                                <img src={tiers[id][0]}/>
                                                                <span
                                                                    className={classNames({"tier-selection__slider-data_highlight-fill": currentTierId > id})}/>
                                                                <p className={classNames({"tier-selection__slider-data_highlight": currentTierId == id})}>{tiers[id][1]}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className={"tier-selection__description"}>
                                                <p>Short description of {tiers[currentTierId][1]}:</p>
                                                <p className={classNames({"hidden": currentTierId != 0})}>Lorem ipsum
                                                    dolor
                                                    sit amet, consectetur adipisicing elit. Ad animi aperiam
                                                    consequuntur
                                                    culpa delectus dignissimos error, esse est ex fuga illo iusto libero
                                                    non
                                                    quisquam sapiente tempore voluptates! Atque distinctio impedit iure
                                                    molestiae necessitatibus quam quidem repudiandae. Assumenda atque
                                                    autem
                                                    corporis debitis deserunt dolorem illum itaque laudantium
                                                    necessitatibus
                                                    odio odit, quis quod rem, vel vero. Assumenda culpa error facilis
                                                    harum
                                                    laudantium nam odit optio temporibus ullam vitae? Autem cupiditate
                                                    illo
                                                    maiores necessitatibus omnis? Alias delectus error excepturi
                                                    exercitationem nemo perferendis, perspiciatis qui quia voluptas. Ad
                                                    alias atque aut, delectus, expedita in inventore molestias nam neque
                                                    odit perferendis, porro qui tenetur.</p>
                                                <p className={classNames({"hidden": currentTierId != 1})}>esse est ex
                                                    fuga
                                                    illo iusto libero non quisquam sapiente tempore voluptates! Atque
                                                    distinctio impedit iure molestiae necessitatibus quam quidem
                                                    repudiandae. Assumenda atque autem corporis debitis deserunt dolorem
                                                    illum itaque laudantium necessitatibus odio odit, quis quod rem, vel
                                                    vero. Assumenda culpa error facilis harum laudantium nam odit optio
                                                    temporibus ullam vitae? Autem cupiditate illo maiores necessitatibus
                                                    omnis? Alias delectus error excepturi exercitationem nemo
                                                    perferendis,
                                                    perspiciatis qui quia voluptas. Ad alias atque aut, delectus,
                                                    expedita
                                                    in inventore molestias nam neque odit perferendis, porro qui
                                                    tenetur.</p>
                                                <p className={classNames({"hidden": currentTierId != 2})}>Lorem ipsum
                                                    dolor
                                                    sit amet, consectetur adipisicing elit. autem corporis debitis
                                                    deserunt
                                                    dolorem illum itaque laudantium necessitatibus odio odit, quis quod
                                                    rem,
                                                    vel vero. Assumenda culpa error facilis harum laudantium nam odit
                                                    optio
                                                    temporibus ullam vitae? Autem cupiditate illo maiores necessitatibus
                                                    omnis? Alias delectus error excepturi exercitationem nemo
                                                    perferendis,
                                                    perspiciatis qui quia voluptas. Ad alias atque aut, delectus,
                                                    expedita
                                                    in inventore molestias nam neque odit perferendis, porro qui
                                                    tenetur.</p>
                                                <p className={classNames({"hidden": currentTierId != 3})}>Lorem ipsum
                                                    dolor
                                                    sit amet, consectetur adipisicing elit. Ad animi aperiam
                                                    consequuntur
                                                    culpa delectus dignissimos error, esse est ex fuga illo iusto libero
                                                    non
                                                    quisquam sapiente tempore voluptates! Atque distinctio impedit iure
                                                    molestiae necessitatibus quam quidem repudiandae. Assumenda atque
                                                    autem
                                                    corporis debitis deserunt dolorem illum itaque laudantium
                                                    necessitatibus
                                                    odio odit, quis quod rem, vel vero. Assumenda culpa error facilis
                                                    harum
                                                    laudantium nam odit optio temporibus ullam vitae? Autem cupiditate
                                                    illo
                                                    maiores necessitatibus omnis? Alias delectus error excepturi
                                                    exercitationem nemo perferendis, perspiciatis qui quia voluptas. Ad
                                                    alias atque aut, delectus, expedita in inventore molestias nam neque
                                                    odit perferendis, porro qui tenetur.</p>
                                                <p className={classNames({"hidden": currentTierId != 4})}>Lorem ipsum
                                                    dolor
                                                    sit a debitis deserunt dolorem illum itaque laudantium
                                                    necessitatibus
                                                    odio odit, quis quod rem, vel vero. Assumenda culpa error facilis
                                                    harum
                                                    laudantium nam odit optio temporibus ullam vitae? Autem cupiditate
                                                    illo
                                                    maiores necessitatibus omnis? Alias delectus error excepturi
                                                    exercitationem nemo perferendis, perspiciatis qui quia voluptas. Ad
                                                    alias atque aut, delectus, expedita in inventore molestias nam neque
                                                    odit perferendis, porro qui tenetur.</p>
                                                <p className={classNames({"hidden": currentTierId != 5})}>Lorem ipsum
                                                    dolor
                                                    sit amet, consectetur adipisicing elit. Ad animi aperiam laudantium
                                                    necessitatibus odio odit, quis quod rem, vel vero. Assumenda culpa
                                                    error
                                                    facilis harum laudantium nam odit optio temporibus ullam vitae?
                                                    Autem
                                                    cupiditate illo maiores necessitatibus omnis? Alias delectus error
                                                    excepturi exercitationem nemo perferendis, perspiciatis qui quia
                                                    voluptas. Ad alias atque aut, delectus, expedita in inventore
                                                    molestias
                                                    nam neque odit perferendis, porro qui tenetur.</p>
                                                <p className={classNames({"hidden": currentTierId != 6})}>Lorem ipsum
                                                    dolor
                                                    sit amet, consectetur adipisicing elit. Ad animi aperiam
                                                    consequuntur
                                                    culpa delectus dignissimos error, esse est e temporibus ullam vitae?
                                                    Autem cupiditate illo maiores necessitatibus omnis? Alias delectus
                                                    error
                                                    excepturi exercitationem nemo perferendis, perspiciatis qui quia
                                                    voluptas. Ad alias atque aut, delectus, expedita in inventore
                                                    molestias
                                                    nam neque odit perferendis, porro qui tenetur.</p>
                                                <p>If you will fucking try to choose much higher tier than you are. I
                                                    will
                                                    find your family. So dont do it. Save my and your time :)</p>
                                            </div>

                                            <div className="tier-selection__footer">
                                                <Button styleType={"bordered"}
                                                        onClick={() => setCurrentStep(1)}>Back</Button>
                                                <Button type={"submit"} styleType={"filled"}>Finish!</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className={"registration-successful"}>
                                        <div className="registration-successful__row">
                                            <div>
                                                <p className="registration-successful__header">Your account successfully
                                                    been created.</p>
                                                <p className="registration-successful__description">We(I) sent an email
                                                    message to {userEmail}. Go to link in message and
                                                    verify your account.(actually i didnt send any email but if i will
                                                    host
                                                    it one day. i will be sending emails to verify accounts)</p>
                                            </div>
                                            <img src={registrationSuccessful}/>
                                        </div>
                                        <Button styleType={"filled"} onClick={() => navigate("/login")}>Go to login page</Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    )
}

// return (
//     <>
//         <div className={"register-form-wrapper"}>
//             <img src={registerPageBackground}/>
//             <div className={"register-form-wrapper__inner"}>
//                 <p className={"register-form-wrapper__header"}>Create your account<br/> and become the part of
//                     the <span
//                         className={"selected-text"}>community.</span></p>
//                 <div className={`register-form-wrapper__steps register-form-wrapper__step-${currentStep}`}>
//                     <div> {/* First Step */}
//                         <Formik initialValues={initialValues} validateOnBlur={true} validate={validation}
//                                 onSubmit={(values) => {
//                                     alert("Im gonna try to log in you!")
//                                     setCurrentStep(2)
//                                 }}>
//                             <Form className={"register-form"}>
//                                 <div className={"register-form__row"}>
//                                     <Field name={"username"} placeholder={"Username"} component={Input}/>
//                                     <Field name={"email"} placeholder={"Email"} component={Input}/>
//                                 </div>
//                                 <div className={"register-form__row"}>
//                                     <Field name={"password"} placeholder={"Password"} component={Input}/>
//                                     <Field name={"confirmPassword"} placeholder={"Confirm password"}
//                                            type={"password"}
//                                            component={Input}/>
//                                 </div>
//                                 <Button type={"submit"} styleType={"filled"}
//                                         className={"register-form__btn"}>Next</Button>
//                             </Form>
//                         </Formik>
//                     </div>
//                     <div> {/* Second Step */}
//                         <div className={"tier-selection"}>
//                             <p className={"tier-selection__header"}>Select a tier you think in:</p>
//
//                             <input type="range" step={20}/>
//
//                             <div className="tier-selection__footer">
//                                 <Button styleType={"bordered"} onClick={() => setCurrentStep(1)}>Back</Button>
//                                 <Button styleType={"filled"}>Finish!</Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </>
// )