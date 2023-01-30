import {ValidatorType} from "../types/Validator.type"

export const composeValidators = (value: string | number | null, validators: ValidatorType[]) => {
    for (const validator of validators) {
        const error = validator(value);

        if (error) {
            return error;
        }
    }

    return undefined;
};