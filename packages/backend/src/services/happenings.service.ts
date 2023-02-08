import { EventRequest } from "@app/shared/types/EventRequest.type.js"
import { RunRequest } from "@app/shared/types/RunRequest.type.js"
import { QueryResult } from "pg";
import { Db } from "./db.service.js"
import { GameServerService } from "./gameServer.service.js"
import { ServersService } from "./servers.service.js"
import { Run, Event } from "@app/shared/types/Happenings.type.js"
import { InterestedPlayer } from "@app/shared/types/InterestedPlayer.type.js";

export interface DBHappening { // Types with DB prefix means fields which are stored in database
    id: number;
    author_id: number;
    place: 0 | 1;
    map_name: string;
    team_size: number;
    description: string;
    start_at: string;
    end_at: string;
    status: 0 | 1 | 2 | 3;
    server_id: number;
    thumbnail: null | string;
}

export interface DBInterestedHappening {
    user_id: number;
    happening_id: number;
    in_team: 0 | 1;
}

class Service {
    async createRun(data: RunRequest & { authorId: number}): Promise<boolean> {
        try {
            const res = await Db.query<{ id: string }>("INSERT INTO happenings (author_id, place, map_name, teamsize, description, start_at, type) VALUES ($1, $2, $3, $4, $5, $6, 'run') RETURNING id", [data.authorId, data.place, data.mapName, data.teamSize, data.description, `${data.runStartDate} ${data.runStartTime}`])
            await Db.query("INSERT INTO interested_happenings (user_id, happening_id, in_team) VALUES($1, $2, $3)", [data.authorId, parseInt(res.rows[0].id), 1])
            
            return true 
        } catch(e) {
            console.log(e);
            return false
        }
    }

    async getAllRuns(userId: string): Promise<QueryResult<Run>> {
        const runs = await Db.query<Run>(
            `SELECT happenings.id::integer, happenings.map_name, happenings.author_id, happenings.place, happenings.teamsize,
            happenings.description, happenings.status, happenings.start_at, users.username, users.avatar,
            (SELECT count(*)::integer AS is_interested FROM interested_happenings WHERE user_id = $1 AND happening_id = happenings.id),
            (SELECT count(*)::integer AS interested FROM interested_happenings WHERE happening_id = happenings.id)
            FROM happenings JOIN users ON users.id = happenings.author_id WHERE type = 'run' ORDER BY happenings.id DESC`, [userId])

        for (const row of runs.rows) {
            if (!!row.server_id) {
                const query = await ServersService.findServerById(row.server_id)
                const server = query.rows[0]

                row.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`
            }

            delete (row as Partial<Run>).server_id
        }

        return runs
    }

    async getUserRuns(userId: string): Promise<QueryResult<Run>> {
        const runs = await Db.query<Run>(
            `SELECT happenings.id::integer, happenings.map_name, happenings.author_id, happenings.place, happenings.teamsize,
            happenings.description, happenings.status, happenings.start_at, happenings.end_at, happenings.thumbnail, users.username, users.avatar,
            (SELECT count(*)::integer AS is_interested FROM interested_happenings WHERE user_id = $1 AND happening_id = happenings.id),
            (SELECT count(*)::integer AS interested FROM interested_happenings WHERE happening_id = happenings.id)
            FROM happenings JOIN users ON users.id = happenings.author_id WHERE type = 'run' AND happenings.author_id = $2 ORDER BY happenings.id DESC`, [userId, userId])

        for (const run of runs.rows) {
            if (!!run.server_id) {
                const serverQuery = await ServersService.findServerById(run.server_id)
                const server = serverQuery.rows[0]

                run.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`
            }

        }

        return runs
    }


    async createEvent(data: EventRequest & {authorId: number}) {
        try {
            let res

            if(data.eventEndDate === undefined || data.eventEndDate === "" || data.eventEndTime === "" || data.eventEndTime === undefined) {
                res = await Db.query<{ id: string }>("INSERT INTO happenings (author_id, place, map_name, teamsize, description, start_at, thumbnail, type) VALUES ($1, $2, $3, $4, $5, $6, $7, 'event') RETURNING id", [data.authorId, data.place, data.mapName, data.teamSize, data.description, `${data.eventStartDate} ${data.eventStartTime}`, data.thumbnail as string ?? null])
            } else {
                res = await Db.query<{ id: string }>("INSERT INTO happenings (author_id, place, map_name, teamsize, description, start_at, end_at, thumbnail, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'event') RETURNING id", [data.authorId, data.place, data.mapName, data.teamSize, data.description, `${data.eventStartDate} ${data.eventStartTime}`, `${data.eventEndDate} ${data.eventEndTime}`, data.thumbnail as string ?? null])
            }
            await Db.query("INSERT INTO interested_happenings (user_id, happening_id, in_team) VALUES($1, $2, $3)", [data.authorId, parseInt(res.rows[0].id), 1])
        
            return true
        } catch(e) {
            console.log("CREATING AN EVENT", e);
            return false
        }
    }

