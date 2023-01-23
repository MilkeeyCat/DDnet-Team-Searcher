import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { AppDispatch } from "../..";
import { User } from "../../../types/User.type";

interface Map {
    name: string;
    website: string;
    thumbnail: string;
    web_preview: string;
    type: string;
    points: number;
    difficulty: number;
    mapper: string;
    release: string;
    width: number;
    height: number;
    tiles: Array<string>
}

interface AppState {
    user: User;
    isAuthed: boolean;
    isCreateRunModalHidden: boolean;
    maps: Array<Map>
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
        }
    }
})

export const { setMaps, setIsAuthed, setUserData, setIsCreateRunModalHidden} = appSlice.actions

export default appSlice.reducer