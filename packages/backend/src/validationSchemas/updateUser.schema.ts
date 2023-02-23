import { Schema } from "express-validator";
import { ValidationEnum } from "./type.js";

export const updateUserSchema: Schema = {
    id: {
        optional: {},
        isInt: {
            errorMessage: ValidationEnum.Number
        }
    },
    username: {
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
    email: {
        optional: {},
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
    avatar: {
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
    created_at: {
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
    updated_at: {
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
    tier: {
        optional: {},
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
    },
    verified: {
        optional: {},
        exists: {
            errorMessage: ValidationEnum.Required
        },
        isInt: {
            options: {
                min: 0,
                max: 1
            },
            errorMessage: ValidationEnum.NotValid
        },
        toInt: {},
    }
}