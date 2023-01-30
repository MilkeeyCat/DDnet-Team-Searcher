import {RegistrationRequest} from "@app/shared/types/RegistrationRequest.type"
import {Request, Response} from "express"
import fetch from "node-fetch"
import {RunsService} from "../services/runs.service.js"
import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type";
import { Map } from "@app/shared/types/Map.type.js";
import { RunRequest } from "@app/shared/types/RunRequest.type"

class Controller {
    async getRuns(_: Request, res: AuthMiddlewareResponse) {
        const result = await RunsService.getRuns(res.locals.user.id)

        return res.json(result.rows)
    }

    async create(req: Request<{}, {}, RunRequest>, res: AuthMiddlewareResponse) {
        const {place, mapName, teamSize, runStartDate, runStartTime, description} = req.body

        const request = await fetch("https://ddnet.org/releases/maps.json")
        
        let availableMaps = await request.json() as Array<Map>
        const mapNames = availableMaps?.map((map) => map.name)

        const errors: (string | { field: keyof RegistrationRequest, text: string })[] = []

        Object.keys({place, mapName, teamSize, runStartDate, runStartTime}).map((key) => {
            if (req.body[key as keyof RunRequest] === "" || req.body[key as keyof RunRequest] === undefined) {
                errors.push({field: key as keyof RegistrationRequest, text: "Field is required"})
            }
        })

        if (place !== "0" && place !== "1") {
            errors.push("Invalid place field value")
        }

        if (!mapNames.includes(mapName)) {
            errors.push("Invalid map name")
        }

        if (!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(runStartDate)) {
            errors.push("Invalid run start date field value")
        }

        if (!/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(runStartTime)) {
            errors.push("Invalid run start time field value")
        }

        if ((new Date(`${runStartDate} ${runStartTime}`).getTime() - new Date().getTime()) < 0) {
            errors.push("Do u live in past or what? xD choose time that is in future!")
        }

        if (isNaN(parseInt(teamSize))) {
            errors.push("Invalid team size field value")
        }

        if (errors.length !== 0) {
            res.status(400).json({status: "RUN_CREATION_FAILED", message: errors[0]})
        } else {
            const result = await RunsService.create({
                place,
                teamSize,
                description,
                mapName,
                runStartDate,
                runStartTime,
                authorId: parseInt(res.locals.user.id)
            })

            res.json({status: "RUN_CREATED_SUCCESSFULLY", message: "Run created successfully :)", run: {}})
        }
    }

    async start(req: Request<{ runId: string }>, res: AuthMiddlewareResponse) {
        const run = await RunsService.findRunById(req.params.runId)

        if (run.rows[0].author_id == parseInt(res.locals.user.id)) {
            await RunsService.start(req.params.runId)
            
            res.json({status: "RUN_STARTED_SUCCESSFULLY"})
        }
    }

    async delete(req: Request<{ runId: string }>, res: Response) {
        const run = await RunsService.findRunById(req.params.runId) // TODO: you cant delete run ⊙﹏⊙ YET
    }

    async end(req: Request<{ runId: string }>, res: AuthMiddlewareResponse) {
        const run = await RunsService.findRunById(req.params.runId)

        if (run.rows[0].author_id == parseInt(res.locals.user.id)) {
            await RunsService.end(req.params.runId)
            res.json({status: "RUN_ENDED_SUCCESSFULLY"})
        }
    }

    async interested(req: Request<{ runId: string }>, res: AuthMiddlewareResponse) {
        const isInterestedQuery = await RunsService.isInterested(res.locals.user.id, req.params.runId)

        const isInterested = !(!!parseInt(isInterestedQuery.rows[0].is_interested))

        const result = await RunsService.setInterested(res.locals.user.id, req.params.runId, isInterested)

        if (result.rowCount == 1) {
            res.json({
                status: "SET_INTERESTED_SUCCESSFULLY",
                isInterested: isInterested ? 1 : 0
            })
        } else {
            res.json({status: "SET_INTERESTED_FAILED"})
        }
    }

    async getInterestedPlayers(req: Request<{ runId: string }>, res: Response) {
        const players = await RunsService.getInterestedPlayers(req.params.runId)

        res.json({players: players.rows})
    }

    async addOrRemoveFromTeam(req: Request<{ runId: string, userId: string }>, res: Response) {
        const isPlayerInTeam = await RunsService.isUserInTeam(req.params.runId, req.params.userId)

        console.log(isPlayerInTeam)

        await RunsService.updateIsUserInTeam(req.params.runId, req.params.userId, parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1)

        res.json({inTeam: parseInt(isPlayerInTeam.rows[0].in_team) === 1 ? 0 : 1})
    }
}

export const RunsController = new Controller()