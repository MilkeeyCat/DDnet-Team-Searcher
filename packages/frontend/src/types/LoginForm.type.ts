import { LoginRequest } from "@app/shared/types/LoginRequest.type"

export interface LoginForm extends LoginRequest {
    rememberMe: boolean;
}