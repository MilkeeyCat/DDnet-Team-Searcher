import {Modal} from "../../../components/ui/Modal"
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/hooks"
import {EventStartTime} from "../EventStartTime"
import {EventPlace} from "../EventPlace"
import {Avatar} from "../../../components/Avatar"
import {useEffect, useState} from "react"
import classNames from "classnames"
import { useLazyGetInterestedPlayersQuery, useUpdateIsPlayerInTeamMutation } from "../../../api/runs-api"

interface InterestedPlayer {
    id: string;
    username: string;
    avatar: string | null;
    in_team: 0 | 1;
}

interface RunInfoModalProps {
    runId: number;
    onClose: () => void
}

export const RunInfoModal: React.FC<RunInfoModalProps> = ({runId, onClose}) => {
    const run = useAppSelector(state => state.runsReducer.runs).find(run => parseInt(run.id) === runId)!

    const [ getInterestedPlayers, interestedPlayersData ] = useLazyGetInterestedPlayersQuery()
    const [ updateIsPlayerInTeam ] = useUpdateIsPlayerInTeamMutation()

    const [interestedPlayers, setInterestedPlayers] = useState<null | InterestedPlayer[]>(null)
    const dispatch = useAppDispatch()
    const authedUserId = useAppSelector(state => state.app.user.id)!

    const authedUser = interestedPlayers?.find(arr => arr.id == authedUserId.toString())

    useEffect(() => {
        getInterestedPlayers(runId)
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
            updateIsPlayerInTeam({runId, userId: parseInt(userId)})
        }
    }
    
    const copyConnectData = async () => {
        await navigator.clipboard.writeText(run.connect_string || "")
        
        alert("The needed thing copied in your clipboard. Now just open client, press F1, paste this stuff and have a nice game!")
    }

    return (
        <Modal className={"run-info"} visible={true} onClose={onClose}>
            <img src={`https://ddnet.tw/ranks/maps/${run.map_name.replaceAll(" ", "_")}.png`}
                 className={"run-info__thumbnail"}
                 alt="ddnet map thumbnail"/>
            <ul className={"run-info__header-btns"}>
                <li className={classNames("run-info__header-btn", {"run-info__header-btn-active": slideNum == 0})}
                    onClick={() => setSlideNum(0)}>Run Info
                </li>
                <li className={classNames("run-info__header-btn", {"run-info__header-btn-active": slideNum == 1})}
                    onClick={() => setSlideNum(1)}>{run.interested} interested
                </li>
            </ul>
            <div className={"run-info__slides-container"}>
                <div className={"run-info__slides-item"} style={{right: `${slideNum * 100}%`}}>
                    <EventStartTime startAt={run.start_at} status={run.status}/>
                    <p className={"run-info__map-name"}>{run.map_name}</p>
                    <p className={"run-info__description"}>{run.description}</p>
                    <EventPlace place={run.place}/>
                    <div className={"run-info__author"}><Avatar src={null} username={run.username}/>
                        <span>Created by {run.username}</span></div>
                </div>
                <div className={"run-info__slides-item"} style={{right: `${slideNum * 100}%`}}>
                    <ul className={"run-info__interested-players"}>
                        {interestedPlayers?.map(user => (
                            <li className={classNames("run-info__interested-player", {"run-info__interested-player-active": user.in_team})}>
                                {run.author_id == authedUserId.toString() &&
                                <input type="checkbox" name="interestedPlayers"
                                       checked={user.in_team === 1}
                                       onChange={inputCb(run.author_id, user.id)}
                                       readOnly={user.id == run.author_id}/>}
                                <Avatar src={user.avatar} username={user.username}/>
                                <span className={"run-info__interested-player-name"}>{user.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={"run-info__footer"}>
                {authedUser?.in_team === 1 && run.status == "1" &&
                    <button className={"run-info__footer-btn"} onClick={copyConnectData}>Copy IP</button>
                }
                <button className={"run-info__footer-btn"}>Useless button</button>
            </div>
        </Modal>
    )
}