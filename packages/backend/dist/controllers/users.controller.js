var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UsersService } from "../services/users.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RunsService } from "../services/runs.service.js";
class Controller {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, tier } = req.body;
            const errors = [];
            Object.keys({ username, email, password, tier }).map((key) => {
                if (req.body[key] === "" || req.body[key] === undefined) {
                    errors.push({ field: key, text: "Field is required" });
                }
            });
            if (tier > 6) {
                errors.push({ field: "tier", text: "Tier value is invalid" });
            }
            if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email)) {
                errors.push({ field: "email", text: "Check if your email is right!" });
            }
            // const isUserExists = await UsersService.findUser({username, email}, true)
            const isUserExists = yield UsersService.isUserExistsByEmail(email);
            if (isUserExists) {
                errors.push("User with such a username or email already exists!");
            }
            if (errors.length !== 0) {
                res.status(400).json({ status: "REGISTRATION_FAILED", message: errors[0] });
            }
            if (!errors.length && !isUserExists) {
                const result = yield UsersService.register({ username, email, password, tier });
                if (result.rowCount === 1) {
                    res.json({ status: "REGISTRATION_SUCCESSFUL" });
                }
                else {
                    // something bad happened :\
                }
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const errors = [];
            Object.keys({ username, password }).map((key) => {
                if (req.body[key] === "" || req.body[key] === undefined) {
                    errors.push({ field: key, text: "Field is required" });
                }
            });
            if (errors.length !== 0) {
                res.status(400).json({ status: "LOGIN_FAILED", message: errors[0] });
                return;
            }
            const isUserExists = yield UsersService.isUserExistsByUsername(username);
            if (isUserExists) {
                const user = yield UsersService.getUserData(isUserExists, true);
                if (yield bcrypt.compare(password, user.password || "")) {
                    const token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_KEY, {
                        expiresIn: "2h",
                    });
                    res.cookie("token", token, { httpOnly: true });
                    res.json({ status: "LOGIN_SUCCESSFUL" });
                }
            }
            else {
                res.status(400).json({ status: "LOGIN_FAILED", message: "Username or password is wrong!" });
            }
        });
    }
    fetchUserData(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UsersService.getUserData(res.locals.user.id);
            res.json(user);
        });
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const user = yield UsersService.getUserData(userId);
            res.json(user);
        });
    }
    getUserRuns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            if (userId !== undefined) {
                // show somebody's profile
                const user = yield UsersService.isUserExistsById(userId);
                if (user) {
                    // user exists
                    const runs = yield RunsService.getUserRuns(userId);
                    res.json(runs.rows);
                }
                else {
                    // user does not exist
                    res.status(404).json({ status: "USER_NOT_FOUND" });
                }
            }
            else {
                // show own profile
                const runs = yield RunsService.getUserRuns(res.locals.user.id);
                res.json(runs.rows);
            }
        });
    }
}
export const UsersController = new Controller();
