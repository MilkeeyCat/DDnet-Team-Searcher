import {Avatar} from "../../../components/Avatar"
import peopleIcon from "../../../assets/images/run-people.svg"
import bellIcon from "../../../assets/images/run-bell.svg"
import classNames from "classnames"
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/hooks"
import {useState} from "react"
import {EventStartTime} from "../EventStartTime"
import {EventPlace} from "../EventPlace"
import { useEndRunMutation, useSetIsInterestedMutation, useStartRunMutation } from "../../../api/runs-api"
import { setIsInterested, updateRunStatus } from "../../../store/slices/runs"
import { Run as RunType } from "../../../types/Run.type"
import "./styles.scss"

interface OwnProps {
    run: RunType;
    onClick: () => void;
}

export const Run: React.FC<OwnProps> = ({onClick, run}) => {
    const {
        author_id,
        avatar,
        description,
        id,
        interested,
        is_interested,
        map_name,
        place,
        start_at,
        status,
        teamsize,
        username,
        connect_string
    } = run

    const dispatch = useAppDispatch()
    const [endRun] = useEndRunMutation()
    const [startRun] = useStartRunMutation()
    const [setIsInerested] = useSetIsInterestedMutation()
    const userId = useAppSelector(state => state.app.user.id)
    const isOwner = parseInt(author_id) == userId
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true)

    const endRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                await endRun(id).unwrap()

                dispatch(updateRunStatus({id: id.toString(), status: "2"}))
            } catch (e: any) { // TODO: guess what's wrong here? riiiiight, no types
                // some shit happened, i dunno what to show to users ¯\_(ツ)_/¯
            }
        }
    }

    const startRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                await startRun(id).unwrap()

                dispatch(updateRunStatus({id: id.toString(), status: "1"}))
            } catch (e: any) { // TODO: guess what's wrong here? riiiiight, no types
                // some shit happened, i dunno what to show to users ¯\_(ツ)_/¯
            }
        }
    }

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                const res: any = await setIsInerested(id).unwrap()

                dispatch(setIsInterested({runId: id, isInterested: res.isInterested}))
            } catch (e: any) { // TODO: guess what's wrong here? riiiiight, no types
                // some shit happened, i dunno what to show to users ¯\_(ツ)_/¯
            }
        }
    }

    return (
        <div className={"run"}>
            <img src={`https://ddnet.org/ranks/maps/${map_name.replaceAll(" ", "_")}.png`} className={"run__thumbnail"} alt="map thumbnail"/>
            <div className="run__inner">
                <div className="row jc-sb">
                    <EventStartTime startAt={start_at} status={status}/>
                    <div className={"run__interested"}>
                        <img src={peopleIcon}/>
                        <span>{interested}</span>
                    </div>
                </div>
                <EventPlace place={place}/>
                <p className="run__title" onClick={onClick}>{map_name}</p>
                <p className="run__description">{description}</p>
                <div className="run__footer row jc-sb">
                    <Avatar src={null} username={username}/>
                    <div>
                        <div className={"run__more"}>
                            <button className={"run__more-btn"} onClick={() => setIsShowMorePanelHidden(false)}>...</button>
                            <div className={classNames({"run__more-panel": !isShowMorePanelHidden}, {"hidden": isShowMorePanelHidden})}>
                                <button onClick={() => setIsShowMorePanelHidden(true)}>Useless button</button>

                                {isOwner && <button onClick={() => setIsShowMorePanelHidden(true)}>Edit Run</button>}
                                {isOwner && status == "1" && <button className={"run__more-panel-red"} onClick={endRunCb(parseInt(id))}>End Run</button>}
                                {isOwner && status == "0" && <button onClick={startRunCb(parseInt(id))}>Start Run</button>}
                            </div>
                        </div>
                        <button className={classNames("run__btn", {"run__btn-active": is_interested == "1"})} onClick={setIsInterestedCb(parseInt(id))}><img src={bellIcon}/>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}