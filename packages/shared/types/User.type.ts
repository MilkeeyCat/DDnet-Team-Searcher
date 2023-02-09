import { Permissions } from "./Permissions.type.js";

export type User = {
    id: number;
    username: string;
    email: string;
    created_at: string;
    avatar: string | null;
    tier: number;
    verified: 0 | 1;
}

export type UserWithPassword = {
    password: string;
} & User

export type UserWithPermissions = User & {
    permissions: Permissions
}