import { NextFunction, Request, Response } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";

// this middleware checks id's from urls
export const paramsValidatorMiddleware = (validationSchema: Schema, arr: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const newSchema: Schema = {}

        arr.map(el => {
            newSchema[el] = validationSchema.id
        })

        await checkSchema(newSchema).run(req)

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            res.status(400).json({
                status: "BAD_DATA",
                data: errors.array()[0].msg
            })
            return
        }

        next()
    }
}