// import {createSlice, PayloadAction} from "@reduxjs/toolkit"
// // import { Run } from "../../../types/Run.type";
// import { Run } from "@app/shared/types/Happenings.type"

// interface RunsState {
//     runs: Array<Run>;
// }

// const initialState: RunsState = {
//     runs: [],
// }

// export const runsSlice = createSlice({
//     name: "runsReducer",
//     initialState,
//     reducers: {
//         setRuns(state, action: PayloadAction<Run[]>) {
//             state.runs = action.payload
//         },
//         updateRunStatus(state, action: PayloadAction<{ id: string, status: "0" | "1" | "2" }>) {
//             state.runs = state.runs.map(run => {
//                 if (run.id == action.payload.id) {
//                     run.status = action.payload.status
//                 }

//                 return run
//             })
//         },
//         setIsInterested(state, action: PayloadAction<{ runId: number, isInterested: 0 | 1 }>) {
//             const run = state.runs.filter(run => parseInt(run.id) == action.payload.runId)[0]

//             run.is_interested = action.payload.isInterested.toString() as "0" | "1"
//             run.interested = (parseInt(run.interested) + (action.payload.isInterested ? 1 : -1)).toString()
//         }
//     }
// })

// export const {setRuns, updateRunStatus, setIsInterested} = runsSlice.actions

// export default runsSlice.reducer
export {}