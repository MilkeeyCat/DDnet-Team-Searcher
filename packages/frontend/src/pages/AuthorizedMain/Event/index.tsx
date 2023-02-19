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
import { Link } from "react-router-dom"
import { hint } from "../../../store/slices/hints"
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
                        dispatch(hint({type: "error", text: res.data}))
                    }
                }

            } catch (err: any) {
                if("data" in err) {
                    dispatch(hint({type: "error", text: err.data}))
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
        <div className={classNames("max-w-[530px] w-full bg-primary-2 rounded-[10px] flex flex-col hover:scale-[1.01] transition-all duration-150", {[className || ""]: !!className})}>
            <div className="p-2.5 grow-[1] flex flex-col">
                <div className="flex justify-between">
                    <EventStartTime startAt={start_at} status={status}/>
                    <Link to={`/profile/${event.author_id}`} className="ml-auto">
                        <Avatar src={null} username={username}/>
                    </Link>
                    <div className="bg-primary-3 text-high-emphasis px-[7px] py-[3px] rounded-full flex items-center ml-2.5">
                        <img src={peopleIcon}/>
                        <span className="text-[12px] ml-1">{interested}</span>
                    </div>
                </div>
                <div className="flex justify-between mt-5">
                    <div>
                        <p className="text-high-emphasis font-semibold cursor-pointer" onClick={onClick}>{map_name}</p>
                        <p className="mt-1 text-medium-emphasis">{description}</p>
                    </div>
                    <img src={thumbnailUrl} className="max-w-[220px] w-full max-h-[95px] rounded-[10px] object-cover" alt="map thumbnail"/>
                </div>
                <hr className="w-full border-[1] border-[#3F362B] mt-2.5 mb-4"/>
                <div className="flex justify-between mt-auto items-center">
                    <EventPlace place={place}/>
                    <div className="flex">
                        <div className="relative">
                            <button className="text-high-emphasis flex" onClick={() => setIsShowMorePanelHidden(!isShowMorePanelHidden)}>...</button>
                            <div data-hidden={isShowMorePanelHidden} ref={ref} className={classNames({"absolute min-w-[200px] l-2.5 bg-[#15120D] flex flex-col rounded-[10px]": !isShowMorePanelHidden}, {"hidden": isShowMorePanelHidden})}>
                                {isOwner && status == 0 && <button className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1" onClick={startEventCb(id)}>Start Event</button>}
                                {isOwner && <button className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1" onClick={editEventCb}>Edit Event</button>}
                                {isOwner && status == 1 && <button className={"text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error"} onClick={endEventCb(id)}>End Event</button>}
                                {isOwner && status != 1 && <button className={"text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error"} onClick={deleteEventCb(id)}>Delete Event</button>}
                            </div>
                        </div>
                        <button className={classNames("py-1 px-2.5 bg-primary-3 text-high-emphasis rounded-[5px] flex items-center ml-2.5", {"bg-[#383129] !text-primary-1": is_interested})} onClick={setIsInterestedCb(id)}><img className="mr-2.5" src={is_interested ? checkMark : bellIcon}/>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}