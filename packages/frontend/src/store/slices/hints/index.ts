import {createSlice, PayloadAction} from "@reduxjs/toolkit"

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
            const length = state.hints.length

            state.hints.push(action.payload)

            setTimeout(() => {
                state.hints.splice(length, 1)
            }, 500)
        }
    }
})

//action creators
export const {addHint} = hintsSlice.actions
//@ts-ignore
window.addHint = addHint;


export default hintsSlice.reducer