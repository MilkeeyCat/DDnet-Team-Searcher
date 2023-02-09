import express from "express"
import { HappeningsController } from "../controllers/happenings.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { Map } from "@app/shared/types/Map.type.js"
import { EventRequest } from "@app/shared/types/EventRequest.type.js"
import multer from "multer"
import fetch from "node-fetch"

// NOTE: If you will try to send custom request to create an event be sure you are sending a file last field either it wont work (It's not my fault, I swear)

const allowedExtensions = [
    "jpeg",
    "jpg",
    "png",
    "webp",
]

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./public")
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            
                cb(null, uniqueSuffix + "." + file.mimetype.split("/")[1])
        }
    }),
    fileFilter: async (req, file, cb) => {
        
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

        //@ts-ignore I DONT FUCKING KNOW HOW TO DO IT BETTER, IVE SPENT 1.5 HOURS ON THIS
        req.errors = errors

        if(allowedExtensions.some(name => file.mimetype.includes(name)) && !errors.length) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})

const Router = express.Router()

Router.get("/happenings/all/events", authMiddleware, HappeningsController.getAllEvents)
Router.get("/happenings/all/runs", authMiddleware, HappeningsController.getAllRuns)

Router.post("/happenings/create/event", authMiddleware, upload.single("thumbnail"), HappeningsController.createEvent)
Router.post("/happenings/create/run", authMiddleware, HappeningsController.createRun)

Router.put("/happenings/:happeningId/start", authMiddleware, HappeningsController.startHappening)
Router.put("/happenings/:happeningId/end", authMiddleware, HappeningsController.endHappening)
Router.delete("/happenings/:happeningId/delete", authMiddleware, HappeningsController.deleteHappening)
Router.put("/happenings/:happeningId/interested", authMiddleware, HappeningsController.setIsInterested)
Router.get("/happenings/:happeningId/interested", authMiddleware, HappeningsController.getInterestedPlayers)
Router.put("/happenings/:happeningId/in-team/:userId", authMiddleware, HappeningsController.addOrRemoveFromTeam)

export const HappeningsRouter = Router