import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type"
import { ResponseHandler } from "@app/shared/types/ReponseHandler.type"
import { Request } from "express"
import { HappeningsService } from "../services/happenings.service.js"
import { AddOrRemoveFromTeamResponse, CreateEventResponse, CreateRunResponse, DeleteHappeningResponse, EndHappeningResponse, GetAllEventsResponse, GetAllRunsResponse, InterestedPlayersResponse, SetInterestedResponse, StartHappeningResponse, UpdateEventResponse, UpdateRunResponse } from "@app/shared/types/api/happenings.type.js"
import { RunRequest } from "@app/shared/types/RunRequest.type.js"
import { Map } from "@app/shared/types/Map.type.js"
import { EventRequest } from "@app/shared/types/EventRequest.type.js"
import fetch from "node-fetch"
import fs from "fs/promises"

class Controller {
    async getAllRuns(_: Request, res: ResponseHandler<GetAllRunsResponse, AuthMiddlewareResponse>): Promise<void> {
        const runs = await HappeningsService.getAllRuns(res.locals.user.id)

        res.json({
            status: "SUCCESS",
            data: runs.rows
        })
    }

    async createRun(req: Request<{}, {}, RunRequest>, res: ResponseHandler<CreateRunResponse, AuthMiddlewareResponse>) {
        const {place, mapName, teamSize, runStartDate, runStartTime, description} = req.body

        const request = await fetch("https://ddnet.org/releases/maps.json")
        
        let availableMaps = await request.json() as Array<Map>
        const mapNames = availableMaps?.map((map) => map.name)

        const errors: (string | { field: keyof RunRequest, text: string })[] = []

        Object.keys({place, mapName, teamSize, runStartDate, runStartTime}).map((key) => {
            if (req.body[key as keyof RunRequest] === "" || req.body[key as keyof RunRequest] === undefined) {
                errors.push({field: key as keyof RunRequest, text: "Field is required"})
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
            res.status(400).json({
                status: "RUN_CREATION_FAILED",
                data: errors[0]
            })
        } else {
            const result = await HappeningsService.createRun({
                place,
                teamSize,
                description,
                mapName,
                runStartDate,
                runStartTime,
                authorId: parseInt(res.locals.user.id)
            })

            res.json({
                status: "RUN_CREATED_SUCCESSFULLY",
                data: "Run created successfully :)"
            })
        }
    }

    async updateRun(req: Request<{happeningId: string}, {}, RunRequest>, res: ResponseHandler<UpdateRunResponse, AuthMiddlewareResponse>) {
        const {place, mapName, teamSize, runStartDate, runStartTime, description} = req.body

        const run = await HappeningsService.findHappeningById(req.params.happeningId)

        const request = await fetch("https://ddnet.org/releases/maps.json")

        let availableMaps = await request.json() as Array<Map>
        const mapNames = availableMaps?.map((map) => map.name)

        const errors: (string | { field: keyof RunRequest, text: string })[] = []

        Object.keys({place, mapName, teamSize, runStartDate, runStartTime}).map((key) => {
            if (req.body[key as keyof RunRequest] === "" || req.body[key as keyof RunRequest] === undefined) {
                errors.push({field: key as keyof RunRequest, text: "Field is required"})
            }
        })

        //@ts-ignore
        if (parseInt(place) !== 0 && parseInt(place) !== 1) {
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

        const sameTime = new Date(`${runStartDate} ${runStartTime}`).getTime() === new Date(run.rows[0].start_at).getTime()

        if (!sameTime && (new Date(`${runStartDate} ${runStartTime}`).getTime() - new Date().getTime()) < 0) {
            errors.push("Do u live in past or what? xD choose time that is in future!")
        }

        if (isNaN(parseInt(teamSize))) {
            errors.push("Invalid team size field value")
        }

        if (errors.length !== 0) {
            res.status(400).json({
                status: "RUN_UPDATING_FAILED",
                data: errors[0]
            })
        } else {
            const result = await HappeningsService.updateRun({
                place,
                teamSize,
                description,
                mapName,
                runStartDate,
                runStartTime,
                id: req.params.happeningId
            })

            res.json({
                status: "RUN_UPDATED_SUCCESSFULLY",
                data: "Run updated successfully :)"
            })
        }
    }

    async getAllEvents(_: Request, res: ResponseHandler<GetAllEventsResponse, AuthMiddlewareResponse>): Promise<void> {
        const events = await HappeningsService.getAllEvents(res.locals.user.id)

        res.json({
            status: "SUCCESS",
            data: events.rows
        })
    }

    async createEvent(req: Request<{}, {}, EventRequest>, res: ResponseHandler<CreateEventResponse, AuthMiddlewareResponse>) {
        const {place, mapName, teamSize, eventStartDate, eventStartTime, eventEndDate, eventEndTime, description} = req.body

        //@ts-ignore I know it's fuckind bad but I really coudnt find any better solution. Im sorry :(
        const errors: (string | { field: keyof EventRequest, text: string })[] = req.errors

        if(errors?.length) {
            res.status(400).json({
                status: "EVENT_CREATION_FAILED",
                data: errors[0]
            })
        }
         else {
            const result = await HappeningsService.createEvent({
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

            if(result) {
                res.json({
                    status: "EVENT_CREATED_SUCCESSFULLY",
                    data: "Event created successfully :)"
                })
            } else {
                res.json({
                    status: "EVENT_CREATION_FAILED",
                    data: "I have no clue why but I couldnt create an event. Im sorry 😭"
                })
            }
        }
    }

    async updateEvent(req: Request<{ happeningId: string }, {}, EventRequest>, res: ResponseHandler<UpdateEventResponse, AuthMiddlewareResponse>) {
        const {place, mapName, teamSize, eventStartDate, eventStartTime, eventEndDate, eventEndTime, description} = req.body

        const happening = await HappeningsService.findHappeningById(req.params.happeningId)

        if(happening.rows[0].thumbnail) {
            try {
                await fs.unlink(`./public/${happening.rows[0].thumbnail}`)
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    status: "ERROR_OCCURED",
                    data: "Some error has occured, couldnt delete the " + happening.rows[0].type
                })
                return
            }
        }
        //@ts-ignore I know it's fuckind bad but I really coudnt find any better solution. Im sorry :(
        const errors: (string | { field: keyof EventRequest, text: string })[] = req.errors

        if(errors?.length) {
            res.status(400).json({
                status: "EVENT_UPDATING_FAILED",
                data: errors[0]
            })
        }
         else {
            const result = await HappeningsService.updateEvent({
                place,
                teamSize,
                description,
                mapName,
                eventStartDate,
                eventStartTime,
                eventEndDate,
                eventEndTime,
                thumbnail: req.file ? req.file.filename : undefined,
                id: req.params.happeningId
            })

            if(result) {
                res.json({
                    status: "EVENT_UPDATED_SUCCESSFULLY",
                    data: "Event created successfully :)"
                })
            } else {
                res.json({
                    status: "EVENT_UPDATING_FAILED",
                    data: "I have no clue why but I couldnt create an event. Im sorry 😭"
                })
            }
        }
    }
    
    async startHappening(req: Request<{happeningId: string}>, res: ResponseHandler<StartHappeningResponse, AuthMiddlewareResponse>) {
        const happening = await HappeningsService.findHappeningById(req.params.happeningId)

        if(!happening.rowCount) {
            res.status(404).json({
                status: "HAPPENING_NOT_FOUND"
            })
        }

        if (happening.rows[0].author_id == parseInt(res.locals.user.id)) {
            const result = await HappeningsService.startHappening(req.params.happeningId)
            
            if(result) {
                res.json({
                    status: "HAPPENING_STARTED_SUCCESSFULLY"
                })
            }
        } else {
            res.status(400).json({
                status: "PERMISSION_DENIED"
            })
        }
    }

    async endHappening(req: Request<{ happeningId: string }>, res: ResponseHandler<EndHappeningResponse, AuthMiddlewareResponse>): Promise<void> {
        const happening = await HappeningsService.findHappeningById(req.params.happeningId)

        if(!happening.rowCount) {
            res.status(404).json({
                status: "HAPPENING_NOT_FOUND"
            })
        }

        if (happening.rows[0].author_id == parseInt(res.locals.user.id)) {
            const result = await HappeningsService.endHappening(req.params.happeningId)
            
            if(result) {
                res.json({
                    status: "HAPPENING_ENDED_SUCCESSFULLY"
                })
            }
        } else {
            res.status(400).json({
                status: "PERMISSION_DENIED"
            })
        }
    }

    async deleteHappening(req: Request<{happeningId: string}>, res: ResponseHandler<DeleteHappeningResponse, AuthMiddlewareResponse>): Promise<void> {
        const happening = await HappeningsService.findHappeningById(req.params.happeningId)
        
        if(!happening.rowCount) {
            res.status(404).end()
            return
        } else if (happening.rows[0].author_id !== parseInt(res.locals.user.id)) {
            res.status(404).end()
            return
        } else if (happening.rows[0].status == 1) {
            res.json({
                status: "ERROR_OCCURED",
                data: `Cant delete ${happening.rows[0].type} while it is happening now`
            })
            return
        }

        if(happening.rows[0].thumbnail) {
            try {
                await fs.unlink(`./public/${happening.rows[0].thumbnail}`)
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    status: "ERROR_OCCURED",
                    data: "Some error has occured, couldnt delete the " + happening.rows[0].type
                })
                return
            }
        }
        
        const result = await HappeningsService.deleteHappening(req.params.happeningId)
        
        if(result) {
            res.json({
                status: "HAPPENING_DELETED_SUCCESSFULLY"
            })
        } else {
            res.status(500).json({
                status: "ERROR_OCCURED",
                data: "Some error has occured, couldnt delete the " + happening.rows[0].type
            })
        }
    }

    async setIsInterested(req: Request<{ happeningId: string }>, res: ResponseHandler<SetInterestedResponse, AuthMiddlewareResponse>): Promise<void> {
        const isInterestedQuery = await HappeningsService.isInterested(res.locals.user.id, req.params.happeningId)

        const isInterested = !isInterestedQuery.is_interested

        const result = await HappeningsService.setInterested(res.locals.user.id, req.params.happeningId, isInterested)

        if (result.rowCount == 1) {
            res.json({
                status: "SET_INTERESTED_SUCCESSFULLY",
                data: isInterested ? true : false
            })
        } else {
            res.json({status: "SET_INTERESTED_FAILED"})
        }
    }

    async getInterestedPlayers(req: Request<{ happeningId: string }>, res: ResponseHandler<InterestedPlayersResponse>): Promise<void> {
        const players = await HappeningsService.getInterestedPlayers(req.params.happeningId)

        res.json({
            status: "SUCCESS",
            data: players.rows
        })
    }

    async addOrRemoveFromTeam(req: Request<{ happeningId: string, userId: string }>, res: ResponseHandler<AddOrRemoveFromTeamResponse, AuthMiddlewareResponse>) {
        const isPlayerInTeam = await HappeningsService.isUserInTeam(req.params.happeningId, req.params.userId)

        await HappeningsService.updateIsUserInTeam(req.params.happeningId, req.params.userId, isPlayerInTeam.rows[0].in_team === 1 ? 0 : 1)

        res.json({
            status: "SUCCESS",
            data: isPlayerInTeam.rows[0].in_team === 1 ? 0 : 1
        })
    }
}

export const HappeningsController = new Controller()