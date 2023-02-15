import { Schema } from "express-validator";
import { ValidationEnum } from "./type.js";

export const registerSchema: Schema = {
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
    email: {
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
        },
        isEmail: {
            errorMessage: "Field value is not valid email address" 
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
    },
    tier: {
        exists: {
            errorMessage: ValidationEnum.Required
        },
        isInt: {
            options: {
                min: 1,
                max: 6
            },
            errorMessage: ValidationEnum.NotValid
        },
        toInt: {},
    }
}