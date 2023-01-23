export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    tier: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}