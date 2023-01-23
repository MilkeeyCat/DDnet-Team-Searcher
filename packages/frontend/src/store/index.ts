import {configureStore} from "@reduxjs/toolkit"
import appReducer from "./slices/app"
import hintsReducer from "./slices/hints"
import runsReducer from "./slices/runs"
import { usersApi } from "../api/users-api"
import { runsApi } from "../api/runs-api"

export const store = configureStore({
    reducer: {
        app: appReducer,
        hints: hintsReducer,
        runsReducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [runsApi.reducerPath]: runsApi.reducer
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(usersApi.middleware, runsApi.middleware)
    )
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {runs: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch