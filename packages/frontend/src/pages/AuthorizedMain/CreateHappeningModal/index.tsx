import { Field, Form, Formik, FormikHelpers } from "formik"
import { useRef, useState } from "react"
import { useCreateEventMutation, useCreateRunMutation } from "../../../api/happenings-api"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import { setIsCreateEventModalHidden, setIsCreateRunModalHidden } from "../../../store/slices/app"
import { addHint } from "../../../store/slices/hints"
import { CreateEventForm } from "../../../types/CreateEventForm.type"
import { CreateRunForm } from "../../../types/CreateRunForm.type"
import { composeValidators } from "../../../utils/composeValidators"
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/hooks"
import { required } from "../../../utils/validators/required"
import { InputWithLabel } from "../InputWithLabel"
import { RadioInput } from "../RadioInput"
import { TextareaWithLabel } from "../TextareaWithLabel"

type OwnProps = {
    isVisible: boolean;
    onClose: () => void;
    type: "run" | "event";
}

const gimmeInitialValues = <T extends string = "run" | "event">(type: T): T extends "run" ? CreateRunForm : CreateEventForm => {
    if(type == "run") {
        return {
            place: null,
            mapName: "",
            teamSize: "",
            runStartDate: new Date().toISOString().substring(0, 10),
            runStartTime: new Date().toLocaleTimeString(navigator.language, {hour12: false}).substring(0, 5),
            description: ""
        } as T extends "run" ? CreateRunForm : CreateEventForm
    } else {
        return {
            place: null,
            mapName: "",
            teamSize: "",
            eventStartDate: new Date().toISOString().substring(0, 10),
            eventStartTime: new Date().toLocaleTimeString(navigator.language, {hour12: false}).substring(0, 5),
            eventEndDate: "",
            eventEndTime: "",
            description: "",
            thumbnail: ""
        } as T extends "run" ? CreateRunForm : CreateEventForm
    }
}

