import { NextFunction, Request, Response } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";

export const bodyValidatorMiddleware = (validationSchema: Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await checkSchema(validationSchema).run(req)

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            res.status(400).json({
                status: "BAD_DATA",
                data: {
                    field: errors.array()[0].param,
                    text: errors.array()[0].msg,
                }
            })
            return
        }

        next()
    }
}