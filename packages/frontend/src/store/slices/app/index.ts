import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { AppDispatch } from "../..";
import { Map } from "@app/shared/types/Map.type"
import { UserWithPermissions } from "@app/shared/types/User.type";

type Nullable<T> = {
    [P in keyof T]: T[P] extends object ? Nullable<T[P]> : T[P] | null;
}

interface AppState {
    user:  Nullable<UserWithPermissions>;
    isAuthed: boolean;
    isCreateRunModalHidden: boolean;
    isCreateEventModalHidden: boolean;
    editingHappening: {
        isEditHappeningModalHidden: boolean;
        editingHappeningId: null | number;
        editingHappeningType: null | "run" | "event";
    };
    maps: Array<Map>;
}

const initialState: AppState = {
    user: {
        id: null,
        username: null,
        email: null,
        tier: null,
        created_at: null,
        verified: null,
        avatar: null,
        permissions: {
            can_ban: 0,
            can_create_roles: 0,
            can_edit_posts: 0,
            can_delete_happenings: 0
        },
        banned: {
            banned: null,
            reason: null
        },
        followStats: {
            followers: null,
            following: null
        },
        userStats: {
            eventsCount: null,
            runsCount: null
        }
    },
    isAuthed: false,
    isCreateRunModalHidden: true,
    isCreateEventModalHidden: true,
    editingHappening: {
        isEditHappeningModalHidden: true,
        editingHappeningId: null,
        editingHappeningType: null
    },
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
    return async () => {
        const req = await fetch(`https://ddstats.org/ddnet-693575f.json?sql=SELECT+*%2C+SUM%28Points%29+FROM%0D%0A%28SELECT+race.Timestamp%2C+maps.Points+FROM+race+INNER+JOIN+maps+ON+maps.Map+%3D+race.Map+WHERE+race.Name+%3D+%22${encodeURI(username)}%22+GROUP+BY+race.Map%29%0D%0AGROUP+BY+strftime%28%22%25Y%22%2C+Timestamp%29`)
        
        return await req.json()
    }
}

export const getFavoriteUserServer = (username: string) => {
    return async (): Promise<string | undefined> => {
        const req = await fetch(`https://ddstats.org/ddnet-0f28546.json?sql=SELECT+Server+FROM%0D%0A%28SELECT+race.Timestamp%2C+race.Server%2C+maps.Points+FROM+race+INNER+JOIN+maps+ON+maps.Map+%3D+race.Map+WHERE+race.Name+%3D+%22${username}%22+GROUP+BY+race.Map%29%0D%0AGROUP+BY+Server+ORDER+BY+COUNT%28Server%29+DESC+LIMIT+1`)

        //@ts-ignore TODO: Add type here
        return await (await req.json()).rows[0]
    }
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setMaps(state, action: PayloadAction<Array<Map>>) {
            state.maps = action.payload
        },
        setUserData(state, action: PayloadAction<UserWithPermissions>) {
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
        },
        setIsEditHappeningModalHidden(state, action: PayloadAction<boolean>) {
            state.editingHappening.isEditHappeningModalHidden = action.payload
        },
        setEditingHappeningId(state, action: PayloadAction<number | null>) {
            state.editingHappening.editingHappeningId = action.payload
        },
        setEditingHappeningType(state, action: PayloadAction<null | "run" | "event">) {
            state.editingHappening.editingHappeningType = action.payload
        }
    }
})

export const { setMaps, setIsAuthed, setUserData, setIsCreateRunModalHidden, setIsCreateEventModalHidden, setIsEditHappeningModalHidden, setEditingHappeningId, setEditingHappeningType} = appSlice.actions

export default appSlice.reducer