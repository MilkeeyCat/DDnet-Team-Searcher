import express from "express"
import { EventsController } from "../controllers/events.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

import multer from "multer"

const upload = multer({dest: "./public"})

const Router = express.Router()

Router.post("/events/create", authMiddleware, EventsController.create)

export const EventsRouter = Router