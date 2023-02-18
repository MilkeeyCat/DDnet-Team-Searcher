import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { AppDispatch } from "../..";

interface Hint {
    type: "error" | "success";
    text: string;
}

interface HintsState {
    hints: Hint[]
}

const initialState: HintsState = {
    hints: []
}

export const hintsSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        addHint(state, action: PayloadAction<Hint>) {
            state.hints.push(action.payload)
        },
        removeHint(state) {
            state.hints.splice(state.hints.length-1, 1)
        }
    }
})

const {addHint, removeHint} = hintsSlice.actions

export const hint = ({type, text}: Hint) => {
    return async (dispatch: AppDispatch) => {
        dispatch(addHint({type, text}))

        setTimeout(()=>{
            dispatch(removeHint())
        }, 5000)
    }
}

export default hintsSlice.reducer