import {Request, Response} from "express"
import {UsersService} from "../services/users.service.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type"
import { RegistrationRequest } from "@app/shared/types/RegistrationRequest.type.js"
import { LoginRequest } from "@app/shared/types/LoginRequest.type"
// import { RunsService } from "../services/runs.service.js"
import { RolesService } from "../services/roles.service.js"
import { ResponseHandler } from "@app/shared/types/ReponseHandler.type"
import { LoginResponse, RegistrationResponse, UserDataResponse, UserFollowResponse, UserProfileResponse, UserRolesResponse, UserRunsResponse } from "@app/shared/types/api/users.types"
import { HappeningsService } from "../services/happenings.service.js"
import { FollowersService } from "../services/followers.service.js"
 
class Controller {
    async register(req: Request<any, any, RegistrationRequest>, res: ResponseHandler<RegistrationResponse>): Promise<void> {
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

        const isUserExists = await UsersService.isUserExistsByEmail(email)

        if (isUserExists) {
            errors.push("User with such a username or email already exists!")
        }

        if (errors.length !== 0) {
            res.status(400).json({
                status: "REGISTRATION_FAILED",
                data: errors[0]
            })
        }

        if (!errors.length && !isUserExists) {

            const result = await UsersService.register({username, email, password, tier})

            if (result) {
                res.json({status: "REGISTRATION_SUCCESSFUL"})
            } else {
                // something bad happened :\
            }
        }

    }

    async login(req: Request<any, any, { username: string, password: string }>, res: ResponseHandler<LoginResponse>): Promise<void> {

        const {username, password} = req.body

        const errors: (string | { field: keyof LoginRequest, text: string })[] = []

        Object.keys({username, password}).map((key) => {
            if (req.body[key as keyof LoginRequest] === "" || req.body[key as keyof LoginRequest] === undefined) {
                errors.push({field: key as keyof LoginRequest, text: "Field is required"})
            }
        })

        if (errors.length !== 0) {
            res.status(400).json({
                status: "LOGIN_FAILED",
                data: errors[0]
            })
            return
        }

        const isUserExists = await UsersService.isUserExistsByUsername(username)
        
        if(isUserExists) {
            const user = await UsersService.getUserData(isUserExists, true)

            console.log(user);
            

            if (await bcrypt.compare(password, user.password || "")) {
                const token = jwt.sign(
                        {id: user.id, email: user.email},
                        process.env.TOKEN_KEY as string,
                        {
                            expiresIn: "2h",
                        }
                    )
                    
                    res.cookie("token", token, {httpOnly: true})
                    
                    res.json({
                        status: "LOGIN_SUCCESSFUL"
                    })
            } else {
                res.status(400).json({
                    status: "LOGIN_FAILED",
                    data: "Username or password is wrong!"
                })
            }
        } else {
            res.status(400).json({
                status: "LOGIN_FAILED",
                data: "Username or password is wrong!"
            })
        }
    }

    async fetchUserData(_: Request, res: ResponseHandler<UserDataResponse, AuthMiddlewareResponse>): Promise<void> {
        const user = await UsersService.getUserData(res.locals.user.id, false, true)

        res.json({
            status: "SUCCESS",
            data: user
        })
    }

    async getUserProfile(req: Request<{userId: string}>, res: ResponseHandler<UserProfileResponse, AuthMiddlewareResponse>) {
        const {userId} = req.params

        const isUserExists = await UsersService.isUserExistsById(userId)

        if(isUserExists) {
            const user = await UsersService.getUserData(userId, false, false)
            const followStats = await FollowersService.getFollowStats(parseInt(userId))
            
            if(parseInt(res.locals.user.id) !== parseInt(userId)) {
                const following = await FollowersService.isUserFolling({follower: parseInt(res.locals.user.id), following: parseInt(userId)})

                res.json({
                    status: "SUCCESS",
                    data: {...user, following, followStats},
                })
                return
            }
            res.json({
                status: "SUCCESS",
                data: {...user, followStats}
            })
        } else {
            res.status(404).json({
                status: "USER_NOT_FOUND"
            })
        }
    }

    async getUserRoles(req: Request<{userId: string}>, res: ResponseHandler<UserRolesResponse, AuthMiddlewareResponse>): Promise<void> {
        const {userId} = req.params
        
        if(userId !== undefined) {
            // show somebody's profile
            const user = await UsersService.isUserExistsById(userId)

            if(user) {
                // user exists
                const runs = await RolesService.getUserRoles(userId)

                res.json({
                    status: "SUCCESS",
                    data: runs.rows
                })
            } else {
                // user does not exist
                res.status(404).json({status: "USER_NOT_FOUND"})
            }
        } else {
            // show own profile
            const runs = await RolesService.getUserRoles(res.locals.user.id)

            res.json({
                status: "SUCCESS",
                data: runs.rows
            })
        }
    }

    async getUserRuns(req: Request<{userId: string}>, res: ResponseHandler<UserRunsResponse, AuthMiddlewareResponse>): Promise<void> {
        const {userId} = req.params
        
        if(userId !== undefined) {
            // show somebody's profile
            const user = await UsersService.isUserExistsById(userId)

            if(user) {
                // user exists
                const runs = await HappeningsService.getUserRuns(userId)

                res.json({
                    status: "SUCCESS",
                    data: runs.rows
                })
            } else {
                // user does not exist
                res.status(404).json({status: "USER_NOT_FOUND"})
            }
        } else {
            // show own profile
            const runs = await HappeningsService.getUserRuns(res.locals.user.id)

            res.json({
                status: "SUCCESS",
                data: runs.rows
            })
        }
    }

    async follow(req: Request<{userId: string}>, res: ResponseHandler<UserFollowResponse, AuthMiddlewareResponse>) {
        const { userId } = req.params

        const isUserExists = await UsersService.isUserExistsById(userId)

        if(isUserExists) {
            const result = await FollowersService.follow({follower: parseInt(res.locals.user.id), following: parseInt(userId)})

            if(result) {
                res.json({
                    status: "SUCCESS",
                    data: "Success =]"
                })
            } else {
                res.status(500).json({
                    status: "ERROR_OCURRED",
                    data: "Some error has occured"
                })
            }
        } else {
            res.status(400).json({
                status: "USER_DOESNT_EXISTS",
                data: "User doesnt exists"
            })
        }
    }
}

export const UsersController = new Controller()