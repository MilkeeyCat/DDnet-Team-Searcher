import {Db} from "./db.service.js"
import bcrypt from "bcrypt"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type.js";
import { User, UserWithPassword } from "@app/shared/types/User.type.js"

export interface DBUser {
    id: string;
    username: string;
    avatar: null | string;
}

export class Service {
    async register(data: RegistrationRequest): Promise<boolean> {
        try {
            const encryptedPassword = await bcrypt.hash(data.password, 10)
            await Db.query("INSERT INTO users (username, email, password, tier) VALUES($1, $2, $3, $4)", [data.username, data.email, encryptedPassword, data.tier.toString()])

            return true
        } catch(e) {
            return false
        }
    }

    async isUserExistsByUsername(username: string): Promise<string | false> {
        const res = await Db.query<{id: string}>("SELECT id FROM users WHERE username = $1 LIMIT 1", [username])
    
        if(res.rowCount) {
            return res.rows[0].id
        } else {
            return false
        }
    }

    async isUserExistsByEmail(userEmail: string): Promise<string | false> {
        const res = await Db.query<{id: string}>("SELECT id FROM users WHERE email = $1 LIMIT 1", [userEmail])
    
        if(res.rowCount) {
            return res.rows[0].id
        } else {
            return false
        }
    }

    async isUserExistsById(userId: string): Promise<string | false> {
        const res = await Db.query<{id: string}>("SELECT id FROM users WHERE id = $1 LIMIT 1", [userId])
        
        if(res.rowCount) {
            return res.rows[0].id
        } else {
            return false
        }
    }

    async getUserData<T extends boolean = false>(userId: string, withPassword: T = false as T): Promise<T extends true ? UserWithPassword : User> {
        const res = await Db.query<T extends true ? UserWithPassword : User>(`SELECT id::integer, username, email, avatar, created_at, tier, verified${withPassword ? `, password` : ``} FROM users WHERE id = $1`, [userId])

        return res.rows[0]
    }

    async getRoles(userId: string) {
        const res = await Db.query(`SELECT roles.name, roles.color, roles.url, roles.can_delete_happenings, roles.can_edit_posts, roles.can_ban, roles.can_create_roles FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1`, [userId])
    }
}

export const UsersService = new Service()