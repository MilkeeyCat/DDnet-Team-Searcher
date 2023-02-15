import { Schema } from "express-validator";
import { happeningSchema } from "./happening.schema.js";
import { ValidationEnum } from "./type.js";

export const runSchema: Schema = {
    ...happeningSchema,
    runStartDate: {
        exists: {
            errorMessage: ValidationEnum.Required
        },
        trim: {},
        isDate: {
            errorMessage: "Field value is not valid date string"
        }
    },
    runStartTime: {
        exists: {
            errorMessage: ValidationEnum.Required
        },
        trim: {},
        custom: {
            options: (value) => {
                if(!/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(value)) {
                    return Promise.reject("Field is not valid time value")
                }

                return true
            }
        }
    },
}