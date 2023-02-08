export interface APIResponse<S = string, M = unknown> {
    // status: string;
    status: S;
    data?: M;
}