    async getAllEvents(userId: string): Promise<QueryResult<Event>> {
        const events = await Db.query<Event>(
            `SELECT happenings.id::integer, happenings.map_name, happenings.author_id, happenings.place, happenings.teamsize,
            happenings.description, happenings.status, happenings.start_at, happenings.end_at, happenings.thumbnail, users.username, users.avatar,
            (SELECT count(*)::integer AS is_interested FROM interested_happenings WHERE user_id = $1 AND happening_id = happenings.id),
            (SELECT count(*)::integer AS interested FROM interested_happenings WHERE happening_id = happenings.id)
            FROM happenings JOIN users ON users.id = happenings.author_id WHERE type = 'event' ORDER BY happenings.id DESC`, [userId])

        for (const row of events.rows) {
            if (!!row.server_id) {
                const query = await ServersService.findServerById(row.server_id)
                const server = query.rows[0]

                row.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`
            }

            delete (row as Partial<Event>).server_id
        }

        return events
    }

    async findHappeningById(id: string): Promise<QueryResult<DBHappening>> {
        return await Db.query<DBHappening>("SELECT * FROM happenings WHERE id = $1 LIMIT 1", [id])
    }

    async startHappening(happeningId: string): Promise<boolean> {
        const happening = await (await this.findHappeningById(happeningId)).rows[0]

        switch (happening.place) {
            case 0:
                const emptyServer = await ServersService.findEmptyServer()

                if (emptyServer.rowCount) {
                    const configFile = emptyServer.rows[0].file + ".cfg"
                    
                    return new Promise<boolean>((resolve, reject) => {
                        GameServerService.start(
                        emptyServer.rows[0].ip,
                        {
                            password: "LEL",
                            config_file: configFile,
                            map_name: happening.map_name,
                            port: emptyServer.rows[0].port,
                            id: parseInt(emptyServer.rows[0].id)
                        }, ({id, pid, ...data}) => {
                            ServersService.runServer({
                                id: id.toString(),
                                pid,
                                password: data.password 
                            })
                            Db.query("UPDATE happenings SET server_id = $1, status = 1 WHERE id = $2", [id, happeningId])
                            resolve(true)
                        })
                    })
                } else {
                    // no free servers do something else I DONT GIVE A FUCK
                    console.log("Ehhhh. Sry bro we ran out of servers xD")
                    return new Promise<boolean>((resolve) => resolve(false)) // <--- maybe i have to show people that i dont have servers where to run maps but ill do it later
                }
            case 1:
                await Db.query("UPDATE happenings SET status = 1 where id = $1", [happeningId])
                return new Promise<boolean>((resolve) => resolve(true))
            default:
                console.log("Weird ass place value for run 0_o")
                return new Promise<boolean>((resolve) => resolve(false))
        }
    }

    async endHappening(happeningId: string): Promise<boolean> {
        let happening = await (await this.findHappeningById(happeningId)).rows[0]

        
        switch (happening.place) {
            case 0:
                const server = await ServersService.findServerById(happening.server_id)
                
                return new Promise<boolean>((resolve, reject) => {
                    GameServerService.shutdown(server.rows[0].ip, {pid: server.rows[0].pid}, async (res) => {
                        await Db.query("UPDATE servers SET password = NULL, pid = NULL where pid = $1", [res.pid])
                        await Db.query("UPDATE happenings SET status = 2, server_id = NULL where id = $1", [happeningId])
                        
                        resolve(true)
                    })
                })    
            case 1:
                await Db.query("UPDATE happenings SET status = 2 where id = $1", [happeningId])
                return new Promise<boolean>((resolve) => resolve(true))
            default:
                console.log("Weird ass place value for run 0_o")
                return new Promise<boolean>((resolve) => resolve(false))
        }
    }

    async isInterested(userId: string, happeningId: string): Promise<{is_interested: 0 | 1}> {
        return await (await Db.query<{ is_interested: 0 | 1 }>("SELECT COUNT(*)::integer as is_interested FROM interested_happenings WHERE user_id = $1 AND happening_id = $2", [userId, happeningId])).rows[0]
    }

    async setInterested(userId: string, happeningId: string, isInterested: boolean) {
        const happening = await this.findHappeningById(happeningId)

        let interested = 0

        if (happening.rows[0].author_id.toString() == userId) interested = 1

        if (isInterested) {
            return await Db.query("INSERT INTO interested_happenings (user_id, happening_id, in_team) VALUES($1, $2, $3)", [userId, happeningId, interested])
        }

        return await Db.query("DELETE FROM interested_happenings WHERE user_id = $1 AND happening_id = $2", [userId, happeningId])
    }

    async getInterestedPlayers(happeningId: string): Promise<QueryResult<InterestedPlayer>> {
        return await Db.query<InterestedPlayer>("SELECT interested_happenings.in_team, users.username, users.id, users.avatar FROM interested_happenings INNER JOIN users ON users.id = interested_happenings.user_id WHERE interested_happenings.happening_id = $1", [happeningId])
    }

    async isUserInTeam(happeningId: string, userId: string): Promise<QueryResult<{in_team: 0 | 1}>> {
        return await Db.query<{in_team: 1 | 0}>("SELECT in_team FROM interested_happenings WHERE user_id = $1 AND happening_id = $2", [userId, happeningId])
    }

    async updateIsUserInTeam(happeningId: string, userId: string, value: 1 | 0) {
        return await Db.query("UPDATE interested_happenings SET in_team = $1 WHERE user_id = $2 AND happening_id = $3", [value, userId, happeningId])
    }
}

export const HappeningsService = new Service()