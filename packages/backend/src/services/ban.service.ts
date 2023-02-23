import { Db } from "./db.service.js"
import { Service } from "./service.js"

export type DBBan = {
    id: number,
    reason: string | null,
    author_id: number,
    user_id: number,
    created_at: string
}

class MyService<T extends object> extends Service<T> {
    async isUserBanned(userId: number): Promise<{banned: boolean, reason: string | null}> {
        const isBanned = await Db.query<{reason: string}>("SELECT reason FROM banned_list WHERE user_id = $1", [userId])

        if(isBanned.rowCount) {
            return {
                banned: true,
                reason: isBanned.rows[0].reason
            }
        }

        return {
            banned: false,
            reason: null
        }
    }

    async banUser(userId: number, reason: string | null = null, authorId: number): Promise<boolean> {
        try {
            await Db.query("INSERT INTO banned_list (user_id, reason, author_id) VALUES($1, $2, $3)", [userId, reason, authorId])
            return true
        } catch(e) {
            console.log(e);
            return false
        }
    }

    async unbanUser(userId: number): Promise<boolean> {
        try {
            await Db.query("DELETE FROM banned_list WHERE user_id = $1", [userId])
            return true
        } catch(e) {
            console.log(e);
            return false
        }
    }

    async getAll(): Promise<Array<DBBan>> {
        return await (await Db.query<DBBan>("SELECT author_id, user_id, id::integer, reason, created_at FROM banned_list")).rows 
    }

    async updateBan(data: Partial<DBBan>, banId: number): Promise<boolean> {
        try {
            await Db.query(`UPDATE banned_list SET ${Object.keys(data)[0]} = $1 WHERE id = $2`, [Object.values(data)[0], banId])
            return true
        } catch(e) {
            console.log(e)
            return false
        }
    }

    async deleteBan(banId: number): Promise<boolean> {
        try {
            await Db.query("DELETE FROM banned_list WHERE id = $1", [banId])
            return true
        } catch(e) {
            console.log(e)
            return false
        }
    }
}

export const BanService = new MyService<DBBan>("banned_list")