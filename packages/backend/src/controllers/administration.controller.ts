import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type.js"
import { ResponseHandler } from "@app/shared/types/ReponseHandler.type.js"
import { DBRoles, RolesService } from "../services/roles.service.js"
import { Request } from "express"
import { AdministrationDeleteBan, AdministrationGetBans, AdministrationUpdateBanInfo } from "@app/shared/types/api/administration.type.js"
import { BanService, DBBan } from "../services/ban.service.js"
import { matchedData } from "express-validator"

type UpdateRoleRequest = {
    role: number;
}

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
}

export const AdministrationController = new Controller()