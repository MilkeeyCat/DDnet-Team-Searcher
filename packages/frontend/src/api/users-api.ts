import { LoginRequest } from '@app/shared/types/LoginRequest.type'
import { RegistrationRequest } from '@app/shared/types/RegistrationRequest.type'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setIsAuthed, setUserData } from '../store/slices/app'
import {
    LoginResponse,
    RegistrationResponse,
    UserDataResponse,
    UserProfileResponse,
    UserRolesResponse,
    UserRunsResponse,
    UserFollowResponse,
    UserReportResponse,
    UserEventsResponse,
    UserGetReviewsAboutUserResponse,
    UserBanResponse,
    UserUnbanResponse,
} from '@app/shared/types/api/users.types'

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        credentials: 'include',
    }),
    endpoints: (build) => ({
        registerUser: build.mutation<RegistrationResponse, RegistrationRequest>(
            {
                query: (body) => ({
                    url: `register`,
                    method: 'POST',
                    body,
                }),
            }
        ),
        loginUser: build.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: `login`,
                method: 'POST',
                body,
            }),
            transformErrorResponse: (res) => {
                return res.data
            },
        }),
        getUserData: build.query<UserDataResponse, void>({
            query: () => `fetch-data`,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled

                    if (data.data) {
                        dispatch(setUserData(data.data))
                        dispatch(setIsAuthed(true))
                    }
                } catch (e) {
                    console.log(e)
                }
            },
        }),
        getUserProfile: build.query<UserProfileResponse['data'], number>({
            query: (userId) => {
                return {
                    url: `user/${userId}`,
                }
            },
            transformResponse: (res: UserProfileResponse) => {
                return res.data
            },
        }),
        getUserRuns: build.query<UserRunsResponse, number>({
            query: (userId) => {
                return {
                    url: `user/${userId}/runs`,
                }
            },
        }),
        getUserEvents: build.query<UserEventsResponse['data'], number>({
            query: (userId) => `user/${userId}/events`,
            transformResponse: (res: UserEventsResponse) => res.data
        }),
        getUserRoles: build.query<UserRolesResponse['data'], number>({
            query: (userId) => ({
                    url: `user/${userId}/roles`,
            }),
            transformResponse: (res: UserRolesResponse) => {
                return res.data
            },
        }),
        followUser: build.mutation<UserFollowResponse, number>({
            query: (userId) => ({
                url: `user/${userId}/follow`,
                method: 'PUT',
            }),
            transformErrorResponse: (res) => res.data
        }),
        reportUser: build.mutation<UserReportResponse, {userId: number, text: string}>({
            query: ({userId, text}) => ({
                url: `user/${userId}/report`,
                method: "POST",
                body: {text}
            }),
            transformErrorResponse: (res) => res.data
        }),
        getReviewsAboutUser: build.query<UserGetReviewsAboutUserResponse['data'], number>({
            query: (userId) => `/user/${userId}/reviews`,
            transformResponse: (res: UserGetReviewsAboutUserResponse) => res.data
        }),
        banUser: build.mutation<UserBanResponse, {userId: number, reason: string | null}>({
            query: ({userId, reason}) => ({
                url: `/user/${userId}/ban`,
                method: "POST",
                body: {reason}
            }),
            transformErrorResponse: (res) => res.data
        }),
        unbanUser:  build.mutation<UserUnbanResponse, number>({
            query: (userId) => ({
                url: `/user/${userId}/unban`,
                method: "POST",
            }),
            transformErrorResponse: (res) => res.data
        }),
    }),
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLazyGetUserDataQuery,
    useGetUserProfileQuery,
    useGetUserRunsQuery,
    useGetUserEventsQuery,
    useGetUserRolesQuery,
    useFollowUserMutation,
    useReportUserMutation,
    useGetReviewsAboutUserQuery,
    useBanUserMutation,
    useUnbanUserMutation
} = usersApi
