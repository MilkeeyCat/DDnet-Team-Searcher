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
import { EventService } from "../services/event.service.js";
class Controller {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield EventService.getAll(res.locals.user.id);
            return res.json(result.rows);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { place, mapName, teamSize, eventStartDate, eventStartTime, eventEndDate, eventEndTime, description } = req.body;
            const request = yield fetch("https://ddnet.org/releases/maps.json");
            const availableMaps = yield request.json();
            const mapNames = availableMaps === null || availableMaps === void 0 ? void 0 : availableMaps.map((map) => map.name);
            const errors = [];
            Object.keys({ place, mapName, teamSize, eventStartDate, eventStartTime }).map((key) => {
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
            if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(eventStartDate)) {
                errors.push("Invalid event start date field value");
            }
            if (!/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(eventStartTime)) {
                errors.push("Invalid event start time field value");
            }
            if ((new Date(`${eventStartDate} ${eventStartTime}`).getTime() - new Date().getTime()) < 0) {
                errors.push("Do u live in past or what? xD choose time that is in future!");
            }
            if (isNaN(parseInt(teamSize))) {
                errors.push("Invalid team size field value");
            }
            if (errors.length !== 0) {
                res.status(400).json({ status: "EVENT_CREATION_FAILED", message: errors[0] });
            }
            else {
                const result = yield EventService.create({
                    place,
                    teamSize,
                    description,
                    mapName,
                    eventStartDate,
                    eventStartTime,
                    eventEndDate,
                    eventEndTime,
                    thumbnail: req.file ? req.file.filename : undefined,
                    authorId: parseInt(res.locals.user.id)
                });
                res.json({ status: "EVENT_CREATED_SUCCESSFULLY", message: "Event created successfully :)", event: {} });
            }
        });
    }
    start(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield EventService.findEventById(req.params.eventId);
            if (event.rows[0].author_id == parseInt(res.locals.user.id)) {
                yield EventService.start(req.params.eventId);
                res.json({ status: "EVENT_STARTED_SUCCESSFULLY" });
            }
        });
    }
    end(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield EventService.findEventById(req.params.eventId);
            if (event.rows[0].author_id == parseInt(res.locals.user.id)) {
                yield EventService.end(req.params.eventId);
                res.json({ status: "EVENT_ENDED_SUCCESSFULLY" });
            }
        });
    }
    interested(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isInterestedQuery = yield EventService.isInterested(res.locals.user.id, req.params.eventId);
            const isInterested = !(!!parseInt(isInterestedQuery.rows[0].is_interested));
            const result = yield EventService.setInterested(res.locals.user.id, req.params.eventId, isInterested);
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
            const players = yield EventService.getInterestedPlayers(req.params.eventId);
            res.json({ players: players.rows });
        });
    }
    addOrRemoveFromTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPlayerInTeam = yield EventService.isUserInTeam(req.params.eventId, req.params.userId);
            yield EventService.updateIsUserInTeam(req.params.eventId, req.params.userId, parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1);
            res.json({ inTeam: parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1 });
        });
    }
}
export const EventsController = new Controller();
