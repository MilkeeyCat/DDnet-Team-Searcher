var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Db } from "./db.service.js";
class Service {
    findEmptyServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT * FROM servers WHERE pid IS NULL LIMIT 1");
        });
    }
    runServer({ id, pid, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("UPDATE servers SET pid = $1, password = $2 WHERE id = $3", [pid, password, id]);
        });
    }
    shutdownServer(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("UPDATE servers SET pid = NULL, password = NULL WHERE pid = $1", [pid]);
        });
    }
    findServerById(serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT * FROM servers WHERE id = $1 LIMIT 1", [serverId]);
        });
    }
    getServersIp() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Db.query("SELECT ip FROM servers GROUP BY ip");
        });
    }
}
export const ServersService = new Service();
