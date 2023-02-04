import {Request, Response} from "express"
import {UsersService} from "../services/users.service.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type.js"
import { LoginRequest } from "@app/shared/types/LoginRequest.type"
import { RunsService } from "../services/runs.service.js"

class Controller {
    async register(req: Request<any, any, RegistrationRequest>, res: Response) {
        const {username, email, password, tier} = req.body

        const errors: (string | { field: keyof RegistrationRequest, text: string })[] = []

        Object.keys({username, email, password, tier}).map((key) => {
            if (req.body[key as keyof RegistrationRequest] === "" || req.body[key as keyof RegistrationRequest] === undefined) {
                errors.push({field: key as keyof RegistrationRequest, text: "Field is required"})
            }
        })

        if (tier > 6) {
            errors.push({field: "tier", text: "Tier value is invalid"})
        }
        if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email)) {
            errors.push({field: "email", text: "Check if your email is right!"})
        }

        // const isUserExists = await UsersService.findUser({username, email}, true)
        const isUserExists = await UsersService.isUserExistsByEmail(email)

        if (isUserExists) {
            errors.push("User with such a username or email already exists!")
        }

        if (errors.length !== 0) {
            res.status(400).json({status: "REGISTRATION_FAILED", message: errors[0]})
        }

        if (!errors.length && !isUserExists) {

            const result = await UsersService.register({username, email, password, tier})

            if (result.rowCount === 1) {
                res.json({status: "REGISTRATION_SUCCESSFUL"})
            } else {
                // something bad happened :\
            }
        }

    }

    async login(req: Request<any, any, { username: string, password: string }>, res: Response) {

        const {username, password} = req.body

        const errors: (string | { field: keyof LoginRequest, text: string })[] = []

        Object.keys({username, password}).map((key) => {
            if (req.body[key as keyof LoginRequest] === "" || req.body[key as keyof LoginRequest] === undefined) {
                errors.push({field: key as keyof LoginRequest, text: "Field is required"})
            }
        })

        if (errors.length !== 0) {
            res.status(400).json({status: "LOGIN_FAILED", message: errors[0]})
            return
        }

        const isUserExists = await UsersService.isUserExistsByUsername(username)
        
        if(isUserExists) {
            const user = await UsersService.getUserData(isUserExists, true)

            if (await bcrypt.compare(password, user.password || "")) {
                const token = jwt.sign(
                    {id: user.id, email: user.email},
                    process.env.TOKEN_KEY as string,
                    {
                        expiresIn: "2h",
                    }
                    )
                    
                    res.cookie("token", token, {httpOnly: true})
                    
                    res.json({status: "LOGIN_SUCCESSFUL"})
            }
        } else {
            res.status(400).json({status: "LOGIN_FAILED", message: "Username or password is wrong!"})
        }
    }

    async fetchUserData(_: Request, res: AuthMiddlewareResponse) {
        const user = await UsersService.getUserData(res.locals.user.id)

        res.json(user)
    }

    async getUserProfile(req: Request<{userId: string}>, res: AuthMiddlewareResponse) {
        const {userId} = req.params
    
        const user = await UsersService.getUserData(userId)

        res.json(user)
    }

    async getUserRuns(req: Request<{userId: string}>, res: AuthMiddlewareResponse) {
        const {userId} = req.params
        
        if(userId !== undefined) {
            // show somebody's profile
            const user = await UsersService.isUserExistsById(userId)

            if(user) {
                // user exists
                const runs = await RunsService.getUserRuns(userId)

                res.json(runs.rows)
            } else {
                // user does not exist
                res.status(404).json({status: "USER_NOT_FOUND"})
            }
        } else {
            // show own profile
            const runs = await RunsService.getUserRuns(res.locals.user.id)

            res.json(runs.rows)
        }
    }
}

export const UsersController = new Controller()