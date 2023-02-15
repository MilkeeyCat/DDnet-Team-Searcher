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
import { LoginResponse, RegistrationResponse, UserDataResponse, UserFollowResponse, UserProfileResponse, UserReportResponse, UserRolesResponse, UserRunsResponse } from "@app/shared/types/api/users.types"
import { HappeningsService } from "../services/happenings.service.js"
import { FollowersService } from "../services/followers.service.js"
import { ReportsService } from "../services/reports.service.js"

class Controller {
    async register(req: Request<any, any, RegistrationRequest>, res: ResponseHandler<RegistrationResponse>): Promise<void> {
        const {username, email, password, tier} = req.body

        const isUserExists = await UsersService.isUserExistsByEmail(email)

        if (isUserExists) {
            res.status(400).json({
                status: "REGISTRATION_FAILED",
                data: "User with such a username or email already exists!"
            })
            return
        }

        const result = await UsersService.register({username, email, password, tier})

        if (result) {
            res.json({
                status: "REGISTRATION_SUCCESSFUL"
            })
        } else {
            res.status(500).json({
                status: "ERROR_OCCURED"
            })
        }
    }

    async login(req: Request<any, any, { username: string, password: string }>, res: ResponseHandler<LoginResponse>): Promise<void> {
        const {username, password} = req.body

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
                    
                    res.cookie("token", token, {httpOnly: true, sameSite: "lax"})
                    
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

    async getUserProfile(req: Request<{userId: number}>, res: ResponseHandler<UserProfileResponse, AuthMiddlewareResponse>) {
        const {userId} = req.params

        const isUserExists = await UsersService.isUserExistsById(userId)

        if(isUserExists) {
            const user = await UsersService.getUserData(userId, false, false)
            const followStats = await FollowersService.getFollowStats(userId)
            
            if(res.locals.user.id !== userId) {
                const following = await FollowersService.isUserFolling({follower: res.locals.user.id, following: userId})
                const reported = await ReportsService.isReportAlreadyExists({authorId: res.locals.user.id, reportedUserId: userId})

                res.json({
                    status: "SUCCESS",
                    data: {...user, following, followStats, reported},
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

    async getUserRoles(req: Request<{userId: number}>, res: ResponseHandler<UserRolesResponse, AuthMiddlewareResponse>): Promise<void> {
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

    async getUserRuns(req: Request<{userId: number}>, res: ResponseHandler<UserRunsResponse, AuthMiddlewareResponse>): Promise<void> {
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

    async follow(req: Request<{userId: number}>, res: ResponseHandler<UserFollowResponse, AuthMiddlewareResponse>) {
        const { userId } = req.params

        const isUserExists = await UsersService.isUserExistsById(userId)

        if(isUserExists) {
            const result = await FollowersService.follow({follower: res.locals.user.id, following: userId})

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

    async reportUser(req: Request<{userId: number}, {}, {text: string}>, res: ResponseHandler<UserReportResponse, AuthMiddlewareResponse>) {
        const {userId} = req.params

        const isUserAlreadyReported = await ReportsService.isReportAlreadyExists({authorId: res.locals.user.id, reportedUserId: userId})

        if(isUserAlreadyReported) {
            res.status(400).json({
                status: "USER_ALREADY_REPORTED",
                data: "You cannot report this user because you already did"
            })
            return
        } else {
            const result = await ReportsService.createReport({
                authorId: res.locals.user.id,
                reportedUserId: userId,
                text: req.body.text
            })

            if(result) {
                res.json({
                    status: "SUCCESS",
                    data: "User reported successfully!"
                })
                return
            }

            res.status(500).json({
                status: "ERROR_OCCURED",
                data: "Some error has occured"
            })
        }
    }
}

export const UsersController = new Controller()