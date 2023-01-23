import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Run } from "../../../types/Run.type";

interface RunsState {
    runs: Array<Run>;
    // availableMaps: Map[]
}

const initialState: RunsState = {
    runs: [],
    // availableMaps: []
}

export const hintsSlice = createSlice({
    name: "runsReducer",
    initialState,
    reducers: {
        // setAvailableMaps(state, action: PayloadAction<Map[]>) {
        //     state.availableMaps = action.payload
        // },
        setRuns(state, action: PayloadAction<Run[]>) {
            state.runs = action.payload
        },
        updateRunStatus(state, action: PayloadAction<{ id: string, status: "0" | "1" | "2" }>) {
            state.runs = state.runs.map(run => {
                if (run.id == action.payload.id) {
                    run.status = action.payload.status
                }

                return run
            })
        },
        setIsInterested(state, action: PayloadAction<{ runId: number, isInterested: 0 | 1 }>) {
            const run = state.runs.filter(run => parseInt(run.id) == action.payload.runId)[0]

            run.is_interested = action.payload.isInterested.toString() as "0" | "1"
            run.interested = (parseInt(run.interested) + (action.payload.isInterested ? 1 : -1)).toString()
        }
    }
})

//action creators
export const {setRuns, updateRunStatus, setIsInterested} = hintsSlice.actions

export default hintsSlice.reducer