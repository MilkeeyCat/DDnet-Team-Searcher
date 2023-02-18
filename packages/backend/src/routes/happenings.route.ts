import express, { Request } from 'express'
import { HappeningsController } from '../controllers/happenings.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { Map } from '@app/shared/types/Map.type.js'
import { EventRequest } from '@app/shared/types/EventRequest.type.js'
import multer from 'multer'
import fetch from 'node-fetch'
import { HappeningsService } from '../services/happenings.service.js'
import { paramsValidatorMiddleware } from '../middlewares/paramsValidator.middleware.js'
import { idSchema } from '../validationSchemas/id.scheme.js'
import { bodyValidatorMiddleware } from '../middlewares/bodyValidator.middleware.js'
import { runSchema } from '../validationSchemas/run.schema.js'
import { checkSchema, validationResult } from 'express-validator'
import { eventSchema } from '../validationSchemas/event.schema.js'
import { banMiddleware } from '../middlewares/ban.middleware.js'

// NOTE: If you will try to send custom request to create an event be sure you are sending a file last field either it wont work (It's not my fault, I swear)
const allowedExtensions = ['jpeg', 'jpg', 'png', 'webp']

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

        cb(null, uniqueSuffix + '.' + file.mimetype.split('/')[1])
    },
})

const createEvent = multer({
    storage,
    fileFilter: async (req, file, cb) => {
        await checkSchema(eventSchema).run(req)

        const errors = validationResult(req)
        const { eventStartDate, eventStartTime } = req.body

        if (!errors.isEmpty()) {
            cb(null, false)
            return
        }

        if (new Date(`${eventStartDate} ${eventStartTime}`).getTime() - new Date().getTime() < 0) {
            cb(null, false)
            return
        }

        if (allowedExtensions.some((name) => file.mimetype.includes(name))) {
            cb(null, true)
            return
        }

        cb(null, false)
    },
})

const updateEvent = multer({
    storage,
    //@ts-ignore it cries about number type here
    fileFilter: async (req: Request<{ happeningId: number }>, file, cb) => {
        const event = await HappeningsService.findHappeningById(req.params.happeningId)

        if (!event.rowCount) {
            cb(null, false)
            return
        }

        await checkSchema(eventSchema).run(req)

        const errors = validationResult(req)
        const { eventStartDate, eventStartTime } = req.body

        if (!errors.isEmpty()) {
            cb(null, false)
            return
        }

        const sameTime =
            new Date(`${eventStartDate} ${eventStartTime}`).getTime() ===
            new Date(event.rows[0].start_at).getTime()

        if (!sameTime && new Date(`${eventStartDate} ${eventStartTime}`).getTime() - new Date().getTime() < 0 ) {
            cb(null, false)
            return
        }

        if (allowedExtensions.some((name) => file.mimetype.includes(name))) {
            cb(null, true)
            return
        }

        cb(null, false)
    },
})

// i dunno how to get rid of "as any" but it throws an error without those widepeepoSad

const Router = express.Router()

Router.get(
    '/happenings/all/events',
    authMiddleware,
    HappeningsController.getAllEvents
)
Router.get(
    '/happenings/all/runs',
    authMiddleware,
    HappeningsController.getAllRuns
)
Router.post(
    '/happenings/create/event',
    authMiddleware,
    createEvent.single('thumbnail'),
    bodyValidatorMiddleware(eventSchema),
    HappeningsController.createEvent
)
Router.post(
    '/happenings/create/run',
    authMiddleware,
    bodyValidatorMiddleware(runSchema),
    HappeningsController.createRun
)
Router.put(
    '/happenings/:happeningId/update/run',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ["happeningId"]),
    HappeningsController.updateRun as any
)
Router.put(
    '/happenings/:happeningId/update/event',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId']),
    updateEvent.single('thumbnail'),
    bodyValidatorMiddleware(eventSchema),
    HappeningsController.updateEvent as any
)
Router.put(
    '/happenings/:happeningId/start',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId']),
    HappeningsController.startHappening as any
)
Router.put(
    '/happenings/:happeningId/end',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId']),
    HappeningsController.endHappening as any
)
Router.delete(
    '/happenings/:happeningId/delete',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId']),
    HappeningsController.deleteHappening as any
)
Router.put(
    '/happenings/:happeningId/interested',
    authMiddleware,
    banMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId']),
    HappeningsController.setIsInterested as any
)
Router.get(
    '/happenings/:happeningId/interested',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId']),
    HappeningsController.getInterestedPlayers as any
)
Router.put(
    '/happenings/:happeningId/in-team/:userId',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId', 'userId']),
    HappeningsController.addOrRemoveFromTeam as any
)

export const HappeningsRouter = Router
