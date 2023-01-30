import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { AppDispatch } from "../..";
import { User } from "../../../types/User.type";
import { Map } from "@app/shared/types/Map.type"

interface AppState {
    user: User;
    isAuthed: boolean;
    isCreateRunModalHidden: boolean;
    isCreateEventModalHidden: boolean;
    maps: Array<Map>;
}

const initialState: AppState = {
    user: {
        id: null,
        username: null,
        email: null,
        tier: null,
        registration_date: null,
        avatar: null
    },
    isAuthed: false,
    isCreateRunModalHidden: true,
    isCreateEventModalHidden: true,
    maps: []
}

export const getMaps =  () => {
    return async (dispatch: AppDispatch) => {
        try {
            const req = await fetch("https://ddnet.org/releases/maps.json")
            dispatch(setMaps(await req.json()))
        } catch (err) {
            // what should i do here? 
        }
    }
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setMaps(state, action: PayloadAction<Array<Map>>) {
            state.maps = action.payload
        },
        setUserData(state, action: PayloadAction<User>) {
            state.user = action.payload
        },
        setIsAuthed(state, action: PayloadAction<boolean>) {
            state.isAuthed = action.payload
        },
        setIsCreateRunModalHidden(state, action: PayloadAction<boolean>) {
            state.isCreateRunModalHidden = action.payload
        },
        setIsCreateEventModalHidden(state, action: PayloadAction<boolean>) {
            state.isCreateEventModalHidden = action.payload
        }
    }
})

export const { setMaps, setIsAuthed, setUserData, setIsCreateRunModalHidden, setIsCreateEventModalHidden} = appSlice.actions

export default appSlice.reducer