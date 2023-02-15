import { Schema } from "express-validator"
import { ValidationEnum } from "./type.js"
import fetch from "node-fetch"
import { Map } from "@app/shared/types/Map.type.js";

export const happeningSchema: Schema = {
    place: {
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
        toInt: {}
    },
    mapName: {
        exists: {
            errorMessage: ValidationEnum.Required
        },
        isString: {
            errorMessage: ValidationEnum.String
        },
        trim: {},
        custom: {
            options: async (value) => {
                const request = await fetch("https://ddnet.org/releases/maps.json")
                const availableMaps = await request.json() as Array<Map>
                const mapNames = availableMaps?.map((map) => map.name)
                
                if (!mapNames.includes(value)) {
                    return Promise.reject(ValidationEnum.NotValid)
                }

                return true
            }
        }
    },
    teamSize: {
        exists: {
            errorMessage: ValidationEnum.Required
        },
        isInt:{
            options: {
                min: 2,
                max: 64
            },
            errorMessage: "Field has to be number in range 2-64"
        },
        toInt: {},
    },
    description: {
        optional: {
            options: {
                nullable: true
            }
        },
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
    }
}