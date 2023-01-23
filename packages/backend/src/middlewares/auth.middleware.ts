import jwt from "jsonwebtoken"
import {NextFunction, Request} from "express"
import {AuthMiddlewareResponse} from "@app/shared/types/AuthMiddlewareResponse.type"

const config = process.env

export const authMiddleware = (req: Request, res: AuthMiddlewareResponse, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(403).send("A token is required for authentication")
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY as string)
        res.locals.user = decoded as {id: string, email: string}
    } catch (err) {
        return res.status(401).send("Invalid Token")
    }
    return next()
}