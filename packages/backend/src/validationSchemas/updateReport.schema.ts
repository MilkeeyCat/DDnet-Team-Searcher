import { Schema } from "express-validator";
import { ValidationEnum } from "./type.js";

export const updateReportSchema: Schema = {
    id: {
        optional: {},
        isInt: {
            errorMessage: ValidationEnum.Number
        }
    },
    user_id: {
        optional: {},
        isInt: {
            errorMessage: ValidationEnum.Number
        }
    },
    reported_user_id: {
        optional: {},
        isInt: {
            errorMessage: ValidationEnum.Number
        }
    },
    text: {
        optional: {},
        exists: {
            errorMessage: ValidationEnum.Required
        },
        isString: {
            errorMessage: ValidationEnum.String
        },
        trim: {},
        isLength: {
            options: {
                min: 1
            },
            errorMessage: ValidationEnum.NotEmpty
        }
    },
    // created_at: {
    //     optional: {},
    //     trim: {},
    //     custom: {
    //         options: (value) => {
    //             if(!/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(value)) {
    //                 return Promise.reject("Field is not valid time value")
    //             }

    //             return true
    //         }
    //     }
    // }
}