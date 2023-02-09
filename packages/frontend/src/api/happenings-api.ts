import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { AddOrRemoveFromTeamResponse, CreateEventResponse, CreateRunResponse, DeleteHappeningResponse, EndHappeningResponse, GetAllEventsResponse, GetAllRunsResponse, InterestedPlayersResponse, SetInterestedResponse, StartHappeningResponse } from '@app/shared/types/api/happenings.type'

export const happeningsApi = createApi({
    reducerPath: 'happeningsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/happenings',
        credentials: 'include',
    }),
    endpoints: (build) => ({
        getRuns: build.query<GetAllRunsResponse["data"], void>({
            query: () => `all/runs`,
            transformResponse: (res: GetAllRunsResponse) => {
                return res.data
            },
        }),
        getEvents: build.query<GetAllEventsResponse["data"], void>({
            query: () => `all/events`,
            transformResponse: (res: GetAllEventsResponse) => {
                return res.data
            },
        }),
        createRun: build.mutation<CreateRunResponse, any>({
            query: (body) => ({
                url: `create/run`,
                method: 'POST',
                body,
            }),
            // transformResponse: (res) => {
            //     return res.data
            // }
            transformErrorResponse: (err) => {
                return err.data
            }
        }),
        createEvent: build.mutation<CreateEventResponse, any>({
            query: (body) => ({
                url: `create/event`,
                method: 'POST',
                body,
            }),
            transformErrorResponse: (err) => {
                return err.data
            }
        }),
        endHappening: build.mutation<EndHappeningResponse, number>({
            query: (id) => ({
                url: `${id}/end`,
                method: 'PUT',
            }),
        }),
        startHappening: build.mutation<StartHappeningResponse, number>({
            query: (id) => ({
                url: `${id}/start`,
                method: 'PUT',
            }),
        }),
        deleteHappening: build.mutation<DeleteHappeningResponse, number>({
            query: (id) => ({
                url: `${id}/delete`,
                method: "DELETE"
            })
        }),
        setIsInterested: build.mutation<SetInterestedResponse, number>({
            query: (id) => ({
                url: `${id}/interested`,
                method: 'PUT',
            }),
        }),
        getInterestedPlayers: build.query<InterestedPlayersResponse, number>({
            query: (id) => ({
                url: `${id}/interested`,
            }),
        }),
        updateIsPlayerInTeam: build.mutation<AddOrRemoveFromTeamResponse, {
            happeningId: number;
            userId: number
        }>({
            query: ({ happeningId, userId }) => ({
                url: `${happeningId}/in-team/${userId}`,
                method: 'PUT',
            }),
        }),
    }),
})

export const {
    useLazyGetRunsQuery,
    useLazyGetEventsQuery,
    useCreateRunMutation,
    useCreateEventMutation,
    useStartHappeningMutation,
    useEndHappeningMutation,
    useDeleteHappeningMutation,
    useSetIsInterestedMutation,
    useLazyGetInterestedPlayersQuery,
    useUpdateIsPlayerInTeamMutation,
} = happeningsApi
