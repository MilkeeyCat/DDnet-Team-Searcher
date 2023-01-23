import { Response } from "express"

export type AuthMiddlewareResponse<T = any, K = unknown> = Response<T, {user: {
    id: string,
    email: string
}} & K>