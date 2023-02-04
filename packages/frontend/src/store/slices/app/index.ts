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

export const getUserStats = (username: string) => {
    return async (dispatch: AppDispatch) => {
        const req = await fetch(`https://ddstats.org/ddnet-693575f.json?sql=SELECT+*%2C+SUM%28Points%29+FROM%0D%0A%28SELECT+race.Timestamp%2C+maps.Points+FROM+race+INNER+JOIN+maps+ON+maps.Map+%3D+race.Map+WHERE+race.Name+%3D+%22${encodeURI(username)}%22+GROUP+BY+race.Map%29%0D%0AGROUP+BY+strftime%28%22%25Y%22%2C+Timestamp%29`)
        console.log(`https://ddstats.org/ddnet-693575f.json?sql=SELECT+*%2C+SUM%28Points%29+FROM%0D%0A%28SELECT+race.Timestamp%2C+maps.Points+FROM+race+INNER+JOIN+maps+ON+maps.Map+%3D+race.Map+WHERE+race.Name+%3D+%22${encodeURI(username)}%22+GROUP+BY+race.Map%29%0D%0AGROUP+BY+strftime%28%22%25Y%22%2C+Timestamp%29`);
        
        return await req.json()
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