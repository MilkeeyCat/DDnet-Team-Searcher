import {ValidatorType} from "../../types/Validator.type"

export const required: ValidatorType = (value) => {
    if (!value) return "Field is required"
    return undefined
}