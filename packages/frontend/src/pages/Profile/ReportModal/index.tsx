import { UserReportResponse } from "@app/shared/types/api/users.types"
import classNames from "classnames"
import { Field, Form, Formik } from "formik"
import { useReportUserMutation } from "../../../api/users-api"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import { hint } from "../../../store/slices/hints"
import { useAppDispatch } from "../../../utils/hooks/hooks"
import { TextareaWithLabel } from "../../AuthorizedMain/TextareaWithLabel"

type FormFields = {
    radio: string,
    other: string
}

type OwnProps = {
    userId: number;
    cb: () => void;
    isVisible: boolean;
    onClose: () => void;
    username: string;
}

export const ReportModal = ({userId, cb, isVisible, onClose, username}: OwnProps) => {
    const [reportUser] = useReportUserMutation()
    const dispatch = useAppDispatch()
    const initialValuesReport = {
        radio: "",
        other: ""
    }

    const onSubmit = async ({radio, other}: FormFields) => {
        try {
            const res = await reportUser({
                text: radio === "Other" ? other : radio,
                userId: userId
            }).unwrap()

            onClose()
            dispatch(hint({type: "success", text: res.data || ""}))
            cb()
        } catch(e) {
            const err = e as UserReportResponse

            if("data" in err) {
                dispatch(hint({type: "error", text: err.data || ""}))
            }
        }
    }

    return (
        <Modal visible={isVisible} onClose={onClose} width={"450px"}>
            <h2 className="text-center">Report {username}</h2>

            <Formik initialValues={initialValuesReport} onSubmit={onSubmit}>
                {({values}) => (
                    <Form>
                        <div className="mx-10">
                            {["Retarded", "Faking a pro", "Nudity", "Hate this peron", "Other"].map((el, id) => (
                                <div className="mt-1">
                                    <Field className="appearance-none w-5 h-5 rounded-full border-2 border-primary-1 after:relative after:block after:w-2.5 after:h-2.5 after:rounded-full after:top-[50%] after:translate-y-[-50%] after:left-[50%] after:translate-x-[-50%] checked:after:bg-primary-1" id={el} name="radio" type="radio" value={el} />
                                    <label className="ml-4" htmlFor={el}>{el}</label>
                                </div>
                            ))}
                        </div>
                        <Field component={TextareaWithLabel} name="other" className={classNames("mx-10", {"!hidden": values.radio != "Other"})} label="" />
                        <div className="flex m-4 mx-10 justify-end">
                            <Button styleType="bordered" onClick={onClose}>Cancel</Button>
                            <Button className="ml-5" styleType="filled" type="submit">Report</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}