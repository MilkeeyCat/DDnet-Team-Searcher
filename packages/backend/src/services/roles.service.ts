import { Db } from "./db.service.js"
import { Role } from "@app/shared/types/Role.type"
import { QueryResult } from "pg"

class Service {
    async getUserRoles(userId: string): Promise<QueryResult<Role>> {
        return await Db.query(`SELECT roles.name, roles.color, roles.url FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1`, [userId])
    }

    async getUserPermissions(userId: string) {

    }
}

export const RolesService = new Service()