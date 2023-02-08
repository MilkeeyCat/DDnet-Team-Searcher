import { Response } from "express"

// export interface ResponseHandler<T, E extends {}> extends E {
//     json: (data: T) => this
// }

export type ResponseHandler<T, E extends Response = Response> = Omit<E, "json" | "status"> & {
    status: (status: number) => ResponseHandler<T, E>
    json: (data: T) => any
}