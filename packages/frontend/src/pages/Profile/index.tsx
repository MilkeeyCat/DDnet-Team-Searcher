import { useParams } from "react-router-dom"
import { VerifiedIcon } from "../../components/ui/Icons/Verified"
import { PeopleIcon } from "../../components/ui/Icons/People"
import { ClockIcon } from "../../components/ui/Icons/Clock"
import { Button } from "../../components/ui/Button"
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks"
import { Avatar } from "../../components/Avatar"
import { useFollowUserMutation, useGetReviewsAboutUserQuery, useGetUserEventsQuery, useGetUserProfileQuery, useGetUserRolesQuery, useGetUserRunsQuery, useReportUserMutation } from "../../api/users-api"
import { Graph } from "./Graph"
import classNames from "classnames"
import { Modal } from "../../components/ui/Modal"
import { Field, Formik, Form } from "formik"
import { TextareaWithLabel } from "../AuthorizedMain/TextareaWithLabel"
import { useState } from "react"
import { addHint } from "../../store/slices/hints"
import { UserReportResponse } from "@app/shared/types/api/users.types"
import { Run } from "../AuthorizedMain/Run"
import { Event } from "../AuthorizedMain/Event"
import defaultTee from "../../assets/images/default-tee.png"

export const Profile = () => {
    const {userId}: {userId?: string} = useParams()
    const authedUserId = useAppSelector(state => state.app.user.id)
    const { data: user, refetch, isSuccess, isError } = useGetUserProfileQuery(parseInt(userId || "") || authedUserId || 0)
    const { data: roles } = useGetUserRolesQuery(parseInt(userId || "") || authedUserId || 0)
    const { data: runs, isSuccess: areRunsLoaded } = useGetUserRunsQuery(parseInt(userId || "") || authedUserId || 0)
    const { data: events, isSuccess: areEventsLoaded } = useGetUserEventsQuery(parseInt(userId || "") || authedUserId || 0)
    const { data: reviews, isSuccess: areReviewsLoaded } = useGetReviewsAboutUserQuery(parseInt(userId || "") || authedUserId || 0)
    const [followUser] = useFollowUserMutation()
    const [reportUser] = useReportUserMutation()
    const sameUser = parseInt(userId || "") === authedUserId || !userId
    const [isReportModalVisible, setIsReportModalVisible] = useState(false)
    const dispatch = useAppDispatch()

    const startDateWithWeekday = new Date(user?.created_at || "").toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    const follow = async () => {
        try {
            if(user) {
                await followUser(user.id).unwrap()
                refetch()
            }
        } catch(e) {

        }
    }

    const initialValues = {
        radio: "",
        other: ""
    }

    const onSubmit = async ({radio, other}: typeof initialValues) => {
        try {
            if(user) {
                const res = await reportUser({
                    text: radio === "Other" ? other : radio,
                    userId: user.id
                }).unwrap()

                setIsReportModalVisible(false)
                dispatch(addHint({type: "success", text: res.data || ""}))
                refetch()
            }
        } catch(e) {
            const err = e as UserReportResponse

            if("data" in err) {
                dispatch(addHint({type: "error", text: err.data || ""}))
            }
        }
    }

    const openReportModal = () => {
        if(!user?.reported) {
            setIsReportModalVisible(true)
        }
    }

    return (
        <>
            { isError && <p className="text-center text-[white] text-[5rem]">User not found :&lt;</p>}
            { isSuccess &&
            <div className="mt-[85px] max-w-[1110px] mx-auto">
                <div className="flex justify-center">
                    <Avatar size={285} src={null} username={user?.username || ""} />
                    <div className="text-[white] ml-[65px]">
                        <p className="text-2xl mt-9">{user?.username} {user?.verified === 1 && <VerifiedIcon className="inline-block" color="blue"/>}</p>
                            <div className="flex flex-wrap">
                                {roles && roles.map(role => (
                                    <div className="mr-3 mt-2 p-1.5 rounded-[5px]" style={{backgroundColor: `${role.color}1A`, border: `1px solid ${role.color}`}}>
                                        {role.url && <img className="w-4 h-4 mr-2.5 inline-block" src={role.url} alt="Role image" />}
                                        <span>{role.name}</span>
                                    </div>                    
                                ))}
                            </div>
                        <p className="mt-1"><PeopleIcon color="#fff" className="inline-block"/> <span>{user.followStats?.followers} followers · {user.followStats?.following} following</span></p>               
                        <p className="mt-1"><ClockIcon color="#fff" className="inline-block"/> <span>Joined {startDateWithWeekday}</span></p>               
                        <p className="mt-1">Clan <span className="text-sm opacity-30 ml-[20px]">namelessclan</span></p>  
                        <div className={classNames("flex mt-5", {"hidden": sameUser})}>
                            <Button className="max-w-[120px] w-full !block text-center" onClick={follow} styleType={"filled"}>{user?.following ? "Unfollow" : "Follow"}</Button>
                            <Button className="max-w-[120px] w-full !block text-center ml-8 !border-[red]" styleType="bordered" onClick={openReportModal}>{user?.reported ? "Reported" : "Report"}</Button>
                        </div>
                    </div>
                </div>
                <Modal visible={isReportModalVisible} onClose={()=>setIsReportModalVisible(false)} width={"450px"}>
                    <h2 className="text-center">Report {user.username}</h2>

                    <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
                                    <Button styleType="bordered" onClick={()=>setIsReportModalVisible(false)}>Cancel</Button>
                                    <Button className="ml-5" styleType="filled" type="submit">Report</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal>
                <ul className="flex justify-between mt-[100px]">
                    <li className="max-w-[30%] border-[1px] border-primary-1 bg-primary-2 transition-colors hover:bg-primary-3 rounded-[20px] text-[white] text-center w-full py-9 px-[85px]">
                        <p className="text-2xl">POL</p>
                        <p className="opacity-[.87]">most played server</p>
                    </li>
                    <li className="max-w-[30%] border-[1px] border-primary-1 bg-primary-2 transition-colors hover:bg-primary-3 rounded-[20px] text-[white] text-center w-full py-9 px-[85px]">
                        <p className="text-2xl">23</p>
                        <p className="opacity-[.87]">events hosted</p>
                    </li>
                    <li className="max-w-[30%] border-[1px] border-primary-1 bg-primary-2 transition-colors hover:bg-primary-3 rounded-[20px] text-[white] text-center w-full py-9 px-[85px]">
                        <p className="text-2xl">0</p>
                        <p className="opacity-[.87]">runs finished</p>
                    </li>
                </ul>
                <section className="mt-[60px]">
                    <h2 className="text-3xl text-[white] text-center">{user.username}'s last events</h2>
                    <div className="w-full flex justify-around flex-wrap">
                        {areEventsLoaded && events?.map(event => (
                            <Event className="mt-5" onClick={()=>{}} event={event} />
                        ))}
                    </div>
                </section>
                <section className="mt-[60px]">
                    <h2 className="text-3xl text-[white] text-center">{user.username}'s last runs</h2>
                    <div className="max-w-[80%] w-full mx-auto flex flex-wrap justify-around">
                        {areRunsLoaded && runs?.data?.map(run => (
                            <Run className="mt-5" onClick={()=>{}} run={run} />
                        ))}
                    </div>
                </section>
                <section className="max-w-[80%] mx-auto w-full mt-[60px]">
                    <Graph username={user?.username || ""}/>
                </section>
                <section className="mt-[60px] mb-[200px]">
                    <h2 className="text-3xl text-[white] text-center">What people say about {user.username}</h2>
                    <div>
                    {areReviewsLoaded && typeof reviews != "string" && reviews?.map(({text, rate, author: {avatar, username}}) => (
                        <div className="flex mt-12 max-w-[600px] w-full mx-auto">
                            <div>
                                <Avatar size={50} username={username} src={avatar}/>
                            </div>
                            <div className="ml-1">
                                <p className="font-semibold text-[white]">{username}</p>
                                <div className="flex items-center">
                                    <div className="flex -ml-1">
                                        {rate && new Array(rate).fill(rate).map(item => (
                                            <img className="max-w-7 h-7 [&:not(:first-child)]:-ml-3" src={defaultTee} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-[white] opacity-60 ml-1">4 days ago</span>
                                </div>
                                <p className="text-[white] mt-2.5">{text}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                </section>
            </div> }
        </>
    )
}