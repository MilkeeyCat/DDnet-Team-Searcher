import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { Event } from "../types/Event.type";
import { baseUrl } from "./baseUrl";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/event`,
    credentials: "include",
  }),
  endpoints: (build) => ({
    getEvents: build.query<Array<Event>, void>({
      query: () => `all`,
    }),
    createEvent: build.mutation<{}, any>({
      query: (body) => ({
        url: `create`,
        method: "POST",
        body
      }),
    }),
    endEvent: build.mutation<{}, number>({
      query: (id) => ({
        url: `${id}/end`,
        method: "PUT",
      }),
    }),
    startEvent: build.mutation<{}, number>({
      query: (id) => ({
        url: `${id}/start`,
        method: "PUT",
      }),
    }),
    setIsInterested: build.mutation<{}, number>({
      query: (id) => ({
        url: `${id}/interested`,
        method: "PUT",
      }),
    }),
    getInterestedPlayers: build.query<{}, number>({
      query: (id) => ({
        url: `${id}/interested`,
      }),
    }),
    updateIsPlayerInTeam: build.mutation<{}, { eventId: number; userId: number }>(
      {
        query: ({ eventId, userId }) => ({
          url: `${eventId}/in-team/${userId}`,
          method: "PUT",
        }),
      }
    ),
  }),
})

export const {
  useLazyGetEventsQuery,
  useCreateEventMutation,
  useEndEventMutation,
  useStartEventMutation,
  useSetIsInterestedMutation,
  useLazyGetInterestedPlayersQuery,
  useUpdateIsPlayerInTeamMutation,
} = eventsApi