export const CreateHappeningModal = ({type, isVisible, onClose}: OwnProps) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [createRun] = useCreateRunMutation()
    const [createEvent] = useCreateEventMutation()
    const dispatch = useAppDispatch()
    const availableMaps = useAppSelector(state => state.app.maps)
    const ref = useRef<null | HTMLInputElement>(null)
    const [isEndFieldsVisible, setIsEndFieldsVisible] = useState(false)

    type Happening = CreateEventForm | CreateRunForm

    const initialValues = gimmeInitialValues(type)

    const validatePlaceField = (value: string | number | null) => composeValidators(value, [required])
    const validateTeamsizeField = (value: string | number) => composeValidators(value, [required])
    const validateMapNameField = (value: string | number) => composeValidators(value, [required])

    const validation = (values: Happening) => {
        const errors: { [key in keyof Partial<CreateRunForm>]: any } = {}

        const placeField = validatePlaceField(values.place)
        const teamSizeField = validateTeamsizeField(values.teamSize)
        const mapNameField = validateMapNameField(values.mapName)

        if (placeField) errors.place = placeField
        if (teamSizeField) errors.teamSize = teamSizeField
        if (mapNameField) errors.mapName = mapNameField

        if (!Object.keys(errors).length) setIsSubmitButtonDisabled(false)
        else setIsSubmitButtonDisabled(true)

        return errors
    }

    const onSubmit = async (values: Happening, {resetForm}: FormikHelpers<Happening>) => {
        try {
            let res

            if(type == "run") { // I will send a run
                res = await createRun(values as CreateRunForm).unwrap()

                dispatch(setIsCreateRunModalHidden(true))
            } else { // I will send an event
                const formData = new FormData()

                Object.keys(values).map((key) => {
                    formData.append(key, values[key as keyof Happening] || "")
                })

                res = await createEvent(formData).unwrap()
    
                dispatch(setIsCreateEventModalHidden(true))
            }

            resetForm()
            
            if(typeof res.data === "string") {
                dispatch(addHint({type: "success", text: res.data}))
            } else {
                // idk what to do here xD
            }
        } catch (err: any) {
            if("data" in err) {
                if(typeof err.data === "string") {
                    dispatch(addHint({type: "error", text: err.data}))
                } else {
                    // show an error above fields
                }
            }
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEndFieldsVisible(e.target.checked)
    }

    return (
        <Modal className={"create-run"} visible={isVisible} onClose={onClose} width={"600px"}>
            <p className="text-3xl m-0 pt-6 px-5">Create your own {type}</p>
            <Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
                <Form>
                    <div className="px-6">
                        <div>
                            <p className="text-xl mt-5" style={{"margin": "40px 0 0"}}>Where's your {type}?</p>
                            <p className={"text-sm mt-1 opacity-[.87]"}>So noone gets lost on where to go?</p>
                            <Field component={RadioInput} value={0} name={"place"} id={"own"}
                                   title={"Our own servers."}
                                   subtitle={"You will have less change to get ddosed."}/>
                            <Field component={RadioInput} value={1} name={"place"} id={"others"}
                                   title={"Somewhere else."}
                                   subtitle={"You can get team and go play on official DDnet servers."}/>
                        </div>
                        <div>
                            <p className={"text-xl mt-5"}>Tell us more about your {type}</p>
                            <p className={"text-sm mt-1 opacity-[.87]"}>Fill fields down below!</p>
                            <div className="flex justify-between mt-4">
                                <Field className="max-w-[256px] w-full" name="mapName" label="map name" datalist={availableMaps.map(map => map.name)}
                                       id="mapName" placeholder={"Map you're gonna play?"} required component={InputWithLabel}/>
                                <Field className="max-w-[256px] w-full" name="teamSize" label="team size" type={"number"} id="teamSize"
                                       placeholder={"What team size do you want?"} required
                                       component={InputWithLabel}/>
                            </div>
                            <div className="flex justify-between mt-4 w-full">
                                <Field className="max-w-[256px] w-full" name={`${type}StartDate`} label={`${type} start date`} type={"date"} id={`${type}StartDate`}
                                       required component={InputWithLabel}/>
                                <Field className="max-w-[256px] w-full" name={`${type}StartTime`} pattern="[0-9]{2}:[0-9]{2}" label={`${type} start time`}
                                       type={"time"} id={`${type}StartTime`} required component={InputWithLabel}/>
                            </div>
                        </div>
                        { type == "event" &&
                            <div className="mt-5 flex content-center">
                                <input onChange={onChange} className="appearance-none w-4 h-4 bg-[rgba(0,0,0,.45)] bordered-[2px] checked:bg-[url('src/assets/images/check-mark.png')] bg-no-repeat bg-center" id="show-end-fields" type="checkbox"/>
                                <label htmlFor="show-end-fields" className="text-[12px] uppercase ml-2.5">add end date & time</label>
                            </div>
                        }
                        { type == "event" && isEndFieldsVisible &&
                            <div className="flex justify-between mt-4">
                                <Field className="max-w-[256px] w-full" name="eventEndDate" label="event end date" type={"date"} id="eventEndDate"
                                    required component={InputWithLabel}/>
                                <Field className="max-w-[256px] w-full" name="eventEndTime" pattern="[0-9]{2}:[0-9]{2}" label="event end time"
                                    type={"time"} id="eventEndTime" required component={InputWithLabel}/>
                            </div>
                        }
                        <Field label={"description"} className="mt-5 [&_textarea]:resize-none" name={"description"}
                               placeholder={"Here you can describe a teammate of dream, are weebs people or whatever you want"}
                               component={TextareaWithLabel}/>
                        { type == "event" &&
                            <div>
                                <div>
                                    <label htmlFor="coverImage" className="uppercase mt-[15px] text-[12px]">Cover image</label>
                                    <Field component={({form: {setFieldValue}}: any) => {
                                        return <input ref={ref} id="coverImage" onChange={(e) => {
                                            if(e?.target?.files?.length) {
                                                setFieldValue("thumbnail", e.target.files[0])
                                            }
                                        }} type="file" style={{display: "none"}}/>
                                    }}/>
                                    <Button className="mt-2.5" onClick={()=>ref?.current?.click()} type="button" styleType="filled">Upload cover image</Button>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="flex justify-between mt-6 px-5 py-6 bg-[#1A1714] rounded-b-[10px]">
                        <Button styleType={"bordered"}
                                onClick={onClose}>Close</Button>
                        <Button styleType={"filled"} type={"submit"} disabled={isSubmitButtonDisabled}>Create {type}</Button>
                    </div>
                </Form>
            </Formik>
        </Modal>
    )
}