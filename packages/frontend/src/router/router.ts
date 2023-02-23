import { GuestMain } from '../pages/GuestMain'
import { AuthorizedMain } from '../pages/AuthorizedMain'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { ResetPassword } from '../pages/ResetPassword'
import { Profile } from '../pages/Profile'
import { Bans } from '../pages/Bans'
import React from 'react'
import { NotFound } from '../pages/NotFound'
import { Roles } from '../pages/Roles'
import { Reports } from '../pages/Reports'
import { Users } from '../pages/Users'

export interface IRoute {
    path: string
    Component: React.ComponentType<any>
    title?: string
    children?: Array<IRoute>
}

export enum RouteNames {
    MAIN = '/',
    LOGIN = '/login',
    REGISTER = '/register',
    RESET_PASSWORD = '/forgor-password',
    LOGGEDIN = '/',
    PROFILE = '/profile/:userId?',

    ADMIN_ROLES = '/admin/roles',
    ADMIN_BANS = '/admin/bans',
    ADMIN_USERS = '/admin/users',
    ADMIN_REPORTS = '/admin/reports',

    NOT_FOUND = '*',
}

export const publicRoute: IRoute[] = [
    {
        path: RouteNames.MAIN,
        Component: GuestMain,
        title: 'Main Page',
    },
    {
        path: RouteNames.LOGIN,
        Component: Login,
        title: 'Login Page',
    },
    {
        path: RouteNames.REGISTER,
        Component: Register,
        title: 'Sign up Page',
    },
    {
        path: RouteNames.RESET_PASSWORD,
        Component: ResetPassword,
        title: 'Reset password page',
    },
    {
        path: RouteNames.NOT_FOUND,
        Component: NotFound,
    },
]

export const privateRoute: IRoute[] = [
    {
        path: RouteNames.LOGGEDIN,
        Component: AuthorizedMain,
        title: 'Main Page',
    },
    {
        path: RouteNames.PROFILE,
        Component: Profile,
        title: 'Profile',
    },
    {
        path: RouteNames.ADMIN_BANS,
        Component: Bans,
    },
    {
        path: RouteNames.ADMIN_USERS,
        Component: Users
    },
    {
        path: RouteNames.ADMIN_ROLES,
        Component: Roles,
    },
    {
        path: RouteNames.ADMIN_REPORTS,
        Component: Reports,
    },
    {
        path: RouteNames.NOT_FOUND,
        Component: NotFound,
    },
]
