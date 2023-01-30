import { EventRequest } from "@app/shared/types/EventRequest.type.js";
import { Db } from "./db.service.js"
import { GameServerService } from "./gameServer.service.js";
import { ServersService } from "./servers.service.js";

interface DbEventColumns {
    id: string;
    author_id: number;
    place: "0" | "1";
    map_name: string;
    teamsize: string;
    description: string;
    start_at: string;
    end_at: string | null;
    thumbnail: string | null;
    status: "0" | "1" | "2" | "3"
    server_id: number | null;
}

class Service {
    async getAll(userId: string) {
        const events = await Db.query<DbEventColumns & {connect_string?: string}>(`SELECT events.*, users.username, users.avatar,
        (SELECT count(*) AS is_interested FROM interested_events WHERE user_id = $1 AND event_id = events.id),
        (SELECT count(*) AS interested FROM interested_events WHERE event_id = events.id)
        FROM events JOIN users ON users.id = events.author_id order by events.id DESC`, [userId])

        for (const event of events.rows) {
            if (!!event.server_id) {
                const query = await ServersService.findServerById(event.server_id)
                const server = query.rows[0]

                event.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`
            }

            delete (event as Partial<DbEventColumns>).server_id
        }

        return events
    }

    async create(data: EventRequest & {authorId: number}) {
        const endAt = `${data.eventEndDate} ${data.eventEndTime}`

        const res = await Db.query<{ id: string }>("INSERT INTO events (author_id, place, map_name, teamsize, description, start_at, end_at, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", [data.authorId, data.place, data.mapName, data.teamSize, data.description, `${data.eventStartDate} ${data.eventStartTime}`, endAt == " " ? null : endAt, data.thumbnail as string ?? null])

        return await Db.query("INSERT INTO interested_events (user_id, event_id, in_team) VALUES($1, $2, $3)", [data.authorId, parseInt(res.rows[0].id), 1])
    }

    async start(eventId: string) {
        let eventReq = await this.findEventById(eventId)
        let event = eventReq.rows[0]

        switch (event.place) {
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
                            map_name: event.map_name,
                            port: emptyServer.rows[0].port,
                            id: parseInt(emptyServer.rows[0].id)
                        }, ({id, pid, ...data}) => {
                            ServersService.runServer({
                                id: id.toString(),
                                pid,
                                password: data.password 
                            })
                            Db.query("UPDATE events SET server_id = $1, status = '1' WHERE id = $2", [id, eventId])

                            resolve()
                    })
                })
                    
                } else {
                    // no free servers do something else I DONT GIVE A FUCK
                    console.log("Ehhhh. Sry bro we ran out of servers xD")
                }
                break
            case "1":
                await Db.query("UPDATE events SET status = '1' where id = $1", [eventId])
                break
            default:
                console.log("Weird ass place value for event 0_o")
        }
    }

    async end(eventId: string) {
        let eventReq = await this.findEventById(eventId)

        if (!eventReq.rows.length) {
            console.log("ERRRRRRRRRRRRRRRROR")
        }

        const server = await ServersService.findServerById(eventReq.rows[0].server_id!)
        switch (eventReq.rows[0].place) {
            case "0":
                return new Promise<void>((resolve, reject) => {
                    GameServerService.shutdown(server.rows[0].ip, {pid: server.rows[0].pid}, async (res) => {
                        await Db.query("UPDATE servers SET password = NULL, pid = NULL where pid = $1", [res.pid])
                        await Db.query("UPDATE events SET status = '2', server_id = NULL where id = $1", [eventId])
                        
                        resolve()
                    })
                })    
            case "1":
                await Db.query("UPDATE events SET status = '2' where id = $1", [eventId])

                break
            default:
                console.log("Weird ass place value for event 0_o")
        }
    }

    async findEventById(id: string) {
        return await Db.query<DbEventColumns>("SELECT * FROM events WHERE id = $1 LIMIT 1", [id])
    }


    async isInterested(userId: string, eventId: string) {
        return await Db.query<{ is_interested: "0" | "1" }>("SELECT COUNT(*) as is_interested FROM interested_events WHERE user_id = $1 AND event_id = $2", [userId, eventId])
    }

    async setInterested(userId: string, eventId: string, isInterested: boolean) {
        const event = await this.findEventById(eventId)

        let interested = 0

        if (event.rows[0].author_id.toString() == userId) interested = 1

        if (isInterested) {
            return await Db.query("INSERT INTO interested_events (user_id, event_id, in_team) VALUES($1, $2, $3)", [userId, eventId, interested])
        }

        return await Db.query("DELETE FROM interested_events WHERE user_id = $1 AND event_id = $2", [userId, eventId])
    }

    async getInterestedPlayers(eventId: string) {
        return await Db.query("SELECT interested_events.in_team, users.username, users.id, users.avatar FROM interested_events INNER JOIN users ON users.id = interested_events.user_id WHERE interested_events.event_id = $1", [eventId])
    }

    async isUserInTeam(eventId: string, userId: string) {
        return await Db.query("SELECT in_team FROM interested_events WHERE user_id = $1 AND event_id = $2", [userId, eventId])
    }

    async updateIsUserInTeam(eventId: string, userId: string, value: 1 | 0) {
        return await Db.query("UPDATE interested_events SET in_team = $1 WHERE user_id = $2 AND event_id = $3", [value, userId, eventId])
    }
}

export const EventService = new Service()