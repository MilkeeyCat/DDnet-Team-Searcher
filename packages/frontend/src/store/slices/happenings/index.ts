import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Run, Event } from "@app/shared/types/Happenings.type"

interface RunsState {
    runs: Array<Run>;
    events: Array<Event>;
}

const initialState: RunsState = {
    runs: [],
    events: []
}

export const happeningsReducer = createSlice({
    name: "happeningsReducer",
    initialState,
    reducers: {
        setRuns(state, action: PayloadAction<Array<Run>>) {
            state.runs = action.payload
        },
        updateRunStatus(state, action: PayloadAction<{ id: number, status: Run["status"]}>) {
            state.runs = state.runs.map(run => {
                if (run.id == action.payload.id) {
                    run.status = action.payload.status
                }

                return run
            })
        },
        setIsInterestedInRun(state, action: PayloadAction<{ runId: number, isInterested: 0 | 1 }>) {
            const run = state.runs.filter(run => run.id == action.payload.runId)[0]

            run.is_interested = action.payload.isInterested
            run.interested = (run.interested + (action.payload.isInterested ? 1 : -1))
        },
        setEvents(state, action: PayloadAction<Event[]>) {
            state.events = action.payload
        },
        updateEventStatus(state, action: PayloadAction<{ id: number, status: Event["status"] }>) {
            state.events = state.events.map(event => {
                if (event.id == action.payload.id) {
                    event.status = action.payload.status
                }

                return event
            })
        },
        setIsInterestedInEvent(state, action: PayloadAction<{ eventId: number, isInterested: 0 | 1 }>) {
            const event = state.events.filter(event => event.id == action.payload.eventId)[0]

            event.is_interested = action.payload.isInterested
            event.interested = (event.interested + (action.payload.isInterested ? 1 : -1))
        }
    }
})

export const {setRuns, updateRunStatus, setIsInterestedInRun, setEvents, updateEventStatus, setIsInterestedInEvent} = happeningsReducer.actions

export default happeningsReducer.reducer