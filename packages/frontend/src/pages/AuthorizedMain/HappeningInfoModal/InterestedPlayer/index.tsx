import { Run, Event } from "@app/shared/types/Happenings.type";
import { InterestedPlayer as InterestedPlayerT } from "@app/shared/types/InterestedPlayer.type";
import classNames from "classnames";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCreateReviewMutation } from "../../../../api/reviews-api";
import { Avatar } from "../../../../components/Avatar";
import { Button } from "../../../../components/ui/Button";
import { TextareaWithLabel } from "../../TextareaWithLabel";
import { CreateReviewForm } from "../../../../types/CreateReviewForm.type";
import { composeValidators } from "../../../../utils/composeValidators";
import { required } from "../../../../utils/validators/required";
import { Review } from "@app/shared/types/Review.type";

type OwnProps = {
    user: InterestedPlayerT;
    happening: Run | Event;
    authedUserId: number;
    onChange: (...args: Array<any>) => () => void;
    reviews: Array<Review>;
}

export const InterestedPlayer = ({user, happening, authedUserId, onChange, reviews}: OwnProps) => {
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false)
    const [createReview] = useCreateReviewMutation()

    const initialValues: CreateReviewForm = {
        happeningId: happening.id,
        reviewedUserId: user.id,
        rate: null,
        text: ""
    }

    const validateRateField = (value: string | number | null) => composeValidators(value, [required])

    const validation = (values: CreateReviewForm) => {
        console.log(values);
        
        const errors: { [key in keyof Partial<CreateReviewForm>]: any } = {}

        const rateField = validateRateField(values.rate)

        if (rateField) errors.rate = rateField

        return errors
    }

    const onSubmit = async (values: CreateReviewForm) => {
        try {
            await createReview(values)
        } catch(e) {

        }
    }

    return (
        <li className={classNames("group rounded-md transition-colors [&:not(.active)]:hover:bg-[#3F362B]", {"active bg-[#6e5e47]": user.in_team})}>
            <div className="flex items-center cursor-pointer rounded-md mt-1">
                {happening.author_id == authedUserId &&
                <input className="ml-2.5 my-2.5" type="checkbox" name="interestedPlayers"
                    checked={user.in_team === 1}
                    onChange={onChange(happening.author_id, user.id)}
                    readOnly={user.id == happening.author_id}/>}
                <Link to={`/profile/${user.id}`} className="py-2.5 ml-4">
                    <Avatar src={user.avatar} username={user.username}/>
                </Link>
                <span className="ml-2.5">{user.username}</span>
                <Button className={classNames("ml-auto !p-1.5 mr-1 !hidden group-hover:!block", {"group-hover:!hidden": isReviewFormVisible || user.id === authedUserId || happening.status !== 2 || reviews.find(review => review.reviewedUser.id == user.id && review.author.id == authedUserId)})} onClick={()=>setIsReviewFormVisible(true)} styleType="filled">Leave a review</Button>
            </div>
            <Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
                {({values, errors, setFieldValue}) => (
                    <Form className={classNames("p-2.5", {"hidden": !isReviewFormVisible}, {"block": isReviewFormVisible})}>
                        <p className="text-[12px] uppercase">How many Tees out of 5 does he/SHE/IT/THEY/WHateverthefuck deserves <span className="text-[red]">*</span></p>
                        <div className="flex items-center">
                            {[1,2,3,4,5].map((num, id) => (
                                <div className="flex [&:not(:first-child)]:ml-5 items-center" key={id}>
                                    <Field id={id} className="appearance-none w-5 h-5 rounded-full border-2 border-primary-1 after:relative after:block after:w-2.5 after:h-2.5 after:rounded-full after:top-[50%] after:translate-y-[-50%] after:left-[50%] after:translate-x-[-50%] checked:after:bg-primary-1" type="radio" name="rate" value={num.toString()} />
                                    <label htmlFor={id.toString()} className="ml-1.5 cursor-pointer">{num}</label>
                                </div>
                            ))}
                            <p className={classNames("ml-5 text-error text-[12px]", {"hidden": !!!errors.rate}, {"block": !!errors?.rate})}>&#60;--- you have to choose smth here</p>
                        </div>
                        <Field placeholder="Troll" className="mt-3" component={TextareaWithLabel} label="Describe your teammate however you want" id="text" name="text"/>
                        <div className="flex mt-4 justify-end">
                            <Button styleType="bordered" onClick={()=>setIsReviewFormVisible(false)}>Cancel</Button>
                            <Button className="ml-5" type="submit" styleType="filled">Submit</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </li>
    )
}