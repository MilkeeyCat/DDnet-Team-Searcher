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
import "./styles.scss"
import { Link } from "react-router-dom"
import { addHint } from "../../../store/slices/hints"
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
                        dispatch(addHint({type: "error", text: res.data}))
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
            } catch (e: any) {
                console.log(e);
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
        <div className={classNames("run", {[className || ""]: className})}>
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
                    <Link to={`/profile/${run.author_id}`}>
                        <Avatar src={null} username={username}/>
                    </Link>
                    <div>
                        <div className={"run__more"}>
                            <button className={"run__more-btn"} onClick={() => setIsShowMorePanelHidden(!isShowMorePanelHidden)}>...</button>
                            <div data-hidden={isShowMorePanelHidden} ref={ref} className={classNames({"run__more-panel": !isShowMorePanelHidden}, {"hidden": isShowMorePanelHidden})}>
                                {isOwner && status == 0 && <button onClick={startRunCb(id)}>Start Run</button>}
                                {isOwner && <button onClick={editRunCb}>Edit Run</button>}
                                {isOwner && status == 1 && <button className={"run__more-panel-red"} onClick={endRunCb(id)}>End Run</button>}
                                {isOwner && status != 1 && <button className={"run__more-panel-red"} onClick={deleteRunCb(id)}>Delete Run</button>}
                            </div>
                        </div>
                        <button className={classNames("run__btn", {"run__btn-active": is_interested})} onClick={setIsInterestedCb(id)}><img src={is_interested ? checkMark : bellIcon}/>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}