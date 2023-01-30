import express from "express"

import {authMiddleware} from "../middlewares/auth.middleware.js"
import {RunsController} from "../controllers/runs.controller.js"

const Router = express.Router()

Router.get("/run/all", authMiddleware, RunsController.getRuns)
Router.post("/run/create", authMiddleware, RunsController.create)
Router.delete("/run/:runId/delete", authMiddleware, RunsController.delete)
Router.put("/run/:runId/start", authMiddleware, RunsController.start)
Router.put("/run/:runId/end", authMiddleware, RunsController.end)
Router.put("/run/:runId/interested", authMiddleware, RunsController.interested)
Router.get("/run/:runId/interested", authMiddleware, RunsController.getInterestedPlayers)
Router.put("/run/:runId/in-team/:userId", authMiddleware, RunsController.addOrRemoveFromTeam)


export const RunsRouter = Router