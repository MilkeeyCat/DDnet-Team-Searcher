import {ValidatorType} from "../../types/Validator.type"

export const maxLength = (maxLength: number): ValidatorType => (value) => {
    if (typeof value === "string" && value.length > maxLength) return "Your string is too large"
    return undefined
}