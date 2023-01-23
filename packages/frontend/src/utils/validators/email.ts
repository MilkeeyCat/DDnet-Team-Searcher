import {ValidatorType} from "../../types/Validator.type"

export const email: ValidatorType = value => {
    if (typeof value === "string") {
        const filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        return filter.test(value) ? undefined : "Your email address is incorrect"
    }
}