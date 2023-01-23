import express from "express"

import {UsersController} from "../controllers/users.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const Router = express.Router()

Router.post("/register", UsersController.register)
Router.post("/login", UsersController.login)
Router.get("/fetch-data", authMiddleware, UsersController.fetchUserData)

export const UsersRouter = Router