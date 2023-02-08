import {useEffect, useState} from "react"
import {useAppDispatch, useAppSelector} from "../../utils/hooks/hooks"
import {getMaps, setIsCreateEventModalHidden, setIsCreateRunModalHidden} from "../../store/slices/app"
import { setRuns, setEvents } from "../../store/slices/happenings"
import { Runs } from "./Runs"
import { Events } from "./Events"
import { useLazyGetEventsQuery, useLazyGetRunsQuery } from "../../api/happenings-api"
import { CreateHappeningModal } from "./CreateHappeningModal"
import { HappeningInfoModal } from "./HappeningInfoModal"

export const AuthorizedMain = () => {
    const dispatch = useAppDispatch()

    const [fetchRuns, {data: getRunsData}] = useLazyGetRunsQuery()
    const [fetchEvents, {data: getEventsData}] = useLazyGetEventsQuery()

    const isCreateRunModalHidden = useAppSelector(state => state.app.isCreateRunModalHidden)
    const isCreateEventModalHidden = useAppSelector(state => state.app.isCreateEventModalHidden)
    const [isRunInfoModalOpened, setIsRunInfoModalOpened] = useState(false)
    const [isEventInfoModalOpened, setIsEventInfoModalOpened] = useState(false)
    const [runInfoModalRunId, setRunInfoModalRunId] = useState<null | number>(null)
    const [eventInfoModalEventId, setEventInfoModalEventId] = useState<null | number>(null)

    useEffect(() => {
        dispatch(getMaps())
        fetchRuns()
        fetchEvents()
    }, [])

    useEffect(() => {
        dispatch(setRuns(getRunsData || []))
        dispatch(setEvents(getEventsData || []))
    }, [getRunsData, getEventsData])

    const runOnClick = (runId: number) => {
        return () => {
            setIsRunInfoModalOpened(true);
            setRunInfoModalRunId(runId)
        }
    }

    const eventOnClick = (eventId: number) => {
        return () => {
            setIsEventInfoModalOpened(true);
            setEventInfoModalEventId(eventId)
        }
    }

    return (
        <>
            <CreateHappeningModal type="run" isVisible={!isCreateRunModalHidden} onClose={() => {
                dispatch(setIsCreateRunModalHidden(true))
            }}/>
            <CreateHappeningModal type="event" isVisible={!isCreateEventModalHidden} onClose={()=>{
                dispatch(setIsCreateEventModalHidden(true))
            }}/>            

            <Events onClick={eventOnClick}/>
            <Runs onClick={runOnClick}/>

            {isEventInfoModalOpened && <HappeningInfoModal type="event" onClose={()=>setIsEventInfoModalOpened(false)} happeningId={eventInfoModalEventId!}/>}
            {isRunInfoModalOpened && <HappeningInfoModal type="run" onClose={()=>setIsRunInfoModalOpened(false)} happeningId={runInfoModalRunId!}/>}
        </>
    )
}