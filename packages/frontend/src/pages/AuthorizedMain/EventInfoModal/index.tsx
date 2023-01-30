import {Modal} from "../../../components/ui/Modal"
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/hooks"
import {EventStartTime} from "../EventStartTime"
import {EventPlace} from "../EventPlace"
import {Avatar} from "../../../components/Avatar"
import {useEffect, useState} from "react"
import classNames from "classnames"
import { useLazyGetInterestedPlayersQuery, useUpdateIsPlayerInTeamMutation } from "../../../api/events-api"

interface InterestedPlayer {
    id: string;
    username: string;
    avatar: string | null;
    in_team: 0 | 1;
}

interface OwnProps {
    eventId: number;
    onClose: () => void
}

export const EventInfoModal: React.FC<OwnProps> = ({eventId, onClose}) => {
    const event = useAppSelector(state => state.eventsReducer.events).find(event => parseInt(event.id) === eventId)!

    const [ getInterestedPlayers, interestedPlayersData ] = useLazyGetInterestedPlayersQuery()
    const [ updateIsPlayerInTeam ] = useUpdateIsPlayerInTeamMutation()

    const [interestedPlayers, setInterestedPlayers] = useState<null | InterestedPlayer[]>(null)
    const dispatch = useAppDispatch()
    const authedUserId = useAppSelector(state => state.app.user.id)!

    const authedUser = interestedPlayers?.find(arr => arr.id == authedUserId.toString())

    useEffect(() => {
        getInterestedPlayers(eventId)
    }, [])

    useEffect(() => {
        //@ts-ignore TODO: TYYYYYYYYYYYPES
        setInterestedPlayers(interestedPlayersData?.data?.players)
    }, [interestedPlayersData])

    const [slideNum, setSlideNum] = useState(0)

    const addOrRemovePlayer = (userId: string) => {
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

    const inputCb = (authorId: string, userId: string) => {
        return () => {
            if (authorId == userId) return

            addOrRemovePlayer(userId)
            updateIsPlayerInTeam({eventId, userId: parseInt(userId)})
        }
    }
    
    const copyConnectData = async () => {
        await navigator.clipboard.writeText(event.connect_string || "")
        
        alert("The needed thing copied in your clipboard. Now just open client, press F1, paste this stuff and have a nice game!")
    }

    const thumbnailUrl = event.thumbnail ? `http://localhost:8080/public/${event.thumbnail}` : `https://ddnet.org/ranks/maps/${event.map_name.replaceAll(" ", "_")}.png`

    return (
        <Modal className={"run-info"} visible={true} onClose={onClose}>
            <img src={thumbnailUrl}
                 className={"run-info__thumbnail"}
                 alt="ddnet map thumbnail"/>
            <ul className={"run-info__header-btns"}>
                <li className={classNames("run-info__header-btn", {"run-info__header-btn-active": slideNum == 0})}
                    onClick={() => setSlideNum(0)}>Run Info
                </li>
                <li className={classNames("run-info__header-btn", {"run-info__header-btn-active": slideNum == 1})}
                    onClick={() => setSlideNum(1)}>{event.interested} interested
                </li>
            </ul>
            <div className={"run-info__slides-container"}>
                <div className={"run-info__slides-item"} style={{right: `${slideNum * 100}%`}}>
                    <EventStartTime startAt={event.start_at} status={event.status}/>
                    <p className={"run-info__map-name"}>{event.map_name}</p>
                    <p className={"run-info__description"}>{event.description}</p>
                    <EventPlace place={event.place}/>
                    <div className={"run-info__author"}><Avatar src={null} username={event.username}/>
                        <span>Created by {event.username}</span></div>
                </div>
                <div className={"run-info__slides-item"} style={{right: `${slideNum * 100}%`}}>
                    <ul className={"run-info__interested-players"}>
                        {interestedPlayers?.map(user => (
                            <li className={classNames("run-info__interested-player", {"run-info__interested-player-active": user.in_team})}>
                                {event.author_id == authedUserId.toString() &&
                                <input type="checkbox" name="interestedPlayers"
                                       checked={user.in_team === 1}
                                       onChange={inputCb(event.author_id, user.id)}
                                       readOnly={user.id == event.author_id}/>}
                                <Avatar src={user.avatar} username={user.username}/>
                                <span className={"run-info__interested-player-name"}>{user.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={"run-info__footer"}>
                {authedUser?.in_team === 1 && event.status == "1" &&
                    <button className={"run-info__footer-btn"} onClick={copyConnectData}>Copy IP</button>
                }
                <button className={"run-info__footer-btn"}>Useless button</button>
            </div>
        </Modal>
    )
}