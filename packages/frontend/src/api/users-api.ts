import { LoginRequest } from "@app/shared/types/LoginRequest.type"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setIsAuthed, setUserData } from "../store/slices/app"
import { User } from "../types/User.type"
import { baseUrl } from "./baseUrl"

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/`,
        credentials: "include"
    }),
    endpoints: (build) => ({
        //TODO: write a type for response 
        registerUser: build.mutation<{}, RegistrationRequest>({
            query: (body) => ({
                url: `register`,
                method: "POST",
                body
            }),
        }),
        //TODO: and here as well :\
        loginUser: build.mutation<{}, LoginRequest>({
            query: (body) => ({
                url: `login`,
                method: "POST",
                body
            })
        }),
        getUserData: build.query<User, void>({
            query: () => `fetch-data`,
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled
                
                    dispatch(setUserData(data))
                    dispatch(setIsAuthed(true))                
                } catch (e: any) { //TODO: do something with this fucking ANY
                    // user is not authed ¯\_(ツ)_/¯
                }
            },
        }),
        getUserProfile: build.query<{}, string>({
            query: (userId) => {
                return {
                    url: `user/${userId}`
                }
            }
        })
    }),
})

export const { useRegisterUserMutation, useLoginUserMutation, useLazyGetUserDataQuery, useLazyGetUserProfileQuery } = usersApi