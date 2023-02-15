import { Schema } from "express-validator";
import { happeningSchema } from "./happening.schema.js";
import { ValidationEnum } from "./type.js";

export const eventSchema: Schema = {
    ...happeningSchema,
    eventStartDate: {
        exists: {
            errorMessage: ValidationEnum.Required
        },
        trim: {},
        isDate: {
            errorMessage: "Field value is not valid date string"
        }
    },
    eventStartTime: {
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
    endAtDate: {
        optional: {
            options: {
                nullable: true
            }
        },
        trim: {},
        isDate: {
            errorMessage: "Field value is not valid date string"
        }
    },
    endAtTime: {
        optional: {
            options: {
                nullable: true
            }
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
    thumbnail: {
        optional: {
            options: {
                nullable: true
            }
        }
    }
}