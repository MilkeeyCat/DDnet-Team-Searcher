import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { AddOrRemoveFromTeamResponse, CreateEventResponse, CreateRunResponse, DeleteHappeningResponse, EndHappeningResponse, GetAllEventsResponse, GetAllRunsResponse, InterestedPlayersResponse, SetInterestedResponse, StartHappeningResponse, UpdateRunResponse } from '@app/shared/types/api/happenings.type'
import { CreateRunForm } from '../types/CreateRunForm.type'

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
        createRun: build.mutation<CreateRunResponse, CreateRunForm>({
            query: (body) => ({
                url: `create/run`,
                method: 'POST',
                body,
            }),
            transformErrorResponse: (err) => {
                return err.data
            }
        }),
        createEvent: build.mutation<CreateEventResponse, FormData>({
            query: (body) => ({
                url: `create/event`,
                method: 'POST',
                body,
            }),
            transformErrorResponse: (err) => {
                return err.data
            }
        }),
        updateRun: build.mutation<UpdateRunResponse, {id: number, happening: CreateRunForm}>({
            query: ({id, happening}) => ({
                url: `${id}/update/run`,
                method: "PUT",
                body: happening
            }),
            transformErrorResponse: (res) => {
                return res.data
            }
        }),
        updateEvent: build.mutation<UpdateRunResponse, {id: number, happening: FormData}>({
            query: ({id, happening}) => ({
                url: `${id}/update/event`,
                method: "PUT",
                body: happening
            }),
            transformErrorResponse: (res) => {
                return res.data
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
            }),
            transformErrorResponse: (res) => res.data
        }),
        setIsInterested: build.mutation<SetInterestedResponse, number>({
            query: (id) => ({
                url: `${id}/interested`,
                method: 'PUT',
            }),
            transformErrorResponse: (res) => res.data
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
    useUpdateRunMutation,
    useUpdateEventMutation,
    useStartHappeningMutation,
    useEndHappeningMutation,
    useDeleteHappeningMutation,
    useSetIsInterestedMutation,
    useLazyGetInterestedPlayersQuery,
    useUpdateIsPlayerInTeamMutation,
} = happeningsApi
