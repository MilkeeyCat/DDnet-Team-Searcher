import { Schema } from "express-validator";
import { ValidationEnum } from "./type.js";

export const reviewSchema: Schema = {
    reviewedUserId: {
        isInt: {
            errorMessage: ValidationEnum.Number
        }
    },
    happeningId: {
        isInt: {
            errorMessage: ValidationEnum.Number
        }
    },
    text: {
        optional: {
            options: {
                nullable: true
            }
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
    rate: {
        exists: {
            errorMessage: ValidationEnum.Required
        },
        isInt: {
            options: {
                min: 1,
                max: 5
            },
            errorMessage: "Field value has to be in range 1-5"
        }
    }
}