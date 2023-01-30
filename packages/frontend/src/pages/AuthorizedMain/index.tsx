import {Modal} from "../../components/ui/Modal"
import {Field, Form, Formik, FormikHelpers} from "formik"
import {RadioInput} from "./RadioInput"
import {InputWithLabel} from "./InputWithLabel"
import {TextareaWithLabel} from "./TextareaWithLabel"
import {Button} from "../../components/ui/Button"
import {useEffect, useState} from "react"
import {useAppDispatch, useAppSelector} from "../../utils/hooks/hooks"
import {addHint} from "../../store/slices/hints"
import {composeValidators} from "../../utils/composeValidators"
import {required} from "../../utils/validators/required"
import {getMaps, setIsCreateEventModalHidden, setIsCreateRunModalHidden} from "../../store/slices/app"
import {RunInfoModal} from "./RunInfoModal"
import { useCreateRunMutation, useLazyGetRunsQuery } from "../../api/runs-api"
import { setRuns } from "../../store/slices/runs"
import { setEvents } from "../../store/slices/events"
import { Runs } from "./Runs"

import "./styles.scss"
import { Events } from "./Events"
import { CreateEventModal } from "./CreateEventModal"
import { useLazyGetEventsQuery } from "../../api/events-api"
import { EventInfoModal } from "./EventInfoModal"
import { CreateRunModal } from "./CreateRunModal"



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
        //@ts-ignore TODO: WRITE FUCKING TYPES
        dispatch(setRuns(getRunsData))
        //@ts-ignore TODO: WRITE FUCKING TYPES
        dispatch(setEvents(getEventsData))
    }, [getRunsData, getEventsData])

    const runOnClick = (runId: string) => {
        return () => {
            setIsRunInfoModalOpened(true);
            setRunInfoModalRunId(parseInt(runId))
        }
    }

    const eventOnClick = (eventId: string) => {
        return () => {
            setIsEventInfoModalOpened(true);
            setEventInfoModalEventId(parseInt(eventId))
        }
    }

    return (
        <>
            <CreateRunModal isVisible={!isCreateRunModalHidden} onClose={() => {
                dispatch(setIsCreateRunModalHidden(true))
            }}/>
            <CreateEventModal isVisible={!isCreateEventModalHidden} onClose={()=>{
                dispatch(setIsCreateEventModalHidden(true))
            }}/>

            <Events onClick={eventOnClick}/>
            <Runs onClick={runOnClick}/>

            {isRunInfoModalOpened && <RunInfoModal onClose={()=>setIsRunInfoModalOpened(false)} runId={runInfoModalRunId!}/>}
            {isEventInfoModalOpened && <EventInfoModal onClose={()=>setIsEventInfoModalOpened(false)} eventId={eventInfoModalEventId!}/>}
        </>
    )
}