import { Response } from "express"

export type AuthMiddlewareResponse<T = any, K = unknown> = Response<T, {user: {
    id: number,
    email: string
}} & K>