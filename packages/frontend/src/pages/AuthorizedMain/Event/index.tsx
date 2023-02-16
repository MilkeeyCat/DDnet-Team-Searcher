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
import { useDeleteHappeningMutation, useEndHappeningMutation, useSetIsInterestedMutation, useStartHappeningMutation } from "../../../api/happenings-api"
import { setEvents, setIsInterestedInEvent, updateEventStatus } from "../../../store/slices/happenings"
import "./styles.scss"
import { Link } from "react-router-dom"
import { addHint } from "../../../store/slices/hints"
import { setEditingHappeningId, setEditingHappeningType, setIsEditHappeningModalHidden } from "../../../store/slices/app"

interface OwnProps {
    event: EventType;
    onClick: () => void;
    className?: string;
}

export const Event: React.FC<OwnProps> = ({className, onClick, event}) => {
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
        connect_string,
        thumbnail
    } = event

    const dispatch = useAppDispatch()
    const [endEvent] = useEndHappeningMutation()
    const [startEvent] = useStartHappeningMutation()
    const [deleteEvent] = useDeleteHappeningMutation()
    const [setIsInerested] = useSetIsInterestedMutation()
    const userId = useAppSelector(state => state.app.user.id)
    const isOwner = author_id == userId
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true)
    const ref = useRef<null | HTMLDivElement>(null)
    const events = useAppSelector(state => state.happeningsReducer.events)

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
            } catch (e: any) {
                console.log(e);
            }
        }
    }

    const startEventCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                await startEvent(id).unwrap()

                dispatch(updateEventStatus({id, status: 1}))
            } catch (e: any) {
                console.log(e);
            }
        }
    }

    const deleteEventCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                const res = await deleteEvent(id).unwrap()

                if(res.status === "HAPPENING_DELETED_SUCCESSFULLY") {
                    dispatch(setEvents([...events.filter(event => event.id != id)]))
                } else {
                    if(res.data) {
                        dispatch(addHint({type: "error", text: res.data}))
                    }
                }

            } catch (err: any) {
                if("data" in err) {
                    dispatch(addHint({type: "error", text: err.data}))
                }                
            }
        }
    }

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                const res = await setIsInerested(id).unwrap()

                dispatch(setIsInterestedInEvent({eventId: id, isInterested: res.data ? 1 : 0}))
            } catch (e: any) {
                console.log(e);
            }
        }
    }

    const editEventCb = () => {
        setIsShowMorePanelHidden(true)
        dispatch(setIsEditHappeningModalHidden(false))
        dispatch(setEditingHappeningId(id))
        dispatch(setEditingHappeningType("event"))
    }

    const thumbnailUrl = thumbnail ? `http://localhost:8080/public/${thumbnail}` : `https://ddnet.org/ranks/maps/${map_name.replaceAll(" ", "_")}.png`

    return (
        <div className={classNames("event", {[className || ""]: !!className})}>
            <div className="event__inner">
                <div className="row jc-sb">
                    <EventStartTime startAt={start_at} status={status}/>
                    <Link to={`/profile/${event.author_id}`} className="ml-auto">
                        <Avatar src={null} username={username}/>
                    </Link>
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
                                {isOwner && status == 0 && <button onClick={startEventCb(id)}>Start Event</button>}
                                {isOwner && <button onClick={editEventCb}>Edit Event</button>}
                                {isOwner && status == 1 && <button className={"event__more-panel-red"} onClick={endEventCb(id)}>End Event</button>}
                                {isOwner && status != 1 && <button className={"event__more-panel-red"} onClick={deleteEventCb(id)}>Delete Event</button>}
                            </div>
                        </div>
                        <button className={classNames("event__btn", {"event__btn-active": is_interested})} onClick={setIsInterestedCb(id)}><img src={is_interested ? checkMark : bellIcon}/>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}