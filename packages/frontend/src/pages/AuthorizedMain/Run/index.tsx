import {Avatar} from "../../../components/Avatar"
import peopleIcon from "../../../assets/images/run-people.svg"
import bellIcon from "../../../assets/images/run-bell.svg"
import checkMark from "../../../assets/images/check-mark.png"
import classNames from "classnames"
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/hooks"
import {useRef, useState} from "react"
import {EventStartTime} from "../EventStartTime"
import {EventPlace} from "../EventPlace"
import { useEndHappeningMutation, useSetIsInterestedMutation, useStartHappeningMutation } from "../../../api/happenings-api"
import { setIsInterestedInRun, updateRunStatus } from "../../../store/slices/happenings"
import { useOutsideClickHandler } from "../../../utils/hooks/useClickedOutside"
import { Run as RunType } from "@app/shared/types/Happenings.type"
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
        team_size,
        username,
        connect_string
    } = run

    const dispatch = useAppDispatch()
    const [endRun] = useEndHappeningMutation()
    const [startRun] = useStartHappeningMutation()
    const [setIsInerested] = useSetIsInterestedMutation()
    const userId = useAppSelector(state => state.app.user.id)
    const isOwner = author_id == userId
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true)
    const ref = useRef<null | HTMLDivElement>(null)

    const handleOnClickOutside = () => {
        setIsShowMorePanelHidden(true)
    }

    useOutsideClickHandler(ref, !isShowMorePanelHidden, handleOnClickOutside)
   
    const endRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                await endRun(id).unwrap()

                dispatch(updateRunStatus({id, status: 2}))
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

                dispatch(updateRunStatus({id, status: 1}))
            } catch (e: any) { // TODO: guess what's wrong here? riiiiight, no types
                // some shit happened, i dunno what to show to users ¯\_(ツ)_/¯
            }
        }
    }

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                const res = await setIsInerested(id).unwrap()

                dispatch(setIsInterestedInRun({runId: id, isInterested: res.data ? 1 : 0}))
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
                            <button className={"run__more-btn"} onClick={() => setIsShowMorePanelHidden(!isShowMorePanelHidden)}>...</button>
                            <div data-hidden={isShowMorePanelHidden} ref={ref} className={classNames({"run__more-panel": !isShowMorePanelHidden}, {"hidden": isShowMorePanelHidden})}>
                                {isOwner && <button onClick={() => setIsShowMorePanelHidden(true)}>Edit Run</button>}
                                {isOwner && status == 0 && <button onClick={startRunCb(id)}>Start Run</button>}
                                {isOwner && status == 1 && <button className={"run__more-panel-red"} onClick={endRunCb(id)}>End Run</button>}
                            </div>
                        </div>
                        <button className={classNames("run__btn", {"run__btn-active": is_interested})} onClick={setIsInterestedCb(id)}><img src={is_interested ? checkMark : bellIcon}/>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}