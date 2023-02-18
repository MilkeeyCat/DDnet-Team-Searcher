import registrationSuccessful from "../../assets/images/successful-register.png"
import {Field, Form, Formik, FormikHelpers} from "formik"
import {Input} from "../../components/Input"
import {Button} from "../../components/ui/Button"
import {composeValidators} from "../../utils/composeValidators"
import {required} from "../../utils/validators/required"
import {maxLength} from "../../utils/validators/maxLength"
import {email} from "../../utils/validators/email"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import classNames from "classnames"
import defaultTee from "../../assets/images/voxel.png"
import {useAppDispatch} from "../../utils/hooks/hooks"
import { hint } from "../../store/slices/hints"
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
                dispatch(hint({type: "error", text: error}))
            }
        }
    }

    return (
        <>
            <div className={`mb-[150px] bg-[url("/src/assets/images/register-page-background.png")] h-[1028px]`}>
                <div className={"pt-[120px] max-w-fit mx-auto"}>
                    <p className={classNames("text-4xl text-[white]", {"hidden": currentStep === 3})}>Create your account<br/> and become the part of
                        the <s className="text-primary-1">community.</s></p>
                    <Formik initialValues={initialValues} validateOnBlur={true} validate={validation}
                            onSubmit={onSubmit}>
                        <Form className={"max-w-[860px] mx-auto mt-[100px]"}>
                            <div className={`flex overflow-hidden [&>*]:min-w-full [&>*]:transition-all`}>
                                <div style={{transform: `translateX(-${(currentStep-1)*100}%)`}}> {/* First Step */}
                                    <div className={"max-w-[600px] mx-auto"}>
                                        <div className={"flex justify-between"}>
                                            <Field autoComplete={"off"} name={"username"} placeholder={"Username"}
                                                   component={Input}/>
                                            <Field autoComplete={"off"} name={"email"} placeholder={"Email"}
                                                   component={Input}/>
                                        </div>
                                        <div className={"flex justify-between mt-[60px]"}>
                                            <Field autoComplete={"off"} name={"password"} type={"password"} placeholder={"Password"}
                                                   component={Input}/>
                                            <Field autoComplete={"off"} name={"confirmPassword"}
                                                   placeholder={"Confirm password"}
                                                   type={"password"}
                                                   component={Input}/>
                                        </div>
                                        <Button styleType={"filled"}
                                                className="mt-9 ml-auto"
                                                onClick={() => setCurrentStep(2)}
                                                tabIndex={1}>Next</Button>
                                    </div>
                                </div>
                                <div style={{transform: `translateX(-${(currentStep-1)*100}%)`}}> {/* Second Step */}
                                    <div className={"max-w-[600px] mx-auto"}>
                                        <div className={"tier-selection"}>
                                            <p className={"font-medium text-3xl mb-[70px] text-[white] text-center"}>Select a tier you think in:</p>
                                            <div className={"relative max-w-[560px] mx-auto flex flex-col"}>
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
                                                       className={"max-w-[534px] w-full z-10 block mx-auto rounded-full bg-[#636363] bg-gradient-to-r from-primary-1 to-primary-1 bg-no-repeat bg-[length:100%_100%] h-[5px] appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[16px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-1"} component={"input"}/>
                                                 <div className="flex w-full justify-between mt-1">
                                                    {tiers.map((thing, id) => (
                                                        <div className="flex flex-col items-center">
                                                            <p className={classNames("text-[white] text-[12px]", {"text-primary-1": currentTierId == id})}>{thing[1]}</p>
                                                            <img src={thing[0]} alt="xD" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={"pt-[30px] text-[white]"}>
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
                                            <div className="flex justify-between mt-[50px]">
                                                <Button styleType={"bordered"}
                                                        onClick={() => setCurrentStep(1)}>Back</Button>
                                                <Button type={"submit"} styleType={"filled"}>Finish!</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{transform: `translateX(-${(currentStep-1)*100}%)`}}>
                                    <div className="text-[white] p-10 bg-[#24201A] rounded-[20px] mt-[200px]">
                                        <div className="flex items-center">
                                            <div>
                                                <p className="text-3xl font-medium">Your account successfully
                                                    been created.</p>
                                                <p>We(I) sent an email
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