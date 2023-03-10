import {Db} from "./db.service.js"
import bcrypt from "bcrypt"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type.js";
import { User, UserWithPassword, UserWithPermissions } from "@app/shared/types/User.type.js"
import { RolesService } from "./roles.service.js";
import { QueryResult } from "pg";
import { Service } from "./service.js";

export type DBUser = {
    id: number,
    username: string,
    email: string,
    password: string,
    avatar: null | string,
    created_at: string,
    updated_at: string,
    tier: number,
    verified: number
}

export class MyService<T extends object> extends Service<T> {
    async register(data: RegistrationRequest): Promise<boolean> {
        try {
            const encryptedPassword = await bcrypt.hash(data.password, 10)
            await Db.query("INSERT INTO users (username, email, password, tier) VALUES($1, $2, $3, $4)", [data.username, data.email, encryptedPassword, data.tier.toString()])

            return true
        } catch(e) {
            return false
        }
    }

    async isUserExistsByUsername(username: string): Promise<number | false> {
        const res = await Db.query<{id: number}>("SELECT id::integer FROM users WHERE username = $1 LIMIT 1", [username])
    
        if(res.rowCount) {
            return res.rows[0].id
        } else {
            return false
        }
    }

    async isUserExistsByEmail(userEmail: string): Promise<number | false> {
        const res = await Db.query<{id: number}>("SELECT id::integer FROM users WHERE email = $1 LIMIT 1", [userEmail])
    
        if(res.rowCount) {
            return res.rows[0].id
        } else {
            return false
        }
    }

    async isUserExistsById(userId: number): Promise<number | false> {
        const res = await Db.query<{id: number}>("SELECT id::integer FROM users WHERE id = $1 LIMIT 1", [userId])
        
        if(res.rowCount) {
            return res.rows[0].id
        } else {
            return false
        }
    }

    async getUserData<T extends boolean = false, P extends boolean = false>(userId: number, withPassword: T = false as T, withPermissions: P = false as P): Promise<T extends true ? UserWithPassword : P extends true ? UserWithPermissions : User> {
        const res = await (await Db.query<T extends true ? UserWithPassword : P extends true ? UserWithPermissions : User>(`SELECT id::integer, username, email, avatar, created_at, tier, verified${withPassword ? `, password` : ``} FROM users WHERE id = $1 LIMIT 1`, [userId])).rows[0]

        if(withPermissions) {
            const permissions = await RolesService.getUserPermissions(userId);

            (res as UserWithPermissions).permissions = permissions
        } 

        return res
    }

    async getRoles(userId: string) {
        const res = await Db.query(`SELECT roles.name, roles.color, roles.url, roles.can_delete_happenings, roles.can_edit_posts, roles.can_ban, roles.can_create_roles FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1`, [userId])
    }

    async getAll(): Promise<QueryResult<DBUser>> {
        return await Db.query(`SELECT id::integer, username, email, avatar, created_at, updated_at, tier, verified FROM users`)
    }
}

export const UsersService = new MyService<Exclude<DBUser, "password">>("users")