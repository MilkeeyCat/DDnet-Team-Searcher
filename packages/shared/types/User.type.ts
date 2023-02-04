export interface User {
    id: string;
    username: string;
    email: string;
    registration_date: string;
    avatar: string | null;
    tier: number;
    verified: 0 | 1;
}

export interface UserWithPassword extends User {
    password: string;
}