import { Field, Form, Formik, FormikHelpers } from "formik"
import { useState } from "react";
import { useCreateRunMutation } from "../../../api/runs-api";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal"
import { setIsCreateRunModalHidden } from "../../../store/slices/app"
import { addHint } from "../../../store/slices/hints";
import { composeValidators } from "../../../utils/composeValidators";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/hooks"
import { required } from "../../../utils/validators/required";
import { InputWithLabel } from "../InputWithLabel";
import { RadioInput } from "../RadioInput";
import { TextareaWithLabel } from "../TextareaWithLabel";
import { CreateRunForm } from "../../../types/CreateRunForm.type"
import "./styles.scss"

interface OwnProps {
    isVisible: boolean;
    onClose: () => void
}

export const CreateRunModal:React.FC<OwnProps> = ({onClose, isVisible}) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [createRun] = useCreateRunMutation()
    const dispatch = useAppDispatch()
    const availableMaps = useAppSelector(state => state.app.maps)

    const initialValues: CreateRunForm = {
        place: null,
        mapName: "",
        teamSize: "",
        runStartDate: new Date().toISOString().substring(0, 10),
        runStartTime: new Date().toLocaleTimeString(navigator.language, {hour12: false}).substring(0, 5),
        description: ""
    }

    const validatePlaceField = (value: string | number | null) => composeValidators(value, [required])
    const validateTeamsizeField = (value: string | number) => composeValidators(value, [required])
    const validateMapNameField = (value: string | number) => composeValidators(value, [required])

    const validation = (values: CreateRunForm) => {
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

    const onSubmit = async (values: CreateRunForm, {resetForm}: FormikHelpers<CreateRunForm>) => {
        try {
            const res = await createRun(values).unwrap()

            resetForm()
            dispatch(setIsCreateRunModalHidden(true))
            //@ts-ignore TODO: NO TYPES HERE :\
            dispatch(addHint({type: "success", text: res.message}))
        } catch (err: any) { //TODO: still error type missing (╯▽╰ )
            dispatch(addHint({type: "error", text: err.message}))
        }
    }

    return (
        <Modal className={"create-run"} visible={isVisible} onClose={onClose} width={"560px"}>

            <p className={"create-run__title"}>Create your own run</p>
            <Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
                <Form>
                    <div className="create-run__form-header">
                        <div className={"create-run__form-place-wrapper"}>
                            <p className={"create-run__form-title"} style={{"margin": "40px 0 0"}}>Where's your
                                run?</p>
                            <p className={"create-run__form-subtitle"}>So noone gets lost on where to go?</p>
                            <Field component={RadioInput} value={0} name={"place"} id={"own"}
                                   title={"Our own servers."}
                                   subtitle={"You will have less change to get ddosed."}/>
                            <Field component={RadioInput} value={1} name={"place"} id={"others"}
                                   title={"Somewhere else."}
                                   subtitle={"You can get team and go play on official DDnet servers."}/>
                        </div>
                        <div>
                            <p className={"create-run__form-title"}>Tell us more about your run</p>
                            <p className={"create-run__form-subtitle"}>Fill fields down below!</p>
                            <div className="create-run__form-row">
                                <Field name="mapName" label="map name" datalist={availableMaps.map(map => map.name)}
                                       id="mapName" placeholder={"Map you're gonna play?"} required component={InputWithLabel}/>
                                <Field name="teamSize" label="team size" type={"number"} id="teamSize"
                                       placeholder={"What team size do you want?"} required
                                       component={InputWithLabel}/>
                            </div>
                            <div className="create-run__form-row">
                                <Field name="runStartDate" label="run start date" type={"date"} id="runStartDate"
                                       required component={InputWithLabel}/>
                                <Field name="runStartTime" pattern="[0-9]{2}:[0-9]{2}" label="run start time"
                                       type={"time"} id="runStartTime" required component={InputWithLabel}/>
                            </div>
                        </div>
                        <Field label={"description"} className={"create-run__form-description"} name={"description"}
                               placeholder={"Here you can describe a teammate of dream, are weebs people or whatever you want"}
                               component={TextareaWithLabel}/>
                    </div>
                    <div className={"create-run__form-footer"}>
                        <Button styleType={"bordered"}
                                onClick={onClose}>Close</Button>
                        <Button styleType={"filled"} type={"submit"} disabled={isSubmitButtonDisabled}>Create
                            run</Button>
                    </div>
                </Form>
            </Formik>
        </Modal>
    )
}