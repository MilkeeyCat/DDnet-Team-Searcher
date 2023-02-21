import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { AdministrationDeleteBan, AdministrationGetBans, AdministrationUpdateBanInfo } from "@app/shared/types/api/administration.type"

export const administrationApi = createApi({
    reducerPath: 'administrationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/administration',
        credentials: 'include',
    }),
    endpoints: (build) => ({
        getBans: build.query<AdministrationGetBans["data"], void>({
            query: () => `/bans`,
            transformResponse: (res: AdministrationGetBans) => res.data
        }),
        updateBan: build.mutation<AdministrationUpdateBanInfo, {banId: number, data: {[key: string]: any}}>({
            query: ({banId, data}) => ({
                url: `/ban/${banId}`,
                method: "PUT",
                body: data
            }),
            transformErrorResponse: (res) => res.data
        }),
        deleteBan: build.mutation<AdministrationDeleteBan, number>({
            query: (banId) => ({
                url: `/ban/${banId}`,
                method: "DELETE"
            }),
            transformErrorResponse: (res) => res.data
        })
    }),
})

export const {
    useGetBansQuery,
    useUpdateBanMutation,
    useDeleteBanMutation
} = administrationApi
