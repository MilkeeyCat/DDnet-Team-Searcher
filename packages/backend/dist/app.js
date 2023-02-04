var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { UsersRouter } from "./routes/users.route.js";
import { RunsRouter } from "./routes/runs.route.js";
import cron from "node-cron";
import { RunsService } from "./services/runs.service.js";
import { EventsRouter } from "./routes/events.route.js";
import { GameServerService } from "./services/gameServer.service.js";
import { ServersService } from "./services/servers.service.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
app.use("/public", express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return next();
});
app.use("/api", UsersRouter);
app.use("/api", RunsRouter);
app.use("/api", EventsRouter);
app.get("/*", (_, res) => {
    res.sendFile("public/index.html", { root: "./" });
});
cron.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield RunsService.update();
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield ServersService.getServersIp();
    const ips = res.rows.map(obj => obj.ip);
    GameServerService.ips = ips;
    GameServerService.connect();
    console.log(`server started at http://localhost:${port}`);
}));
