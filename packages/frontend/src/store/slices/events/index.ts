// import {createSlice, PayloadAction} from "@reduxjs/toolkit"
// import { Event } from "../../../types/Event.type";

// interface EventState {
//     events: Array<Event>;
// }

// const initialState: EventState = {
//     events: [],
// }

// export const eventsSlice = createSlice({
//     name: "eventsReducer",
//     initialState,
//     reducers: {
//         setEvents(state, action: PayloadAction<Event[]>) {
//             state.events = action.payload
//         },
//         updateEventStatus(state, action: PayloadAction<{ id: string, status: "0" | "1" | "2" }>) {
//             state.events = state.events.map(event => {
//                 if (event.id == action.payload.id) {
//                     event.status = action.payload.status
//                 }

//                 return event
//             })
//         },
//         setIsInterested(state, action: PayloadAction<{ eventId: number, isInterested: 0 | 1 }>) {
//             const event = state.events.filter(event => parseInt(event.id) == action.payload.eventId)[0]

//             event.is_interested = action.payload.isInterested.toString() as "0" | "1"
//             event.interested = (parseInt(event.interested) + (action.payload.isInterested ? 1 : -1)).toString()
//         }
//     }
// })

// //action creators
// export const {setEvents, updateEventStatus, setIsInterested} = eventsSlice.actions

// export default eventsSlice.reducer
export {}