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
import bcrypt from "bcrypt";
export class Service {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedPassword = yield bcrypt.hash(data.password, 10);
            return yield Db.query("INSERT INTO users (username, email, password, tier) VALUES($1, $2, $3, $4)", [data.username, data.email, encryptedPassword, data.tier.toString()]);
        });
    }
    isUserExistsByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield Db.query("SELECT id FROM users WHERE username = $1 LIMIT 1", [username]);
            if (req.rows.length) {
                return req.rows[0].id;
            }
            else {
                return false;
            }
        });
    }
    isUserExistsByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield Db.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [userEmail]);
            if (req.rows.length) {
                return req.rows[0].id;
            }
            else {
                return false;
            }
        });
    }
    isUserExistsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield Db.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [userId]);
            console.log(req);
            if (req.rows.length) {
                return req.rows[0].id;
            }
            else {
                return false;
            }
        });
    }
    // async findUser(obj: {[key: string]: any}, or: boolean = false) {
    //     let keys = Object.keys(obj)
    //     const where: string = keys.reduce((prev, current) => {
    //         const b = typeof obj[current] === "number" ? obj[current] : `'${obj[current]}'`
    //         return prev + (prev !== "" ? ` ${or ? "OR" : "AND"} ${current} = ${b}` : `WHERE ${current} = ${b}`)
    //     }, "")
    //     return await Db.query<User>(`SELECT * FROM users ${where}`)
    // }
    // async getUserProfile(userId: string) {
    //     const user = await Db.query<User>("SELECT * FROM users WHERE id = $1", [userId])
    //     delete (user.rows[0] as Partial<User>).password
    //     return user
    // }
    getUserData(userId, withPassword = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Db.query(`SELECT id, username, email, avatar, registration_date, tier, verified${withPassword ? `, password` : ``} FROM users WHERE id = $1`, [userId]);
            return res.rows[0];
        });
    }
    getRoles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Db.query(`SELECT roles.name, roles.color, roles.url, roles.can_delete_happenings, roles.can_edit_posts, roles.can_ban, roles.can_create_roles FROM users_roles INNER JOIN roles ON roles.id = users_roles.role_id WHERE users_roles.user_id = $1`, [userId]);
        });
    }
}
export const UsersService = new Service();
