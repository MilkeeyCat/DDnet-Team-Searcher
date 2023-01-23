import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type";
import { Request, Response } from "express";

class Controller {
    async create(req: Request, res: AuthMiddlewareResponse) {
        //@ts-ignore
        console.log(req.file);
        
        res.json({status: ":D"})
    }
}

export const EventsController = new Controller();