var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import { RunsService } from "../services/runs.service.js";
class Controller {
    getRuns(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield RunsService.getRuns(res.locals.user.id);
            return res.json(result.rows);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { place, mapName, teamSize, runStartDate, runStartTime, description } = req.body;
            const request = yield fetch("https://ddnet.org/releases/maps.json");
            let availableMaps = yield request.json();
            const mapNames = availableMaps === null || availableMaps === void 0 ? void 0 : availableMaps.map((map) => map.name);
            const errors = [];
            Object.keys({ place, mapName, teamSize, runStartDate, runStartTime }).map((key) => {
                if (req.body[key] === "" || req.body[key] === undefined) {
                    errors.push({ field: key, text: "Field is required" });
                }
            });
            if (place !== "0" && place !== "1") {
                errors.push("Invalid place field value");
            }
            if (!mapNames.includes(mapName)) {
                errors.push("Invalid map name");
            }
            if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(runStartDate)) {
                errors.push("Invalid run start date field value");
            }
            if (!/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(runStartTime)) {
                errors.push("Invalid run start time field value");
            }
            if ((new Date(`${runStartDate} ${runStartTime}`).getTime() - new Date().getTime()) < 0) {
                errors.push("Do u live in past or what? xD choose time that is in future!");
            }
            if (isNaN(parseInt(teamSize))) {
                errors.push("Invalid team size field value");
            }
            if (errors.length !== 0) {
                res.status(400).json({ status: "RUN_CREATION_FAILED", message: errors[0] });
            }
            else {
                const result = yield RunsService.create({
                    place,
                    teamSize,
                    description,
                    mapName,
                    runStartDate,
                    runStartTime,
                    authorId: parseInt(res.locals.user.id)
                });
                res.json({ status: "RUN_CREATED_SUCCESSFULLY", message: "Run created successfully :)", run: {} });
            }
        });
    }
    start(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const run = yield RunsService.findRunById(req.params.runId);
            if (run.rows[0].author_id == parseInt(res.locals.user.id)) {
                yield RunsService.start(req.params.runId);
                res.json({ status: "RUN_STARTED_SUCCESSFULLY" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const run = yield RunsService.findRunById(req.params.runId); // TODO: you cant delete run ⊙﹏⊙ YET
        });
    }
    end(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const run = yield RunsService.findRunById(req.params.runId);
            if (run.rows[0].author_id == parseInt(res.locals.user.id)) {
                yield RunsService.end(req.params.runId);
                res.json({ status: "RUN_ENDED_SUCCESSFULLY" });
            }
        });
    }
    interested(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isInterestedQuery = yield RunsService.isInterested(res.locals.user.id, req.params.runId);
            const isInterested = !(!!parseInt(isInterestedQuery.rows[0].is_interested));
            const result = yield RunsService.setInterested(res.locals.user.id, req.params.runId, isInterested);
            if (result.rowCount == 1) {
                res.json({
                    status: "SET_INTERESTED_SUCCESSFULLY",
                    isInterested: isInterested ? 1 : 0
                });
            }
            else {
                res.json({ status: "SET_INTERESTED_FAILED" });
            }
        });
    }
    getInterestedPlayers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const players = yield RunsService.getInterestedPlayers(req.params.runId);
            res.json({ players: players.rows });
        });
    }
    addOrRemoveFromTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPlayerInTeam = yield RunsService.isUserInTeam(req.params.runId, req.params.userId);
            console.log(isPlayerInTeam);
            yield RunsService.updateIsUserInTeam(req.params.runId, req.params.userId, parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1);
            res.json({ inTeam: parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1 });
        });
    }
}
export const RunsController = new Controller();
