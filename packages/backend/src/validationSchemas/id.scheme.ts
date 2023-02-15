import { Schema } from "express-validator";

export const idSchema: Schema = {
    id: {
        in: "params",
        exists: {
            errorMessage: "Id it required"
        },
        isNumeric: {
            errorMessage: "Id has to be a number"
        },
        toInt: {}
    }
}