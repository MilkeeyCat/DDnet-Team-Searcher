import {configureStore} from "@reduxjs/toolkit"
import appReducer from "./slices/app"
import hintsReducer from "./slices/hints"
import happeningsReducer from "./slices/happenings"
import { usersApi } from "../api/users-api"
import { happeningsApi } from "../api/happenings-api"

export const store = configureStore({
    reducer: {
        app: appReducer,
        hints: hintsReducer,
        happeningsReducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [happeningsApi.reducerPath]: happeningsApi.reducer
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(usersApi.middleware, happeningsApi.middleware)
    )
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {runs: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch