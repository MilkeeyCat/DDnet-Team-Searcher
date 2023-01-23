import {ValidatorType} from "../../types/Validator.type"

export const minLength = (minLength: number): ValidatorType => (value) => {
    if (typeof value === "string" && value.length < minLength) return "Your string is too short"
    return undefined
}