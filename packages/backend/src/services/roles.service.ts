import { Db } from "./db.service.js"
import { QueryResult } from "pg"
import { Role } from "@app/shared/types/Role.type.js"
import { Permissions } from "@app/shared/types/Permissions.type.js"

type DBRoles = {
    id: number;
    name: string;
    color: string;
    url: string | null;
} & Permissions

class Service {
    async getUserRoles(userId: string): Promise<QueryResult<Role>> {
        return await Db.query(`SELECT roles.name, roles.color, roles.url FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1`, [userId])
    }

    async getUserPermissions(userId: string): Promise<Permissions> {
        // I didnt know how to put all of this shit in one query so I will leave it as 4 questions :\
        const can_ban = await this.checkPermission(userId, "can_ban")
        const can_create_roles = await this.checkPermission(userId, "can_create_roles")
        const can_edit_posts = await this.checkPermission(userId, "can_edit_posts")
        const can_delete_happenings = await this.checkPermission(userId, "can_delete_happenings")
    
        return {
            can_ban,
            can_create_roles,
            can_edit_posts,
            can_delete_happenings
        }
    }

    async checkPermission(userId: string, permissionName: keyof Permissions): Promise<1 | 0> {
        const res = await Db.query(`
        SELECT roles.${permissionName} FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1 AND roles.${permissionName} = 1;
        `, [userId])

        if(res.rowCount) {
            return 1
        } else {
            return 0
        }
    }
}

export const RolesService = new Service()