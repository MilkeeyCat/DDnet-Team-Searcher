import { UserBanResponse } from "@app/shared/types/api/users.types";
import { Field, Form, Formik, FormikHelpers } from "formik"
import { useBanUserMutation } from "../../../api/users-api";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal"
import { hint } from "../../../store/slices/hints";
import { useAppDispatch } from "../../../utils/hooks/hooks"
import { TextareaWithLabel } from "../../AuthorizedMain/TextareaWithLabel";

type FormFields = {
    reason: string;
}

type OwnProps = {
    userId: number;
    cb: () => void;
    isVisible: boolean;
    onClose: () => void;
    username: string;
}

export const BanModal = ({userId, cb, isVisible, onClose, username}: OwnProps) => {
    const dispatch = useAppDispatch()
    const [banUser] = useBanUserMutation()

    const initialValues = {
        reason: ""
    }

    const onSubmit = async (values: FormFields, {resetForm}: FormikHelpers<FormFields>) => {
        let reason: string | null
        
        if(values.reason === "") reason = null
        else reason = values.reason
        
        try {
            const res = await banUser({userId, reason}).unwrap()

            dispatch(hint({type: "success", text: res.data || ""}))
            resetForm()
            onClose()
            cb()          
        } catch(e) {
            const err = e as UserBanResponse

            if("data" in err) {
                dispatch(hint({type: "error", text: err.data || ""}))
            }
        }
    }

    return (
        <Modal visible={isVisible} onClose={onClose} width={"450px"}>
            <h2 className="text-center">Ban {username}</h2>

            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                <Form>
                    <Field component={TextareaWithLabel} name="reason" label="Reason" className="mx-10" />
                    <div className="flex m-4 mx-10 justify-end">
                        <Button styleType="bordered" onClick={onClose}>Cancel</Button>
                        <Button className="ml-5" styleType="filled" type="submit">Ban</Button>
                    </div>
                </Form>
            </Formik>
        </Modal>
    )
}