export interface APIResponse {
    status: string;
    message: (string | {field: string; text: string})[]
}