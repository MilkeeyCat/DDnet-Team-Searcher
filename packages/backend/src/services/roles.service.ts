import { Db } from "./db.service.js"
import { QueryResult } from "pg"
import { Role } from "@app/shared/types/Role.type.js"
import { Permissions } from "@app/shared/types/Permissions.type.js"

export type DBRoles = {
    id: number;
    name: string;
    color: string;
    url: string | null;
} & Permissions

class Service {
    async getUserRoles(userId: number): Promise<QueryResult<Role>> {
        return await Db.query(`SELECT roles.name, roles.color, roles.url FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1`, [userId])
    }

    async getUserPermissions(userId: number): Promise<Permissions> {
        // I didnt know how to put all of this shit in one query so I will leave it as 4 queries :\
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

    async checkPermission(userId: number, permissionName: keyof Permissions): Promise<1 | 0> {
        const res = await Db.query(`
        SELECT roles.${permissionName} FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1 AND roles.${permissionName} = 1;
        `, [userId])

        if(res.rowCount) {
            return 1
        } else {
            return 0
        }
    }

    async getRoles(): Promise<Array<DBRoles>> {
        return await (await Db.query<DBRoles>("SELECT name, color, url, can_ban, can_delete_happenings, can_edit_posts, can_create_roles FROM roles")).rows
    }

    async updateRole({can_ban, can_create_roles, can_delete_happenings, can_edit_posts, color, name, url, id}: DBRoles): Promise<boolean> {
        try {
            await Db.query("UPDATE TABLE roles SET url = $1, name = $2, color = $3, can_edit_posts = $4, can_delete_happenings = $5, can_create_roles = $6, can_ban = $7 WHERE id = $8", [url, name, color, can_edit_posts, can_delete_happenings, can_create_roles, can_ban, id])
            return true
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async deleteRole(roleId: number): Promise<boolean> {
        try {
            await Db.query("DELETE FROM roles WHERE id = $1", [roleId])
            return true
        } catch(e) {
            console.log(e)
            return false
        }
    }
}

export const RolesService = new Service()