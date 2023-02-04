import {GuestMain} from "../pages/GuestMain"
import {AuthorizedMain} from "../pages/AuthorizedMain"
import {Login} from "../pages/Login"
import {Register} from "../pages/Register"
import {ResetPassword} from "../pages/ResetPassword"
import { Profile } from "../pages/Profile"

export interface IRoute {
    path: string;
    Component: () => JSX.Element;
    title?: string;
}

export enum RouteNames {
    MAIN = "/",
    LOGIN = "/login",
    REGISTER = "/register",
    RESET_PASSWORD = "/forgor-password",
    LOGGEDIN = "/",
    PROFILE = "/profile/:userId?"
}

export const publicRoute: IRoute[] = [
    {
        path: RouteNames.MAIN,
        Component: GuestMain,
        title: "Main Page"
    },
    {
        path: RouteNames.LOGIN,
        Component: Login,
        title: "Login Page"
    },
    {
        path: RouteNames.REGISTER,
        Component: Register,
        title: "Sign up Page"
    },
    {
        path: RouteNames.RESET_PASSWORD,
        Component: ResetPassword,
        title: "Reset password page"
    }
]

export const privateRoute: IRoute[] = [
    {
        path: RouteNames.LOGGEDIN,
        Component: AuthorizedMain,
        title: "Main Page"
    },
    {
        path: RouteNames.PROFILE,
        Component: Profile,
        title: "Profile"
    }
]

