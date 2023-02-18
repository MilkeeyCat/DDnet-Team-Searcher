import { Permissions } from "./Permissions.type.js";

export type User = {
    id: number;
    username: string;
    email: string;
    created_at: string;
    avatar: string | null;
    tier: number;
    verified: 0 | 1;
    banned: {
        banned: boolean;
        reason: null | string;
    };
    followStats: {
        followers: number;
        following: number;
    };
    userStats: {
        runsCount: number;
        eventsCount: number;
    };
    // if you are getting other users' profile there will be these fields
    following?: boolean;
    reported?: boolean;
}

export type UserWithPassword = {
    password: string;
} & User

export type UserWithPermissions = User & {
    permissions: Permissions
}

// export type UserProfileResponse = APIResponse<"USER_NOT_FOUND" | "SUCCESS", User & {

// }>