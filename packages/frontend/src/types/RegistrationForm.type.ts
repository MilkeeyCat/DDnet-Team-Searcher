import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type"

export interface RegistrationForm extends RegistrationRequest {
    confirmPassword: string;
}