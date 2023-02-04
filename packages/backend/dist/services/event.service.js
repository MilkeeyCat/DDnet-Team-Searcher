var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Db } from "./db.service.js";
import { GameServerService } from "./gameServer.service.js";
import { ServersService } from "./servers.service.js";
class Service {
    getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield Db.query(`SELECT events.*, users.username, users.avatar,
        (SELECT count(*) AS is_interested FROM interested_events WHERE user_id = $1 AND event_id = events.id),
        (SELECT count(*) AS interested FROM interested_events WHERE event_id = events.id)
        FROM events JOIN users ON users.id = events.author_id order by events.id DESC`, [userId]);
            for (const event of events.rows) {
                if (!!event.server_id) {
                    const query = yield ServersService.findServerById(event.server_id);
                    const server = query.rows[0];
                    event.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`;
                }
                delete event.server_id;
            }
            return events;
        });
    }
    create(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const endAt = `${data.eventEndDate} ${data.eventEndTime}`;
            const res = yield Db.query("INSERT INTO events (author_id, place, map_name, teamsize, description, start_at, end_at, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", [data.authorId, data.place, data.mapName, data.teamSize, data.description, `${data.eventStartDate} ${data.eventStartTime}`, endAt == " " ? null : endAt, (_a = data.thumbnail) !== null && _a !== void 0 ? _a : null]);
            return yield Db.query("INSERT INTO interested_events (user_id, event_id, in_team) VALUES($1, $2, $3)", [data.authorId, parseInt(res.rows[0].id), 1]);
        });
    }
    start(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            let eventReq = yield this.findEventById(eventId);
            let event = eventReq.rows[0];
            switch (event.place) {
                case "0":
                    const emptyServer = yield ServersService.findEmptyServer();
                    if (emptyServer.rows.length) {
                        const configFile = emptyServer.rows[0].file + ".cfg";
                        return new Promise((resolve, reject) => {
                            GameServerService.start(emptyServer.rows[0].ip, {
                                password: "LEL",
                                config_file: configFile,
                                map_name: event.map_name,
                                port: emptyServer.rows[0].port,
                                id: parseInt(emptyServer.rows[0].id)
                            }, (_a) => {
                                var { id, pid } = _a, data = __rest(_a, ["id", "pid"]);
                                ServersService.runServer({
                                    id: id.toString(),
                                    pid,
                                    password: data.password
                                });
                                Db.query("UPDATE events SET server_id = $1, status = '1' WHERE id = $2", [id, eventId]);
                                resolve();
                            });
                        });
                    }
                    else {
                        // no free servers do something else I DONT GIVE A FUCK
                        console.log("Ehhhh. Sry bro we ran out of servers xD");
                    }
                    break;
                case "1":
                    yield Db.query("UPDATE events SET status = '1' where id = $1", [eventId]);
                    break;
                default:
                    console.log("Weird ass place value for event 0_o");
            }
        });
    }
    end(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            let eventReq = yield this.findEventById(eventId);
            if (!eventReq.rows.length) {
                console.log("ERRRRRRRRRRRRRRRROR");
            }
            const server = yield ServersService.findServerById(eventReq.rows[0].server_id);
            switch (eventReq.rows[0].place) {
                case "0":
                    return new Promise((resolve, reject) => {
                        GameServerService.shutdown(server.rows[0].ip, { pid: server.rows[0].pid }, (res) => __awaiter(this, void 0, void 0, function* () {
                            yield Db.query("UPDATE servers SET password = NULL, pid = NULL where pid = $1", [res.pid]);
                            yield Db.query("UPDATE events SET status = '2', server_id = NULL where id = $1", [eventId]);
                            resolve();
                        }));
                    });
                case "1":
                    yield Db.query("UPDATE events SET status = '2' where id = $1", [eventId]);
                    break;
                default:
                    console.log("Weird ass place value for event 0_o");
            }
        });
    }
    findEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT * FROM events WHERE id = $1 LIMIT 1", [id]);
        });
    }
    isInterested(userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT COUNT(*) as is_interested FROM interested_events WHERE user_id = $1 AND event_id = $2", [userId, eventId]);
        });
    }
    setInterested(userId, eventId, isInterested) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.findEventById(eventId);
            let interested = 0;
            if (event.rows[0].author_id.toString() == userId)
                interested = 1;
            if (isInterested) {
                return yield Db.query("INSERT INTO interested_events (user_id, event_id, in_team) VALUES($1, $2, $3)", [userId, eventId, interested]);
            }
            return yield Db.query("DELETE FROM interested_events WHERE user_id = $1 AND event_id = $2", [userId, eventId]);
        });
    }
    getInterestedPlayers(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT interested_events.in_team, users.username, users.id, users.avatar FROM interested_events INNER JOIN users ON users.id = interested_events.user_id WHERE interested_events.event_id = $1", [eventId]);
        });
    }
    isUserInTeam(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT in_team FROM interested_events WHERE user_id = $1 AND event_id = $2", [userId, eventId]);
        });
    }
    updateIsUserInTeam(eventId, userId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("UPDATE interested_events SET in_team = $1 WHERE user_id = $2 AND event_id = $3", [value, userId, eventId]);
        });
    }
}
export const EventService = new Service();
