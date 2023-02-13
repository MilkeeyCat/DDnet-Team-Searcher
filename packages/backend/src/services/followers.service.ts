import { Db } from "./db.service.js";

class Service {
    async isUserFolling({follower, following}: {follower: number, following: number}) {
        const res = await Db.query<{id?: number}>("SELECT id::integer FROM followers WHERE follower = $1 AND following = $2", [follower, following])

        if(res.rowCount) {
            return true
        } else {
            return false
        }
    }

    async follow({follower, following}: {follower: number, following: number}): Promise<boolean> {
        try {
            const alreadyFollowing = await this.isUserFolling({follower, following})
        
            if(alreadyFollowing) {
                await Db.query("DELETE FROM followers WHERE follower = $1 AND following = $2", [follower, following])
            } else {
                await Db.query("INSERT INTO followers(follower, following) VALUES($1, $2)", [follower, following])
            }
            return true
        } catch(e) {
            console.log(e);
            return false
        }
    }

    async getFollowStats(userId: number): Promise<{followers: number, following: number}> {
        const followers = await Db.query<{followers: number}>("SELECT COUNT(id)::integer as followers FROM followers WHERE following = $1", [userId])
        const following = await Db.query<{following: number}>("SELECT COUNT(id)::integer as following FROM followers WHERE follower = $1", [userId])
    
        return {
            followers: followers.rows[0].followers,
            following: following.rows[0].following
        }
    }
}

export const FollowersService = new Service()