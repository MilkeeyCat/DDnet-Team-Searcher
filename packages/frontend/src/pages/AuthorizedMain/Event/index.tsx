import {Avatar} from "../../../components/Avatar"
import peopleIcon from "../../../assets/images/run-people.svg"
import bellIcon from "../../../assets/images/run-bell.svg"
import checkMark from "../../../assets/images/check-mark.png"
import classNames from "classnames"
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/hooks"
import {useRef, useState} from "react"
import {EventStartTime} from "../EventStartTime"
import {EventPlace} from "../EventPlace"
import { Event as EventType } from "@app/shared/types/Happenings.type"
import { useOutsideClickHandler } from "../../../utils/hooks/useClickedOutside"
import { useEndHappeningMutation, useSetIsInterestedMutation, useStartHappeningMutation } from "../../../api/happenings-api"
import { setIsInterestedInEvent, updateEventStatus } from "../../../store/slices/happenings"
import "./styles.scss"

interface OwnProps {
    event: EventType;
    onClick: () => void;
}

export const Event: React.FC<OwnProps> = ({onClick, event}) => {
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
        connect_string,
        thumbnail
    } = event

    const dispatch = useAppDispatch()
    const [endEvent] = useEndHappeningMutation()
    const [startEvent] = useStartHappeningMutation()
    const [setIsInerested] = useSetIsInterestedMutation()
    const userId = useAppSelector(state => state.app.user.id)
    const isOwner = author_id == userId
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true)
    const ref = useRef<null | HTMLDivElement>(null)

    const handleOnClickOutside = () => {
        setIsShowMorePanelHidden(true)
    }

    useOutsideClickHandler(ref, !isShowMorePanelHidden, handleOnClickOutside)
   
    const endEventCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                await endEvent(id).unwrap()

                dispatch(updateEventStatus({id, status: 2}))
            } catch (e: any) { // TODO: guess what's wrong here? riiiiight, no types
                // some shit happened, i dunno what to show to users ¯\_(ツ)_/¯
            }
        }
    }

    const startEventCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                await startEvent(id).unwrap()

                dispatch(updateEventStatus({id, status: 1}))
            } catch (e: any) { // TODO: guess what's wrong here? riiiiight, no types
                // some shit happened, i dunno what to show to users ¯\_(ツ)_/¯
            }
        }
    }

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                const res = await setIsInerested(id).unwrap()

                dispatch(setIsInterestedInEvent({eventId: id, isInterested: res.data ? 1 : 0}))
            } catch (e: any) { // TODO: guess what's wrong here? riiiiight, no types
                // some shit happened, i dunno what to show to users ¯\_(ツ)_/¯
            }
        }
    }

    const thumbnailUrl = thumbnail ? `http://localhost:8080/public/${thumbnail}` : `https://ddnet.org/ranks/maps/${map_name.replaceAll(" ", "_")}.png`

    return (
        <div className={"event"}>
            <div className="event__inner">
                <div className="row jc-sb">
                    <EventStartTime startAt={start_at} status={status}/>
                    <Avatar src={null} username={username}/>
                    <div className={"event__interested"}>
                        <img src={peopleIcon}/>
                        <span>{interested}</span>
                    </div>
                </div>
                <div className="event__main row jc-sb">
                    <div>
                        <p className="event__title" onClick={onClick}>{map_name}</p>
                        <p className="event__description">{description}</p>
                    </div>
                    <img src={thumbnailUrl} className={"event__thumbnail"} alt="map thumbnail"/>
                </div>
                <hr/>
                <div className="event__footer row jc-sb">
                    <EventPlace place={place}/>
                    <div>
                        <div className={"event__more"}>
                            <button className={"event__more-btn"} onClick={() => setIsShowMorePanelHidden(!isShowMorePanelHidden)}>...</button>
                            <div data-hidden={isShowMorePanelHidden} ref={ref} className={classNames({"event__more-panel": !isShowMorePanelHidden}, {"hidden": isShowMorePanelHidden})}>
                                {isOwner && <button onClick={() => setIsShowMorePanelHidden(true)}>Edit Event</button>}
                                {isOwner && status == 0 && <button onClick={startEventCb(id)}>Start Event</button>}
                                {isOwner && status == 1 && <button className={"event__more-panel-red"} onClick={endEventCb(id)}>End Event</button>}
                            </div>
                        </div>
                        <button className={classNames("event__btn", {"event__btn-active": is_interested})} onClick={setIsInterestedCb(id)}><img src={is_interested ? checkMark : bellIcon}/>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}