import express from "express";
import { EventsController } from "../controllers/events.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
const allowedExtensions = [
    "jpeg",
    "png",
    "webp",
];
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./public");
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + "." + file.mimetype.split("/")[1]);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (allowedExtensions.some(name => file.mimetype.includes(name))) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
});
const Router = express.Router();
Router.get("/event/all", authMiddleware, EventsController.getAll);
Router.put("/event/:eventId/start", authMiddleware, EventsController.start);
Router.put("/event/:eventId/end", authMiddleware, EventsController.end);
Router.post("/event/create", authMiddleware, EventsController.create, upload.single("thumbnail"));
Router.put("/event/:eventId/interested", authMiddleware, EventsController.interested);
Router.get("/event/:eventId/interested", authMiddleware, EventsController.getInterestedPlayers);
Router.put("/event/:eventId/in-team/:userId", authMiddleware, EventsController.addOrRemoveFromTeam);
export const EventsRouter = Router;
