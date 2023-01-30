import {Db} from "./db.service.js"
import {ServersService} from "./servers.service.js"
import { GameServerService } from "./gameServer.service.js";
import { RunRequest } from "@app/shared/types/RunRequest.type.js";

interface DBRun {
    place: "0" | "1";
    map_name: string;
    author_id: number;
    team_size: string;
    run_start_date: string;
    run_start_time: string;
    description: string;

    id: string;
    is_interested: string;
    interested: string;
    server_id: number;
    connect_string?: string;
}

class Service {
    async getRuns(userId: string) {
        const runs = await Db.query<DBRun>(`
            SELECT runs.id, runs.map_name, runs.author_id, runs.place, runs.teamsize,
            runs.description, runs.status, runs.start_at, users.username, users.avatar, runs.server_id,
            (SELECT count(*) AS is_interested FROM interested_runs WHERE user_id = $1 AND run_id = runs.id),
            (SELECT count(*) AS interested FROM interested_runs WHERE run_id = runs.id)
            FROM runs JOIN users ON users.id = runs.author_id order by runs.id desc`, [userId])

        for (const run of runs.rows) {
            if (!!run.server_id) {
                const serverQuery = await ServersService.findServerById(run.server_id)
                const server = serverQuery.rows[0]

                run.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`
            }

        }

        return runs
    }

    async updateRunServer(runId: string, serverId: string) {
        return await Db.query("UPDATE runs SET server_id = $2 WHERE id = $1", [runId, serverId])
    }

    async create(data: RunRequest & { authorId: number}) {
        const res = await Db.query<{ id: string }>("INSERT INTO runs (author_id, place, map_name, teamsize, description, start_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [data.authorId, data.place, data.mapName, data.teamSize, data.description, `${data.runStartDate} ${data.runStartTime}`])

        return await Db.query("INSERT INTO interested_runs (user_id, run_id, in_team) VALUES($1, $2, $3)", [data.authorId, parseInt(res.rows[0].id), 1])
    }

    async update() {
        const runsShouldBeStarted = await Db.query<DBRun>("SELECT * FROM runs WHERE status = '0' AND start_at < CURRENT_TIMESTAMP")

        for (let run of runsShouldBeStarted.rows) {
            await this.start(run.id)
        }
    }


    async findRunById(id: string) {
        return await Db.query<DBRun>("SELECT * FROM runs WHERE id = $1 LIMIT 1", [id])
    }

    async start(runId: string) {
        let runReq = await this.findRunById(runId)
        let run = runReq.rows[0]

        switch (run.place) {
            case "0":
                const emptyServer = await ServersService.findEmptyServer()

                if (emptyServer.rows.length) {
                    const configFile = emptyServer.rows[0].file + ".cfg"
                    
                    return new Promise<void>((resolve, reject) => {
                        GameServerService.start(
                        emptyServer.rows[0].ip,
                        {
                            password: "LEL",
                            config_file: configFile,
                            map_name: run.map_name,
                            port: emptyServer.rows[0].port,
                            id: parseInt(emptyServer.rows[0].id)
                        }, ({id, pid, ...data}) => {
                            ServersService.runServer({
                                id: id.toString(),
                                pid,
                                password: data.password 
                            })
                            Db.query("UPDATE runs SET server_id = $1, status = '1' WHERE id = $2", [id, runId])

                            resolve()
                    })
                })
                    
                } else {
                    // no free servers do something else I DONT GIVE A FUCK
                    console.log("Ehhhh. Sry bro we ran out of servers xD")
                }
                break
            case "1":
                await Db.query("UPDATE runs SET status = '1' where id = $1", [runId])
                break
            default:
                console.log("Weird ass place value for run 0_o")
        }
    }

    async end(runId: string) {
        let runReq = await this.findRunById(runId)

        if (!runReq.rows.length) {
            console.log("ERRRRRRRRRRRRRRRROR")
        }

        const server = await ServersService.findServerById(runReq.rows[0].server_id)
        switch (runReq.rows[0].place) {
            case "0":
                return new Promise<void>((resolve, reject) => {
                    GameServerService.shutdown(server.rows[0].ip, {pid: server.rows[0].pid}, async (res) => {
                        await Db.query("UPDATE servers SET password = NULL, pid = NULL where pid = $1", [res.pid])
                        await Db.query("UPDATE runs SET status = '2', server_id = NULL where id = $1", [runId])
                        
                        resolve()
                    })
                })    
            case "1":
                await Db.query("UPDATE runs SET status = '2' where id = $1", [runId])

                break
            default:
                console.log("Weird ass place value for run 0_o")
        }
    }

    async deleteRun(id: string) {
        return await Db.query("delete from runs where id = $1;", [id])
    }

    async isInterested(userId: string, runId: string) {
        return await Db.query<{ is_interested: "0" | "1" }>("SELECT COUNT(*) as is_interested FROM interested_runs WHERE user_id = $1 AND run_id = $2", [userId, runId])
    }

    async setInterested(userId: string, runId: string, isInterested: boolean) {
        const run = await this.findRunById(runId)

        let interested = 0

        if (run.rows[0].author_id.toString() == userId) interested = 1

        if (isInterested) {
            return await Db.query("INSERT INTO interested_runs (user_id, run_id, in_team) VALUES($1, $2, $3)", [userId, runId, interested])
        }

        return await Db.query("DELETE FROM interested_runs WHERE user_id = $1 AND run_id = $2", [userId, runId])
    }

    async getInterestedPlayers(runId: string) {
        return await Db.query("SELECT interested_runs.in_team, users.username, users.id, users.avatar FROM interested_runs INNER JOIN users ON users.id = interested_runs.user_id WHERE interested_runs.run_id = $1", [runId])
    }

    async isUserInTeam(runId: string, userId: string) {
        return await Db.query("SELECT in_team FROM interested_runs WHERE user_id = $1 AND run_id = $2", [userId, runId])
    }

    async updateIsUserInTeam(runId: string, userId: string, value: 1 | 0) {
        return await Db.query("UPDATE interested_runs SET in_team = $1 WHERE user_id = $2 AND run_id = $3", [value, userId, runId])
    }
}

export const RunsService = new Service()