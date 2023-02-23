import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { AdministrationDeleteBan, AdministrationDeleteReport, AdministrationDeleteUser, AdministrationGetBans, AdministrationGetReports, AdministrationGetRoles, AdministrationGetUsers, AdministrationUpdateBanInfo, AdministrationUpdateReport, AdministrationUpdateUser } from "@app/shared/types/api/administration.type"

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
        getReports: build.query<AdministrationGetReports["data"], void>({
            query: () => `/reports`,
            transformResponse: (res: AdministrationGetReports) => res.data
        }),
        getUsers: build.query<AdministrationGetUsers["data"], void>({
            query: () => `/users`,
            transformResponse: (res: AdministrationGetUsers) => res.data
        }),
        getRoles: build.query<AdministrationGetRoles["data"], void>({
            query: () => `/roles`,
            transformResponse: (res: AdministrationGetRoles) => res.data
        }),
        updateBan: build.mutation<AdministrationUpdateBanInfo, {banId: number, data: {[key: string]: any}}>({
            query: ({banId, data}) => ({
                url: `/ban/${banId}`,
                method: "PUT",
                body: data
            }),
            transformErrorResponse: (res) => res.data
        }),
        updateReport: build.mutation<AdministrationUpdateReport, {reportId: number, data: {[key: string]: any}}>({
            query: ({reportId, data}) => ({
                url: `/report/${reportId}`,
                method: "PUT",
                body: data
            }),
            transformErrorResponse: (res) => res.data
        }),
        updateUser: build.mutation<AdministrationUpdateUser, {userId: number, data: {[key: string]: any}}>({
            query: ({userId, data}) => ({
                url: `/user/${userId}`,
                method: "PUT",
                body: data
            }),
            transformErrorResponse: (res) => res.data
        }),
        updateRole: build.mutation<AdministrationUpdateUser, {roleId: number, data: {[key: string]: any}}>({
            query: ({roleId, data}) => ({
                url: `/role/${roleId}`,
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
        }),
        deleteReport: build.mutation<AdministrationDeleteReport, number>({
            query: (reportId) => ({
                url: `/report/${reportId}`,
                method: "DELETE"
            }),
            transformErrorResponse: (res) => res.data
        }),
        deleteUser: build.mutation<AdministrationDeleteUser, number>({
            query: (userId) => ({
                url: `/user/${userId}`,
                method: "DELETE"
            }),
            transformErrorResponse: (res) => res.data
        }),
        deleteRole: build.mutation<AdministrationDeleteUser, number>({
            query: (roleId) => ({
                url: `/role/${roleId}`,
                method: "DELETE"
            }),
            transformErrorResponse: (res) => res.data
        })
    }),
})

export const {
    useGetBansQuery,
    useUpdateBanMutation,
    useDeleteBanMutation,
    useGetReportsQuery,
    useUpdateReportMutation,
    useDeleteReportMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetRolesQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation
} = administrationApi
