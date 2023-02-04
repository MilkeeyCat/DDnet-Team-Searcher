import {Db} from "./db.service.js"
import bcrypt from "bcrypt"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type.js";

export class Service {
    async register(data: RegistrationRequest) {
        const encryptedPassword = await bcrypt.hash(data.password, 10)
        return await Db.query("INSERT INTO users (username, email, password, tier) VALUES($1, $2, $3, $4)", [data.username, data.email, encryptedPassword, data.tier.toString()])
    }

    async isUserExistsByUsername(username: string): Promise<string | false> {
        const req = await Db.query("SELECT id FROM users WHERE username = $1 LIMIT 1", [username])
    
        if(req.rows.length) {
            return req.rows[0].id
        } else {
            return false
        }
    }

    async isUserExistsByEmail(userEmail: string): Promise<string | false> {
        const req = await Db.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [userEmail])
    
        if(req.rows.length) {
            return req.rows[0].id
        } else {
            return false
        }
    }

    async isUserExistsById(userId: string): Promise<string | false> {
        const req = await Db.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [userId])
        console.log(req);
        
        if(req.rows.length) {
            return req.rows[0].id
        } else {
            return false
        }
    }

    // async findUser(obj: {[key: string]: any}, or: boolean = false) {
    //     let keys = Object.keys(obj)

    //     const where: string = keys.reduce((prev, current) => {
    //         const b = typeof obj[current] === "number" ? obj[current] : `'${obj[current]}'`

    //         return prev + (prev !== "" ? ` ${or ? "OR" : "AND"} ${current} = ${b}` : `WHERE ${current} = ${b}`)
    //     }, "")

    //     return await Db.query<User>(`SELECT * FROM users ${where}`)
    // }

    // async getUserProfile(userId: string) {
    //     const user = await Db.query<User>("SELECT * FROM users WHERE id = $1", [userId])
    
    //     delete (user.rows[0] as Partial<User>).password

    //     return user
    // }
    async getUserData(userId: string, withPassword: boolean = false) {
        const res = await Db.query(`SELECT id, username, email, avatar, registration_date, tier, verified${withPassword ? `, password` : ``} FROM users WHERE id = $1`, [userId])

        return res.rows[0]
    }

    async getRoles(userId: string) {
        const res = await Db.query(`SELECT roles.name, roles.color, roles.url, roles.can_delete_happenings, roles.can_edit_posts, roles.can_ban, roles.can_create_roles FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1`, [userId])
    }
}

export const UsersService = new Service()