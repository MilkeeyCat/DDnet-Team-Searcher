import { useParams } from "react-router-dom"
import { VerifiedIcon } from "../../components/ui/Icons/Verified"
import { PeopleIcon } from "../../components/ui/Icons/People"
import { ClockIcon } from "../../components/ui/Icons/Clock"
import { Button } from "../../components/ui/Button"
import { useAppSelector } from "../../utils/hooks/hooks"
import { Avatar } from "../../components/Avatar"
import { useGetUserProfileQuery, useGetUserRolesQuery } from "../../api/users-api"
import { Graph } from "./Graph"


export const Profile = () => {
    const {userId}: {userId?: string} = useParams()
    const authedUserId = useAppSelector(state => state.app.user.id)
    const { data: user, isSuccess, isError } = useGetUserProfileQuery(userId || authedUserId?.toString() || "")
    const { data: roles } = useGetUserRolesQuery(userId || authedUserId?.toString() || "")

    const startDateWithWeekday = new Date(user?.created_at || "").toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <>
            { isError && <p className="text-center text-[white] text-[5rem]">User not found :&lt;</p>}
            { isSuccess &&
            <div className="mt-[85px] max-w-[1110px] mx-auto">
                <div className="flex justify-center">
                    <Avatar size={285} src={null} username={user?.username || ""} />
                    <div className="text-[white] ml-[65px]">
                        <p className="text-2xl mt-9">{user?.username} <VerifiedIcon className="inline-block" color="blue"/></p>
                            <div className="flex flex-wrap">
                                {roles && roles.map(role => (
                                    <div className="mr-3 mt-2 p-1.5 rounded-[5px]" style={{backgroundColor: `${role.color}1A`, border: `1px solid ${role.color}`}}>
                                        {role.url && <img className="w-4 h-4 mr-2.5 inline-block" src={role.url} alt="Role image" />}
                                        <span>{role.name}</span>
                                    </div>                    
                                ))}
                            </div>
                        <p className="mt-1"><PeopleIcon color="#fff" className="inline-block"/> <span>100 followers · 1 following</span></p>               
                        <p className="mt-1"><ClockIcon color="#fff" className="inline-block"/> <span>Joined {startDateWithWeekday}</span></p>               
                        <p className="mt-1">Clan <span className="text-sm opacity-30 ml-[20px]">namelessclan</span></p>  
                        <div className="flex mt-5">
                            <Button className="max-w-[120px] w-full !block text-center" styleType="filled">Follow</Button>
                            <Button className="max-w-[120px] w-full !block text-center ml-8 !border-[red]" styleType="bordered">Report</Button>
                        </div>
                    </div>
                </div>
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
                <Graph username={user?.username || ""}/>
            </div> }
        </>
    )
}