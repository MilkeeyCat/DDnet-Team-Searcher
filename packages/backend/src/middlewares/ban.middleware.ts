import { APIResponse } from "@app/shared/types/APIResponse.type.js";
import { Request } from "express"
import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type";
import { ResponseHandler } from "@app/shared/types/ReponseHandler.type.js";
import { NextFunction } from "express";
import { BanService } from "../services/ban.service.js";

type BanMiddlewareReponse = APIResponse<"PERMISSION_DENIED", string>

export const banMiddleware = async (_: Request, res: ResponseHandler<BanMiddlewareReponse, AuthMiddlewareResponse>, next: NextFunction) => {
    const isUserBanned = await BanService.isUserBanned(res.locals.user.id)

    if(isUserBanned.banned) {
        res.status(403).json({
            status: "PERMISSION_DENIED",
            data: `You were banned. Reason: ${isUserBanned.reason || "No reason given"}`
        })
        return
    }

    next()
}