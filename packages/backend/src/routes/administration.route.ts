import express from "express";
import { AdministrationController } from "../controllers/administration.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { bodyValidatorMiddleware } from "../middlewares/bodyValidator.middleware.js";
import { paramsValidatorMiddleware } from "../middlewares/paramsValidator.middleware.js";
import { permissionMiddleware } from "../middlewares/permission.middleware.js";
import { idSchema } from "../validationSchemas/id.scheme.js";
import { updateBanSchema } from "../validationSchemas/updateBan.schema.js";

const Router = express.Router()

Router.get(
    "/administration/bans",
    authMiddleware,
    permissionMiddleware("can_ban"),
    AdministrationController.getBans
)
Router.put(
    "/administration/ban/:banId",
    paramsValidatorMiddleware(idSchema, ["banId"]),
    authMiddleware,
    bodyValidatorMiddleware(updateBanSchema),
    permissionMiddleware("can_ban"),
    AdministrationController.updateBanInfo
)
Router.delete(
    "/administration/ban/:banId",
    paramsValidatorMiddleware(idSchema, ["banId"]),
    authMiddleware,
    permissionMiddleware("can_create_roles"),
    AdministrationController.deleteBan
)

export const AdministrationRouter = Router