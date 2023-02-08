import {Modal} from "../../../components/ui/Modal"
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/hooks"
import {EventStartTime} from "../EventStartTime"
import {EventPlace} from "../EventPlace"
import {Avatar} from "../../../components/Avatar"
import {useEffect, useState} from "react"
import classNames from "classnames"
import { useLazyGetInterestedPlayersQuery, useUpdateIsPlayerInTeamMutation } from "../../../api/happenings-api"
import { InterestedPlayer } from "@app/shared/types/InterestedPlayer.type"
import { Event, Run } from "@app/shared/types/Happenings.type"

interface OwnProps {
    happeningId: number;
    onClose: () => void;
    type: "run" | "event";
}

export const HappeningInfoModal: React.FC<OwnProps> = ({type, happeningId, onClose}) => {
    const happening = useAppSelector(state => state.happeningsReducer[type == "event" ? "events" : "runs"]).find(happening => happening.id === happeningId)! as typeof type extends "run" ? Run : Event
    const [ getInterestedPlayers, interestedPlayersData ] = useLazyGetInterestedPlayersQuery()
    const [ updateIsPlayerInTeam ] = useUpdateIsPlayerInTeamMutation()

    const [interestedPlayers, setInterestedPlayers] = useState<null | InterestedPlayer[]>(null)
    const authedUserId = useAppSelector(state => state.app.user.id)!

    const authedUser = interestedPlayers?.find(arr => arr.id == authedUserId)

    useEffect(() => {
        getInterestedPlayers(happeningId)
    }, [])

    useEffect(() => {
        setInterestedPlayers(interestedPlayersData.data?.data || [])
    }, [interestedPlayersData])

    const [slideNum, setSlideNum] = useState(0)

    const addOrRemovePlayer = (userId: number) => {
        //NOTE: I dont fucking know what the hell is this, but it seems to work :\
        setInterestedPlayers(JSON.parse(JSON.stringify(interestedPlayers))?.map((player: any) => {
            if(player.in_team == 0 && player.id == userId) {
                player.in_team = 1
            } else if(player.in_team == 1 && player.id == userId){
                player.in_team = 0;
            }

            return player
        }))
    }

    const inputCb = (authorId: number, userId: number) => {
        return () => {
            if (authorId == userId) return

            addOrRemovePlayer(userId)
            updateIsPlayerInTeam({happeningId, userId})
        }
    }
    
    const copyConnectData = async () => {
        await navigator.clipboard.writeText(happening.connect_string || "")
        
        alert("The needed thing copied in your clipboard. Now just open client, press F1, paste this stuff and have a nice game!")
    }

    let thumbnailUrl

    if (type == "event") {
        thumbnailUrl = happening.thumbnail ? `http://localhost:8080/public/${happening.thumbnail}` : `https://ddnet.org/ranks/maps/${happening.map_name.replaceAll(" ", "_")}.png`
    } else {
        thumbnailUrl = `https://ddnet.org/ranks/maps/${happening.map_name.replaceAll(" ", "_")}.png`   
    }

    return (
        <Modal visible={true} width={"600px"} onClose={onClose}>
            <img src={thumbnailUrl}
                 className="max-w-full w-full max-h-[200px] object-cover rounded-t-[10px]"
                 alt="ddnet map thumbnail"/>
            <ul className="flex m-0 pt-4 border-b-[#3F362B] border-b-[1px]">
                <li className={classNames("ml-4 relative pb-2.5 cursor-pointer after:transition-all after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-[-1px] after:rounded-full", {"after:bg-[#f6a740]": slideNum == 0})}
                    onClick={() => setSlideNum(0)}>{type.charAt(0).toUpperCase() + type.slice(1)} Info
                </li>
                <li className={classNames("ml-4 relative pb-2.5 cursor-pointer after:transition-all after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-[-1px] after:rounded-full", {"after:bg-[#f6a740]": slideNum == 1})}
                    onClick={() => setSlideNum(1)}>{happening.interested} interested
                </li>
            </ul>
            <div className="flex max-w-[calc(100%-40px)] my-5 mx-auto overflow-hidden">
                <div className="transition-all duration-500 max-w-full w-full shrink-0 relative" style={{right: `${slideNum * 100}%`}}>
                    <EventStartTime startAt={happening.start_at} status={happening.status}/>
                    <p className="text-2xl font-semibold mt-4">{happening.map_name}</p>
                    <p className="text-[rgba(255,255,255,.6)]">{happening.description}</p>
                    <EventPlace place={happening.place}/>
                    <div className="text-[rgba(255,255,255,.6)] flex mt-2.5 items-center">
                        <Avatar src={null} username={happening.username}/>
                        <span className="ml-2.5">Created by {happening.username}</span></div>
                </div>
                <div className="transition-all duration-500 max-w-full w-full shrink-0 relative" style={{right: `${slideNum * 100}%`}}>
                    <ul>
                        {interestedPlayers?.map(user => (
                            <li className={classNames("cursor-pointer flex p-2.5 rounded-md mt-1 transition-colors [&:not(.active)]:hover:bg-[#3F362B]", {"active bg-[#6e5e47]": user.in_team})}>
                                {happening.author_id == authedUserId &&
                                <input className="mr-5" type="checkbox" name="interestedPlayers"
                                       checked={user.in_team === 1}
                                       onChange={inputCb(happening.author_id, user.id)}
                                       readOnly={user.id == happening.author_id}/>}
                                <Avatar src={user.avatar} username={user.username}/>
                                <span className="ml-2.5">{user.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={"flex justify-end rounded-b-[10px] py-4 px-5 bg-[#1A1714] text-primary-1"}>
                {authedUser?.in_team === 1 && happening.status == 1 &&
                    <button className={"bg-[#383129] py-[8px] px-4 rounded-[5px] ml-2.5"} onClick={copyConnectData}>Copy IP</button>
                }
                <button className={"bg-[#383129] py-[8px] px-4 rounded-[5px] ml-2.5"}>Useless button</button>
            </div>
        </Modal>
    )
}