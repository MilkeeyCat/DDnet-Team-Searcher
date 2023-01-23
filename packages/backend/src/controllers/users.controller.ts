import {Request, Response} from "express"
import {UsersService} from "../services/users.service.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type.js"
import { LoginRequest } from "@app/shared/types/LoginRequest.type"

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

        const isUserExists = await UsersService.findUser({username, email}, true)

        if (isUserExists.rows.length) {
            errors.push("User with such a username or email already exists!")
        }

        if (errors.length !== 0) {
            res.status(400).json({status: "REGISTRATION_FAILED", message: errors[0]})
        }

        if (!errors.length && !isUserExists.rows.length) {

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

        const user = await UsersService.findUser({username})

        if (user.rows.length !== 0 && (await bcrypt.compare(password, user.rows[0].password || ""))) {
            const token = jwt.sign(
                {id: user.rows[0].id, email: user.rows[0].email},
                process.env.TOKEN_KEY as string,
                {
                    expiresIn: "2h",
                }
            )

            res.cookie("token", token, {httpOnly: true})

            res.json({status: "LOGIN_SUCCESSFUL"})
        } else {
            res.status(400).json({status: "LOGIN_FAILED", message: "Username or password is wrong!"})
        }
    }

    async fetchUserData(_: Request, res: AuthMiddlewareResponse) {
        const user = await UsersService.findUser({email: res.locals.user.email, id: res.locals.user.id})

        const {password, ...data} = user.rows[0]        

        res.json(data)
    }
}

export const UsersController = new Controller()