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
import { ServersService } from "./servers.service.js";
import { GameServerService } from "./gameServer.service.js";
class Service {
    getRuns(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const runs = yield Db.query(`
            SELECT runs.id, runs.map_name, runs.author_id, runs.place, runs.teamsize,
            runs.description, runs.status, runs.start_at, users.username, users.avatar, runs.server_id,
            (SELECT count(*) AS is_interested FROM interested_runs WHERE user_id = $1 AND run_id = runs.id),
            (SELECT count(*) AS interested FROM interested_runs WHERE run_id = runs.id)
            FROM runs JOIN users ON users.id = runs.author_id ORDER BY runs.id DESC`, [userId]);
            for (const run of runs.rows) {
                if (!!run.server_id) {
                    const serverQuery = yield ServersService.findServerById(run.server_id);
                    const server = serverQuery.rows[0];
                    run.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`;
                }
            }
            return runs;
        });
    }
    getUserRuns(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const runs = yield Db.query(`
            SELECT runs.id, runs.map_name, runs.author_id, runs.place, runs.teamsize,
            runs.description, runs.status, runs.start_at, users.username, users.avatar, runs.server_id,
            (SELECT count(*) AS is_interested FROM interested_runs WHERE user_id = $1 AND run_id = runs.id),
            (SELECT count(*) AS interested FROM interested_runs WHERE run_id = runs.id)
            FROM runs JOIN users ON users.id = runs.author_id WHERE runs.author_id = $2 ORDER BY runs.id DESC`, [userId, userId]);
            for (const run of runs.rows) {
                if (!!run.server_id) {
                    const serverQuery = yield ServersService.findServerById(run.server_id);
                    const server = serverQuery.rows[0];
                    run.connect_string = `password "${server.password}"; connect ${server.ip}:${server.port}`;
                }
            }
            return runs;
        });
    }
    updateRunServer(runId, serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("UPDATE runs SET server_id = $2 WHERE id = $1", [runId, serverId]);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Db.query("INSERT INTO runs (author_id, place, map_name, teamsize, description, start_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [data.authorId, data.place, data.mapName, data.teamSize, data.description, `${data.runStartDate} ${data.runStartTime}`]);
            return yield Db.query("INSERT INTO interested_runs (user_id, run_id, in_team) VALUES($1, $2, $3)", [data.authorId, parseInt(res.rows[0].id), 1]);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const runsShouldBeStarted = yield Db.query("SELECT * FROM runs WHERE status = '0' AND start_at < CURRENT_TIMESTAMP");
            for (let run of runsShouldBeStarted.rows) {
                yield this.start(run.id);
            }
        });
    }
    findRunById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT * FROM runs WHERE id = $1 LIMIT 1", [id]);
        });
    }
    start(runId) {
        return __awaiter(this, void 0, void 0, function* () {
            let runReq = yield this.findRunById(runId);
            let run = runReq.rows[0];
            switch (run.place) {
                case "0":
                    const emptyServer = yield ServersService.findEmptyServer();
                    if (emptyServer.rows.length) {
                        const configFile = emptyServer.rows[0].file + ".cfg";
                        return new Promise((resolve, reject) => {
                            GameServerService.start(emptyServer.rows[0].ip, {
                                password: "LEL",
                                config_file: configFile,
                                map_name: run.map_name,
                                port: emptyServer.rows[0].port,
                                id: parseInt(emptyServer.rows[0].id)
                            }, (_a) => {
                                var { id, pid } = _a, data = __rest(_a, ["id", "pid"]);
                                ServersService.runServer({
                                    id: id.toString(),
                                    pid,
                                    password: data.password
                                });
                                Db.query("UPDATE runs SET server_id = $1, status = '1' WHERE id = $2", [id, runId]);
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
                    yield Db.query("UPDATE runs SET status = '1' where id = $1", [runId]);
                    break;
                default:
                    console.log("Weird ass place value for run 0_o");
            }
        });
    }
    end(runId) {
        return __awaiter(this, void 0, void 0, function* () {
            let runReq = yield this.findRunById(runId);
            if (!runReq.rows.length) {
                console.log("ERRRRRRRRRRRRRRRROR");
            }
            const server = yield ServersService.findServerById(runReq.rows[0].server_id);
            switch (runReq.rows[0].place) {
                case "0":
                    return new Promise((resolve, reject) => {
                        GameServerService.shutdown(server.rows[0].ip, { pid: server.rows[0].pid }, (res) => __awaiter(this, void 0, void 0, function* () {
                            yield Db.query("UPDATE servers SET password = NULL, pid = NULL where pid = $1", [res.pid]);
                            yield Db.query("UPDATE runs SET status = '2', server_id = NULL where id = $1", [runId]);
                            resolve();
                        }));
                    });
                case "1":
                    yield Db.query("UPDATE runs SET status = '2' where id = $1", [runId]);
                    break;
                default:
                    console.log("Weird ass place value for run 0_o");
            }
        });
    }
    deleteRun(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("delete from runs where id = $1;", [id]);
        });
    }
    isInterested(userId, runId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT COUNT(*) as is_interested FROM interested_runs WHERE user_id = $1 AND run_id = $2", [userId, runId]);
        });
    }
    setInterested(userId, runId, isInterested) {
        return __awaiter(this, void 0, void 0, function* () {
            const run = yield this.findRunById(runId);
            let interested = 0;
            if (run.rows[0].author_id.toString() == userId)
                interested = 1;
            if (isInterested) {
                return yield Db.query("INSERT INTO interested_runs (user_id, run_id, in_team) VALUES($1, $2, $3)", [userId, runId, interested]);
            }
            return yield Db.query("DELETE FROM interested_runs WHERE user_id = $1 AND run_id = $2", [userId, runId]);
        });
    }
    getInterestedPlayers(runId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT interested_runs.in_team, users.username, users.id, users.avatar FROM interested_runs INNER JOIN users ON users.id = interested_runs.user_id WHERE interested_runs.run_id = $1", [runId]);
        });
    }
    isUserInTeam(runId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT in_team FROM interested_runs WHERE user_id = $1 AND run_id = $2", [userId, runId]);
        });
    }
    updateIsUserInTeam(runId, userId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("UPDATE interested_runs SET in_team = $1 WHERE user_id = $2 AND run_id = $3", [value, userId, runId]);
        });
    }
}
export const RunsService = new Service();
