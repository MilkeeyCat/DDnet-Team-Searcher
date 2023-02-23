import { Schema } from "express-validator";
import { ValidationEnum } from "./type.js";

export const updateRoleSchema: Schema = {
    id: {
        optional: {},
        isInt: {
            errorMessage: ValidationEnum.Number
        }
    },
    can_ban: {
        optional: {},
        isInt: {
            options: {
                min: 0,
                max: 1
            },
            errorMessage: ValidationEnum.Number
        }
    },
    can_delete_happenings: {
        optional: {},
        isInt: {
            options: {
                min: 0,
                max: 1
            },
            errorMessage: ValidationEnum.Number
        }
    },
    can_edit_posts: {
        optional: {},
        isInt: {
            options: {
                min: 0,
                max: 1
            },
            errorMessage: ValidationEnum.Number
        }
    },
    can_create_roles: {
        optional: {},
        isInt: {
            options: {
                min: 0,
                max: 1
            },
            errorMessage: ValidationEnum.Number
        }
    },
    name: {
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
        }
    },
    color: {
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
        }
    }
}