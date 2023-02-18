import { APIResponse } from "@app/shared/types/APIResponse.type.js"
import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type"
import { Permissions } from "@app/shared/types/Permissions.type"
import { ResponseHandler } from "@app/shared/types/ReponseHandler.type"
import { NextFunction, Request } from "express"
import { RolesService } from "../services/roles.service.js"

type PermissionMiddlewareResponse = APIResponse<"PERMISSION_DENIED", string>

export const permissionMiddleware = (permission: keyof Permissions) => {
    return async (req: Request, res: ResponseHandler<PermissionMiddlewareResponse, AuthMiddlewareResponse>, next: NextFunction) => {
        const allowed = await RolesService.checkPermission(res.locals.user.id, permission)

        if(!allowed) {
            res.status(403).json({
                status: "PERMISSION_DENIED",
                data: "You dont have permission for this"
            })
            return
        }

        next()
    }
}