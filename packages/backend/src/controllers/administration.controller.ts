import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type.js"
import { ResponseHandler } from "@app/shared/types/ReponseHandler.type.js"
import { Request } from "express"
import { AdministrationDeleteBan, AdministrationDeleteReport, AdministrationDeleteUser, AdministrationGetBans, AdministrationGetReports, AdministrationGetRoles, AdministrationGetUsers, AdministrationUpdateBanInfo, AdministrationUpdateReport, AdministrationUpdateUser } from "@app/shared/types/api/administration.type.js"
import { BanService, DBBan } from "../services/ban.service.js"
import { matchedData } from "express-validator"
import { ReportsService } from "../services/reports.service.js"
import { UsersService } from "../services/users.service.js"
import { RolesService } from "../services/roles.service.js"

class Controller {
    async getBans(_: Request, res: ResponseHandler<AdministrationGetBans, AuthMiddlewareResponse>): Promise<void> {
        const bans =  await BanService.getAll()

        res.json({
            status: "SUCCESS",
            data: bans
        })
    }

    async updateBanInfo(req: Request<{banId: string}, {}, Partial<DBBan>>, res: ResponseHandler<AdministrationUpdateBanInfo, AuthMiddlewareResponse>): Promise<void> {
        const {banId, ...body} = matchedData(req)

        if(!Object.keys(body).length) {
            res.json({
                status: "BAD_DATA",
                data: "You have to provide any field to update"
            })
        }

        const result = await BanService.updateBan(req.body, banId)

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "Ban updated successfully =]",
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Coudnt update a ban info, sry :("
        })
    }

    async deleteBan(req: Request<{banId: string}>, res: ResponseHandler<AdministrationDeleteBan, AuthMiddlewareResponse>): Promise<void> {
        const banId = parseInt(req.params.banId)

        const result = await BanService.deleteBan(banId)

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "Ban deleted successfully / So the user is unbanned"
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Error has occured :("
        })
    }

    async getAllReports(_: Request, res: ResponseHandler<AdministrationGetReports, AuthMiddlewareResponse>): Promise<any> {
        const reports = await ReportsService.getAll()

        res.json({
            status: "SUCCESS",
            data: reports.rows
        })
    }

    async updateReport(req: Request<{reportId: string}, {}, any>, res: ResponseHandler<AdministrationUpdateReport, AuthMiddlewareResponse>) {
        const {reportId, ...body} = matchedData(req)
        
        if(!Object.keys(body).length) {
            res.json({
                status: "BAD_DATA",
                data: "You have to provide any field to update"
            })
        }

        const result = await ReportsService.update(req.body, {id: reportId})

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "Ban updated successfully =]",
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Coudnt update a ban info, sry :("
        })
    }

    async deleteReport(req: Request<{reportId: string}>, res: ResponseHandler<AdministrationDeleteReport, AuthMiddlewareResponse>): Promise<void> {
        const reportId = parseInt(req.params.reportId)

        const result = await ReportsService.delete({id: reportId})

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "Report deleted successfully =]"
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Error has occured :("
        })
    }

    async getUsers(_: Request, res: ResponseHandler<AdministrationGetUsers, AuthMiddlewareResponse>): Promise<void> {
        const users = await UsersService.getAll()

        res.json({
            status: "SUCCESS",
            data: users.rows
        })
    }

    async updateUser(req: Request<{userId: string}, {}, any>, res: ResponseHandler<AdministrationUpdateUser, AuthMiddlewareResponse>) {
        const {userId, ...body} = matchedData(req)
        
        if(!Object.keys(body).length) {
            res.json({
                status: "BAD_DATA",
                data: "You have to provide any field to update"
            })
        }

        const result = await UsersService.update(req.body, {id: userId})

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "User updated successfully =]",
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Coudnt update a ban info, sry :("
        })
    }

    async deleteUser(req: Request<{userId: string}>, res: ResponseHandler<AdministrationDeleteUser, AuthMiddlewareResponse>): Promise<void> {
        const userId = parseInt(req.params.userId)

        const result = await UsersService.delete({id: userId})

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "User deleted successfully =]"
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Error has occured :("
        })
    }

    async getRoles(_: Request, res: ResponseHandler<AdministrationGetRoles, AuthMiddlewareResponse>): Promise<void> {
        const users = await RolesService.getAll()

        res.json({
            status: "SUCCESS",
            data: users.rows
        })
    }

    async updateRole(req: Request<{roleId: string}, {}, any>, res: ResponseHandler<AdministrationUpdateUser, AuthMiddlewareResponse>) {
        const {roleId, ...body} = matchedData(req)
        
        if(!Object.keys(body).length) {
            res.json({
                status: "BAD_DATA",
                data: "You have to provide any field to update"
            })
        }

        const result = await RolesService.update(req.body, {id: roleId})

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "User updated successfully =]",
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Coudnt update a ban info, sry :("
        })
    }

    async deleteRole(req: Request<{roleId: string}>, res: ResponseHandler<AdministrationDeleteUser, AuthMiddlewareResponse>): Promise<void> {
        const roleId = parseInt(req.params.roleId)

        const result = await RolesService.delete({id: roleId})

        if(result) {
            res.json({
                status: "SUCCESS",
                data: "User deleted successfully =]"
            })
            return
        }

        res.status(500).json({
            status: "ERROR_OCCURRED",
            data: "Error has occured :("
        })
    }
}

export const AdministrationController = new Controller()