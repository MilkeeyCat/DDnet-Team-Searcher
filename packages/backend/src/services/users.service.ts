import {Db} from "./db.service.js"
import bcrypt from "bcrypt"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type.js";

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    tier: number;
    registration_date: string;
    avatar: string | null;
}

export class Service {
    async register(data: RegistrationRequest) {
        const encryptedPassword = await bcrypt.hash(data.password, 10)
        return await Db.query("INSERT INTO users (username, email, password, tier) VALUES($1, $2, $3, $4)", [data.username, data.email, encryptedPassword, data.tier.toString()])
    }

    async findUser(obj: {[key: string]: any}, or: boolean = false) {
        let keys = Object.keys(obj)

        const where: string = keys.reduce((prev, current) => {
            const b = typeof obj[current] === "number" ? obj[current] : `'${obj[current]}'`

            return prev + (prev !== "" ? ` ${or ? "OR" : "AND"} ${current} = ${b}` : `WHERE ${current} = ${b}`)
        }, "")

        return await Db.query<User>(`SELECT * FROM users ${where}`)
    }
}

export const UsersService = new Service()