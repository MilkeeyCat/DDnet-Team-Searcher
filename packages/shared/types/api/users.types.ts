import { APIResponse } from "../APIResponse.type";
import { LoginRequest } from "../LoginRequest.type";
import { RegistrationRequest } from "../RegistrationRequest.type";
import { Role } from "../Role.type";
import { User, UserWithPermissions } from "@app/shared/types/User.type.js"
import { Run } from "../Happenings.type.js"

export type RegistrationResponse = APIResponse<"REGISTRATION_FAILED" | "REGISTRATION_SUCCESSFUL", {
    field: keyof RegistrationRequest;
    text: string;
} | string>

export type LoginResponse = APIResponse<"LOGIN_FAILED" | "LOGIN_SUCCESSFUL", {
    field: keyof LoginRequest;
    text: string;
} | string>

export type UserRolesResponse = APIResponse<"USER_NOT_FOUND" | "SUCCESS", Array<Role>>

export type UserDataResponse = APIResponse<"SUCCESS", UserWithPermissions>

export type UserFollowResponse = APIResponse<"SUCCESS" | "ERROR_OCURRED" | "USER_DOESNT_EXISTS", string>

export type UserProfileResponse = APIResponse<"USER_NOT_FOUND" | "SUCCESS", User & {following?: boolean, followStats?: {followers: number, following: number}}>

export type UserRunsResponse = APIResponse<"USER_NOT_FOUND" | "SUCCESS", Array<Run>>