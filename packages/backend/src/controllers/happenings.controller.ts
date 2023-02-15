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

        if ((new Date(`${runStartDate} ${runStartTime}`).getTime() - new Date().getTime()) < 0) {
            res.status(400).json({
                status: "BAD_DATA",
                data: "Do u live in past or what? xD choose time that is in future!"
            })
            return
        }

        const result = await HappeningsService.createRun({
            place,
            teamSize,
            description,
            mapName,
            runStartDate,
            runStartTime,
            authorId: res.locals.user.id
        })

        if(result) {
            res.json({
                status: "RUN_CREATED_SUCCESSFULLY",
                data: "Run created successfully :)"
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Some error has occured"
        })
    }

    async updateRun(req: Request<{happeningId: number}, {}, RunRequest>, res: ResponseHandler<UpdateRunResponse, AuthMiddlewareResponse>) {
        const {place, mapName, teamSize, runStartDate, runStartTime, description} = req.body
        const run = await HappeningsService.findHappeningById(req.params.happeningId)
        
        if(!run.rowCount) {
            res.status(400).json({
                status: "BAD_DATA",
                data: "Happening to update not found"
            })
            return
        }
        
        const sameTime = new Date(`${runStartDate} ${runStartTime}`).getTime() === new Date(run.rows[0].start_at).getTime()

        if (!sameTime && (new Date(`${runStartDate} ${runStartTime}`).getTime() - new Date().getTime()) < 0) {
            res.json({
                status: "BAD_DATA",
                data: "Do u live in past or what? xD choose time that is in future!"
            })
            return
        }

        const result = await HappeningsService.updateRun({
            place,
            teamSize,
            description,
            mapName,
            runStartDate,
            runStartTime,
            id: req.params.happeningId
        })

        if(result) {
            res.json({
                status: "RUN_UPDATED_SUCCESSFULLY",
                data: "Run updated successfully :)"
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Some error has occurred"
        })
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

        if ((new Date(`${eventStartDate} ${eventStartTime}`).getTime() - new Date().getTime()) < 0) {
            res.status(400).json({
                status: "BAD_DATA",
                data: "Do u live in past or what? xD choose time that is in future!"
            })
            return
        }
        
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
            authorId: res.locals.user.id
        })

        if(result) {
            res.json({
                status: "EVENT_CREATED_SUCCESSFULLY",
                data: "Event created successfully :)"
            })
            return
        }

        res.json({
            status: "EVENT_CREATION_FAILED",
            data: "I have no clue why but I couldnt create an event. Im sorry 😭"
        })
    }

    async updateEvent(req: Request<{ happeningId: number }, {}, EventRequest>, res: ResponseHandler<UpdateEventResponse, AuthMiddlewareResponse>) {
        const {place, mapName, teamSize, eventStartDate, eventStartTime, eventEndDate, eventEndTime, description} = req.body

        const happening = await HappeningsService.findHappeningById(req.params.happeningId)

        if(!happening.rowCount) {
            res.json({
                status: "BAD_DATA",
                data: "Happening doest exist"
            })
        }

        if(happening.rows[0]?.thumbnail) {
            try {
                await fs.unlink(`./public/${happening.rows[0].thumbnail}`)
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    status: "ERROR_OCCURRED",
                    data: "Some error has occured, couldnt delete the " + happening.rows[0].type
                })
                return
            }
        }

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
            return
        } 

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "I have no clue why but I couldnt create an event. Im sorry 😭"
        })
    }
    
    async startHappening(req: Request<{happeningId: number}>, res: ResponseHandler<StartHappeningResponse, AuthMiddlewareResponse>) {
        const happening = await HappeningsService.findHappeningById(req.params.happeningId)

        if(!happening.rowCount) {
            res.status(404).json({
                status: "HAPPENING_NOT_FOUND"
            })
        }

        if (happening.rows[0].author_id == res.locals.user.id) {
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

    async endHappening(req: Request<{ happeningId: number }>, res: ResponseHandler<EndHappeningResponse, AuthMiddlewareResponse>): Promise<void> {
        const happening = await HappeningsService.findHappeningById(req.params.happeningId)

        if(!happening.rowCount) {
            res.status(404).json({
                status: "HAPPENING_NOT_FOUND"
            })
        }

        if (happening.rows[0].author_id == res.locals.user.id) {
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

    async deleteHappening(req: Request<{happeningId: number}>, res: ResponseHandler<DeleteHappeningResponse, AuthMiddlewareResponse>): Promise<void> {
        const happening = await HappeningsService.findHappeningById(req.params.happeningId)
        
        if(!happening.rowCount) {
            res.status(404).end()
            return
        } else if (happening.rows[0].author_id !== res.locals.user.id) {
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

    async setIsInterested(req: Request<{ happeningId: number }>, res: ResponseHandler<SetInterestedResponse, AuthMiddlewareResponse>): Promise<void> {
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

    async getInterestedPlayers(req: Request<{ happeningId: number }>, res: ResponseHandler<InterestedPlayersResponse>): Promise<void> {
        const players = await HappeningsService.getInterestedPlayers(req.params.happeningId)

        res.json({
            status: "SUCCESS",
            data: players.rows
        })
    }

    async addOrRemoveFromTeam(req: Request<{ happeningId: number, userId: number }>, res: ResponseHandler<AddOrRemoveFromTeamResponse, AuthMiddlewareResponse>) {
        const isPlayerInTeam = await HappeningsService.isUserInTeam(req.params.happeningId, req.params.userId)

        await HappeningsService.updateIsUserInTeam(req.params.happeningId, req.params.userId, isPlayerInTeam.rows[0].in_team === 1 ? 0 : 1)

        res.json({
            status: "SUCCESS",
            data: isPlayerInTeam.rows[0].in_team === 1 ? 0 : 1
        })
    }
}

export const HappeningsController = new Controller()