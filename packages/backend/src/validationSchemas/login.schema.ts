import { Schema } from "express-validator";
import { ValidationEnum } from "./type.js";

export const loginSchema: Schema = {
    username: {
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
    password: {
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
    }
}