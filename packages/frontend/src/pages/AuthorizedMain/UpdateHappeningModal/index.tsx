import { Field, Form, Formik, FormikHelpers } from "formik"
import { useRef, useState } from "react"
import { useCreateEventMutation, useUpdateEventMutation, useUpdateRunMutation } from "../../../api/happenings-api"
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

type OwnProps<T extends string = "run" | "event"> = {
    isVisible: boolean;
    onClose: () => void;
    type: T;
    happeningId: number;
}

const gimmeInitialValues = <T extends string = "run" | "event">(type: T, happeningId: number): T extends "run" ? CreateRunForm : CreateEventForm => {
    if(type == "run") {
        const {place, map_name, teamsize, start_at, description} = useAppSelector(state => state.happeningsReducer.runs).find(happening => happening.id === happeningId)!

        return {
            place: place.toString(),
            mapName: map_name,
            teamSize: teamsize.toString(),
            runStartDate: new Date(start_at).toISOString().substring(0, 10),
            runStartTime: new Date(start_at).toLocaleTimeString(navigator.language, {hour12: false}).substring(0, 5),
            description
        } as T extends "run" ? CreateRunForm : CreateEventForm
    } else {
        const {place, map_name, teamsize, start_at, description, end_at} = useAppSelector(state => state.happeningsReducer.events).find(happening => happening.id === happeningId)!

        return {
            place: place.toString(),
            mapName: map_name,
            teamSize: teamsize.toString(),
            eventStartDate: new Date(start_at).toISOString().substring(0, 10),
            eventStartTime: new Date(start_at).toLocaleTimeString(navigator.language, {hour12: false}).substring(0, 5),
            eventEndDate: end_at ? new Date(end_at).toISOString().substring(0, 10) : "",
            eventEndTime: end_at ? new Date(end_at).toLocaleTimeString(navigator.language, {hour12: false}).substring(0, 5) : "",
            description,
            thumbnail: ""
        } as T extends "run" ? CreateRunForm : CreateEventForm
    }
}

export const UpdateHappeningModal = ({type, isVisible, onClose, happeningId}: OwnProps) => {
    type Happening = CreateEventForm | CreateRunForm

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [updateRun] = useUpdateRunMutation()
    const [updateEvent] = useUpdateEventMutation()
    const dispatch = useAppDispatch()
    const availableMaps = useAppSelector(state => state.app.maps)
    const ref = useRef<null | HTMLInputElement>(null)
    const initialValues = gimmeInitialValues(type, happeningId)
    const [isEndFieldsVisible, setIsEndFieldsVisible] = useState(!!(initialValues as CreateEventForm).eventEndDate)

    const validatePlaceField = (value: string | number | null) => composeValidators(value, [required])
    const validateTeamsizeField = (value: string | number) => composeValidators(value, [required])
    const validateMapNameField = (value: string | number) => composeValidators(value, [required])

    const validation = (values: Happening) => {
        console.log(values.place);

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

            if(type == "run") {
                res = await updateRun({
                    happening: values as CreateRunForm,
                    id: happeningId
                }).unwrap()

                dispatch(setIsCreateRunModalHidden(true))
            } else {
                const formData = new FormData()

                Object.keys(values).map((key) => {
                    formData.append(key, values[key as keyof Happening] || "")
                })
    
                res = await updateEvent({
                    id: happeningId,
                    happening: formData
                }).unwrap()
    
                dispatch(setIsCreateEventModalHidden(true))
            }

            resetForm()
            
            if(typeof res.data === "string") {
                dispatch(addHint({type: "success", text: res.data}))
            } else {
                // idk what to do here xD
            }
        } catch (err: any) {
            console.log(err);
            

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

            <p className="text-3xl m-0 pt-6 px-5">Update your {type}</p>
            <Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
                {({values}) => (
                    <Form>
                        <div className="px-6">
                            <div>
                                <p className="text-xl mt-5" style={{"margin": "40px 0 0"}}>Where's your {type}?</p>
                                <p className={"text-sm mt-1 opacity-[.87]"}>So noone gets lost on where to go?</p>
                                <Field component={RadioInput} value={0} checked={values.place == "0"} name={"place"} id={"own"}
                                    title={"Our own servers."}
                                    subtitle={"You will have less change to get ddosed."}/>
                                <Field component={RadioInput} value={1} checked={values.place == "1"} name={"place"} id={"others"}
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
                                    <input onChange={onChange} checked={isEndFieldsVisible} className="appearance-none w-4 h-4 bg-[rgba(0,0,0,.45)] bordered-[2px] checked:bg-[url('src/assets/images/check-mark.png')] bg-no-repeat bg-center" id="show-end-fields" type="checkbox"/>
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
                )}
            </Formik>
        </Modal>
    )
}