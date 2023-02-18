import { Db } from "./db.service.js"

class Service {
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

    async banUser(userId: number, reason: string | null = null): Promise<boolean> {
        try {
            await Db.query("INSERT INTO banned_list (user_id, reason) VALUES($1, $2)", [userId, reason])
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
}

export const BanService = new Service()