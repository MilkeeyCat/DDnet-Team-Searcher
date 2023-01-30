import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useRef, useState } from "react";
import { useCreateEventMutation } from "../../../api/events-api";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal"
import { setIsCreateEventModalHidden } from "../../../store/slices/app";
import { addHint } from "../../../store/slices/hints";
import { composeValidators } from "../../../utils/composeValidators";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/hooks";
import { required } from "../../../utils/validators/required";
import { InputWithLabel } from "../InputWithLabel";
import { RadioInput } from "../RadioInput";
import { TextareaWithLabel } from "../TextareaWithLabel";
import { CreateEventForm } from "../../../types/CreateEventForm.type";
import "./styles.scss"

interface OwnProps {
    isVisible: boolean;
    onClose: () => void
}

export const CreateEventModal = ({isVisible, onClose}: OwnProps) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [isEndFieldsVisible, setIsEndFieldsVisible] = useState(false)
    const [createEvent] = useCreateEventMutation()
    const ref = useRef<null | HTMLInputElement>(null)
    const dispatch = useAppDispatch()
    const availableMaps = useAppSelector(state => state.app.maps)

    const initialValues: CreateEventForm = {
        place: null,
        mapName: "",
        teamSize: "",
        eventStartDate: new Date().toISOString().substring(0, 10),
        eventStartTime: new Date().toLocaleTimeString(navigator.language, {hour12: false}).substring(0, 5),
        eventEndDate: "",
        eventEndTime: "",
        description: "",
        thumbnail: ""
    }

    const validatePlaceField = (value: string | number | null) => composeValidators(value, [required])
    const validateTeamsizeField = (value: string | number) => composeValidators(value, [required])
    const validateMapNameField = (value: string | number) => composeValidators(value, [required])

    const validation = (values: CreateEventForm) => {
        const errors: { [key in keyof Partial<CreateEventForm>]: string } = {}

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

    const onSubmit = async (values: CreateEventForm, {resetForm}: FormikHelpers<CreateEventForm>) => {
        try {
            const formData = new FormData()

            Object.keys(values).map((key) => {
                //@ts-ignore
                formData.append(key, values[key as keyof CreateEventForm])
            })

            const res = await createEvent(formData)

            resetForm()
            dispatch(setIsCreateEventModalHidden(true))
            //@ts-ignore TODO: NO TYPES HERE :\
            dispatch(addHint({type: "success", text: res.message}))
        } catch (err: any) { //TODO: still error type missing (╯▽╰ )
            dispatch(addHint({type: "error", text: err.message}))
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEndFieldsVisible(e.target.checked)
    }

    return (
        <Modal className={"create-event"} visible={isVisible} onClose={onClose} width={"560px"}>

            <p className={"create-event__title"}>Create your own event</p>
            <Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
                    <Form>
                        <div className="create-event__form-header">
                            <div className={"create-event__form-place-wrapper"}>
                                <p className={"create-event__form-title"} style={{"margin": "40px 0 0"}}>Where's your
                                    event?</p>
                                <p className={"create-event__form-subtitle"}>So noone gets lost on where to go?</p>
                                <Field component={RadioInput} value={0} name={"place"} id={"own"}
                                    title={"Our own servers."}
                                    subtitle={"You will have less change to get ddosed."}/>
                                <Field component={RadioInput} value={1} name={"place"} id={"others"}
                                    title={"Somewhere else."}
                                    subtitle={"You can get team and go play on official DDnet servers."}/>
                            </div>
                            <div>
                                <p className={"create-event__form-title"}>Tell us more about your event</p>
                                <p className={"create-event__form-subtitle"}>Fill fields down below!</p>
                                <div className="create-event__form-row">
                                    <Field name="mapName" label="map name" datalist={availableMaps.map(map => map.name)}
                                        id="mapName" placeholder={"Map you're gonna play?"} required component={InputWithLabel}/>
                                    <Field name="teamSize" label="team size" type={"number"} id="teamSize"
                                        placeholder={"What team size do you want?"} required
                                        component={InputWithLabel}/>
                                </div>
                                <div className="create-event__form-row">
                                    <Field name="eventStartDate" label="event start date" type={"date"} id="eventStartDate"
                                        required component={InputWithLabel}/>
                                    <Field name="eventStartTime" pattern="[0-9]{2}:[0-9]{2}" label="event start time"
                                        type={"time"} id="eventStartTime" required component={InputWithLabel}/>
                                </div>
                                <div className="create-event__add-end-event-data">
                                    <input onChange={onChange} id="show-end-fields" type="checkbox"/>
                                    <label htmlFor="show-end-fields">add end date & time</label>
                                </div>
                                { isEndFieldsVisible &&
                                <div className="create-event__form-row">
                                    <Field name="eventEndDate" label="event end date" type={"date"} id="eventEndDate"
                                        required component={InputWithLabel}/>
                                    <Field name="eventEndTime" pattern="[0-9]{2}:[0-9]{2}" label="event end time"
                                        type={"time"} id="eventEndTime" required component={InputWithLabel}/>
                                </div> }
                            </div>
                            <Field label={"description"} className={"create-event__form-description"} name={"description"}
                                placeholder={"Here you can describe a teammate of dream, are weebs people or whatever you want"}
                                component={TextareaWithLabel}/>
                            <div>
                                <div>
                                    <label htmlFor="kek">COVER IMAGE</label>
                                    <Field component={({form: {setFieldValue}}: any) => {

                                        return <input ref={ref} onChange={(e) => {
                                            if(e?.target?.files?.length) {
                                                setFieldValue("thumbnail", e.target.files[0])
                                            }
                                        }} type="file" style={{display: "none"}}/>
                                    }}/>
                                    <Button onClick={()=>ref?.current?.click()} type="button" styleType="filled">Upload cover image</Button>
                                </div>
                                
                            </div>
                        </div>
                        <div className={"create-event__form-footer"}>
                            <Button styleType={"bordered"}
                                    onClick={onClose}
                                    >Close</Button>
                            <Button styleType={"filled"} type={"submit"} disabled={isSubmitButtonDisabled}>Create event</Button>
                        </div>
                    </Form>
            </Formik>
        </Modal>
    )
}