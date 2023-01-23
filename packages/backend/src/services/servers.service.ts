import {Db} from "./db.service.js"

interface DBRes {
    id: string;
    pid: number;
    password: string;
    file: string;
    ip: string;
    port: number;
}

class Service {
    async findEmptyServer() {
        return await Db.query<DBRes>("SELECT * FROM servers WHERE pid IS NULL LIMIT 1")
    }

    async runServer({id, pid, password}: {id: string, pid: number, password: string}) {
        return await Db.query("UPDATE servers SET pid = $1, password = $2 WHERE id = $3", [pid, password, id])
    }

    async shutdownServer(pid: number) {
        return await Db.query("UPDATE servers SET pid = NULL, password = NULL WHERE pid = $1", [pid])
    }

    async findServerById(serverId: number) {
        return await Db.query<DBRes>("SELECT * FROM servers WHERE id = $1 LIMIT 1", [serverId])
    }

    async getServersIp() {
        return await Db.query<{ip: string}>("SELECT ip FROM servers GROUP BY ip");
    }
}

export const ServersService = new Service()