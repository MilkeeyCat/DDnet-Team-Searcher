export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
    avatar: string | null;
    tier: number;
    verified: 0 | 1;
}

export interface UserWithPassword extends User {
    password: string;
}