import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type";
import { Request, Response } from "express";
import fetch from "node-fetch";
import { EventService } from "../services/event.service.js";
import { Map } from "@app/shared/types/Map.type"
import { EventRequest } from "@app/shared/types/EventRequest.type"

class Controller {
    async getAll(req: Request, res: AuthMiddlewareResponse) {
        const result = await EventService.getAll(res.locals.user.id)

        return res.json(result.rows)
    }

    async create(req: Request<{}, {}, EventRequest>, res: AuthMiddlewareResponse) {
        const {place, mapName, teamSize, eventStartDate, eventStartTime, eventEndDate, eventEndTime, description} = req.body

        const request = await fetch("https://ddnet.org/releases/maps.json")
        
        const availableMaps  = await request.json() as Array<Map>

        const mapNames = availableMaps?.map((map) => map.name)

        const errors: (string | { field: keyof EventRequest, text: string })[] = []

        Object.keys({place, mapName, teamSize, eventStartDate, eventStartTime}).map((key) => {
            if (req.body[key as keyof EventRequest] === "" || req.body[key as keyof EventRequest] === undefined) {
                errors.push({field: key as keyof EventRequest, text: "Field is required"})
            }
        })

        if (place !== "0" && place !== "1") {
            errors.push("Invalid place field value")
        }

        if (!mapNames.includes(mapName)) {
            errors.push("Invalid map name")
        }

        if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(eventStartDate)) {
            errors.push("Invalid event start date field value")
        }

        if (!/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(eventStartTime)) {
            errors.push("Invalid event start time field value")
        }

        if ((new Date(`${eventStartDate} ${eventStartTime}`).getTime() - new Date().getTime()) < 0) {
            errors.push("Do u live in past or what? xD choose time that is in future!")
        }

        if (isNaN(parseInt(teamSize))) {
            errors.push("Invalid team size field value")
        }

        if (errors.length !== 0) {
            res.status(400).json({status: "EVENT_CREATION_FAILED", message: errors[0]})
        } else {
            const result = await EventService.create({
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
            })

            res.json({status: "EVENT_CREATED_SUCCESSFULLY", message: "Event created successfully :)", event: {}})
        }
    }

    async start(req: Request<{ eventId: string }>, res: AuthMiddlewareResponse) {
        const event = await EventService.findEventById(req.params.eventId)

        if (event.rows[0].author_id == parseInt(res.locals.user.id)) {
            await EventService.start(req.params.eventId)
            
            res.json({status: "EVENT_STARTED_SUCCESSFULLY"})
        }
    }

    async end(req: Request<{ eventId: string }>, res: AuthMiddlewareResponse) {
        const event = await EventService.findEventById(req.params.eventId)

        if (event.rows[0].author_id == parseInt(res.locals.user.id)) {
            await EventService.end(req.params.eventId)
            res.json({status: "EVENT_ENDED_SUCCESSFULLY"})
        }
    }

    async interested(req: Request<{ eventId: string }>, res: AuthMiddlewareResponse) {
        const isInterestedQuery = await EventService.isInterested(res.locals.user.id, req.params.eventId)

        const isInterested = !(!!parseInt(isInterestedQuery.rows[0].is_interested))

        const result = await EventService.setInterested(res.locals.user.id, req.params.eventId, isInterested)

        if (result.rowCount == 1) {
            res.json({
                status: "SET_INTERESTED_SUCCESSFULLY",
                isInterested: isInterested ? 1 : 0
            })
        } else {
            res.json({status: "SET_INTERESTED_FAILED"})
        }
    }

    async getInterestedPlayers(req: Request<{ eventId: string }>, res: Response) {
        const players = await EventService.getInterestedPlayers(req.params.eventId)

        res.json({players: players.rows})
    }

    async addOrRemoveFromTeam(req: Request<{ eventId: string, userId: string }>, res: Response) {
        const isPlayerInTeam = await EventService.isUserInTeam(req.params.eventId, req.params.userId)

        await EventService.updateIsUserInTeam(req.params.eventId, req.params.userId, parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1)

        res.json({inTeam: parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1})
    }
}

export const EventsController = new Controller();