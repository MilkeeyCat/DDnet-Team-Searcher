// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

// export const runsApi = createApi({
//   reducerPath: "runsApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:8080/api/run",
//     credentials: "include",
//   }),
//   endpoints: (build) => ({
//     getRuns: build.query<{}, void>({
//       query: () => `all`,
//     }),
//     createRun: build.mutation<{}, any>({
//       query: (body) => ({
//         url: `create`,
//         method: "POST",
//         body,
//       }),
//     }),
//     endRun: build.mutation<{}, number>({
//       query: (id) => ({
//         url: `${id}/end`,
//         method: "PUT",
//       }),
//     }),
//     startRun: build.mutation<{}, number>({
//       query: (id) => ({
//         url: `${id}/start`,
//         method: "PUT",
//       }),
//     }),
//     setIsInterested: build.mutation<{}, number>({
//       query: (id) => ({
//         url: `${id}/interested`,
//         method: "PUT",
//       }),
//     }),
//     getInterestedPlayers: build.query<{}, number>({
//       query: (id) => ({
//         url: `${id}/interested`,
//       }),
//     }),
//     updateIsPlayerInTeam: build.mutation<{}, { runId: number; userId: number }>(
//       {
//         query: ({ runId, userId }) => ({
//           url: `${runId}/in-team/${userId}`,
//           method: "PUT",
//         }),
//       }
//     ),
//   }),
// })

// export const {
//   useLazyGetRunsQuery,
//   useCreateRunMutation,
//   useEndRunMutation,
//   useStartRunMutation,
//   useSetIsInterestedMutation,
//   useLazyGetInterestedPlayersQuery,
//   useUpdateIsPlayerInTeamMutation,
// } = runsApi

export {}