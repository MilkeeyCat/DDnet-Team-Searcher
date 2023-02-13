import express from "express"

import {UsersController} from "../controllers/users.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const Router = express.Router()

Router.post("/register", UsersController.register)
Router.post("/login", UsersController.login)
Router.get("/fetch-data", authMiddleware, UsersController.fetchUserData)


Router.get("/user/:userId", authMiddleware, UsersController.getUserProfile)
Router.put("/user/:userId/follow", authMiddleware, UsersController.follow)
Router.get("/user/:userId?/roles", authMiddleware, UsersController.getUserRoles)
Router.get("/user/:userId?/runs", authMiddleware, UsersController.getUserRuns)
export const UsersRouter = Router