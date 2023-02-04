var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import net from "net";
import { Db } from "./db.service.js";
export class Service {
    constructor() {
        this.sockets = new Map();
        this.ips = [];
    }
    setIps(val) {
        this.ips = val;
    }
    connect() {
        this.ips.forEach(ip => {
            let socket = new net.Socket();
            this.sockets.set(ip, socket);
            socket.connect(9090, ip, () => {
                console.log(`TCP connection established with ${ip}:9090`);
            });
            socket.on("error", (err) => {
                console.log("Error occured: ", err.message);
            });
            socket === null || socket === void 0 ? void 0 : socket.on("data", (bytes) => __awaiter(this, void 0, void 0, function* () {
                let res = JSON.parse(Buffer.from(bytes).toString());
                if (res.status === "SERVER_SHUTDOWN_SUCCESSFULLY") {
                    let server = yield Db.query("SELECT id FROM servers where pid = $1", [res.pid]);
                    yield Db.query("UPDATE servers SET password = NULL, pid = NULL where pid = $1", [res.pid]);
                    yield Db.query("UPDATE runs SET status = '2', server_id = NULL where server_id = $1", [server.rows[0].id]);
                }
                else if (res.status === "SERVER_SHUTDOWN_ERROR") {
                    // error xD
                }
            }));
        });
    }
    start(ip, data, callback) {
        let socket = this.sockets.get(ip);
        socket === null || socket === void 0 ? void 0 : socket.write(Buffer.from(JSON.stringify(data) + "\n"));
        socket === null || socket === void 0 ? void 0 : socket.on("data", (bytes) => {
            let res = JSON.parse(Buffer.from(bytes).toString());
            if (res.status === "SERVER_STARTED_SUCCESSFULLY") {
                callback(res);
            }
            else if (res.status === "SERVER_STARTED_ERROR") {
                // error :\
            }
        });
    }
    shutdown(ip, data, callback) {
        let socket = this.sockets.get(ip);
        socket === null || socket === void 0 ? void 0 : socket.write(Buffer.from(JSON.stringify(data) + "\n"));
        socket === null || socket === void 0 ? void 0 : socket.on("data", (bytes) => {
            let res = JSON.parse(Buffer.from(bytes).toString());
            if (res.status === "SERVER_SHUTDOWN_SUCCESSFULLY") {
                callback(res);
            }
            else if (res.status === "SERVER_SHUTDOWN_ERROR") {
                // error xD
            }
        });
    }
}
export const GameServerService = new Service();
