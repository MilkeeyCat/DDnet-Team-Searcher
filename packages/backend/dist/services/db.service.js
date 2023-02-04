var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pkg from "pg";
const { Pool } = pkg;
export class Db {
    static query(sql, params) {
        // const pool = new Pool({
        // connectionString: process.env.DATABASE_URL
        // })
        const pool = new Pool();
        return (() => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                return yield client.query(sql, params);
            }
            finally {
                client.release();
            }
        }))().catch(err => {
            console.log("Lol something broke in db.service.ts");
            throw Error(err.stack);
        });
    }
}
