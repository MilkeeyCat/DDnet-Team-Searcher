import {Avatar} from "../../../components/Avatar"
import peopleIcon from "../../../assets/images/run-people.svg"
import bellIcon from "../../../assets/images/run-bell.svg"
import checkMark from "../../../assets/images/check-mark.png"
import classNames from "classnames"
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/hooks"
import {useRef, useState} from "react"
import {EventStartTime} from "../EventStartTime"
import {EventPlace} from "../EventPlace"
import { useDeleteHappeningMutation, useEndHappeningMutation, useSetIsInterestedMutation, useStartHappeningMutation } from "../../../api/happenings-api"
import { setIsInterestedInRun, setRuns, updateRunStatus } from "../../../store/slices/happenings"
import { useOutsideClickHandler } from "../../../utils/hooks/useClickedOutside"
import { Run as RunType } from "@app/shared/types/Happenings.type"
import { Link } from "react-router-dom"
import { hint } from "../../../store/slices/hints"
import { setEditingHappeningId, setEditingHappeningType, setIsEditHappeningModalHidden } from "../../../store/slices/app"

interface OwnProps {
    run: RunType;
    onClick: () => void;
    className?: string;
}

export const Run: React.FC<OwnProps> = ({className, onClick, run}) => {
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
    const [endRun] = useEndHappeningMutation()
    const [startRun] = useStartHappeningMutation()
    const [deleteRun] = useDeleteHappeningMutation()
    const [setIsInerested] = useSetIsInterestedMutation()
    const userId = useAppSelector(state => state.app.user.id)
    const isOwner = author_id == userId
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true)
    const ref = useRef<null | HTMLDivElement>(null)
    const runs = useAppSelector(state => state.happeningsReducer.runs)

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
            } catch (e: any) {
                console.log(e);
            }
        }
    }

    const deleteRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                const res = await deleteRun(id).unwrap()

                if(res.status === "HAPPENING_DELETED_SUCCESSFULLY") {
                    dispatch(setRuns([...runs.filter(run => run.id != id)]))
                } else {
                    if(res.data) {
                        dispatch(hint({type: "error", text: res.data}))
                    }
                }

            } catch (e: any) {
                console.log(e);
            }
        }
    }

    const startRunCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true)
            
            try {
                await startRun(id).unwrap()

                dispatch(updateRunStatus({id, status: 1}))
            } catch (e: any) {
                console.log(e);
            }
        }
    }

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                const res = await setIsInerested(id).unwrap()

                dispatch(setIsInterestedInRun({runId: id, isInterested: res.data ? 1 : 0}))
            } catch (e) {
                const err = e as any

                console.log(err);
                

                if("data" in err) {
                    dispatch(hint({type: "error", text: err.data}))
                }
            }
        }
    }

    const editRunCb = () => {
        setIsShowMorePanelHidden(true)
        dispatch(setIsEditHappeningModalHidden(false))
        dispatch(setEditingHappeningId(id))
        dispatch(setEditingHappeningType("run"))
    }

    return (
        <div className={classNames("max-w-[255px] w-full bg-primary-2 rounded-[10px] flex flex-col hover:scale-[1.01] transition-all duration-150", {[className || ""]: className})}>
            <img src={`https://ddnet.org/ranks/maps/${map_name.replaceAll(" ", "_")}.png`} className="w-full max-h-[100px] object-cover rounded-t-[10px]" alt="map thumbnail"/>
            <div className="p-2.5 flex flex-col grow-[1]">
                <div className="flex justify-between">
                    <EventStartTime startAt={start_at} status={status}/>
                    <div className={"bg-primary-3 text-high-emphasis py-[3px] px-[7px] rounded-full flex items-center"}>
                        <img src={peopleIcon}/>
                        <span className="text-[12px] ml-1">{interested}</span>
                    </div>
                </div>
                <EventPlace place={place}/>
                <p className="mt-4 text-high-emphasis font-semibold cursor-pointer" onClick={onClick}>{map_name}</p>
                <p className="mt-1 text-medium-emphasis">{description}</p>
                <div className="mt-auto flex items-center justify-between">
                    <Link to={`/profile/${run.author_id}`}>
                        <Avatar src={null} username={username}/>
                    </Link>
                    <div className="flex">
                        <div className={"relative"}>
                            <button className={"text-high-emphasis flex"} onClick={() => setIsShowMorePanelHidden(!isShowMorePanelHidden)}>...</button>
                            <div data-hidden={isShowMorePanelHidden} ref={ref} className={classNames({"absolute min-w-[200px] l-2.5 bg-[#15120D] flex flex-col rounded-[10px]": !isShowMorePanelHidden}, {"hidden": isShowMorePanelHidden})}>
                                {isOwner && status == 0 && <button className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1" onClick={startRunCb(id)}>Start Run</button>}
                                {isOwner && <button className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1" onClick={editRunCb}>Edit Run</button>}
                                {isOwner && status == 1 && <button className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error" onClick={endRunCb(id)}>End Run</button>}
                                {isOwner && status != 1 && <button className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error" onClick={deleteRunCb(id)}>Delete Run</button>}
                            </div>
                        </div>
                        <button className={classNames("py-1 px-2.5 bg-primary-3 text-high-emphasis rounded-[5px] flex items-center ml-2.5", {"bg-[#383129] !text-primary-1": is_interested})} onClick={setIsInterestedCb(id)}><img className="mr-2.5" src={is_interested ? checkMark : bellIcon}/>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}