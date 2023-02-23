import express from "express";
import { AdministrationController } from "../controllers/administration.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { bodyValidatorMiddleware } from "../middlewares/bodyValidator.middleware.js";
import { paramsValidatorMiddleware } from "../middlewares/paramsValidator.middleware.js";
import { permissionMiddleware } from "../middlewares/permission.middleware.js";
import { idSchema } from "../validationSchemas/id.scheme.js";
import { updateBanSchema } from "../validationSchemas/updateBan.schema.js";
import { updateReportSchema } from "../validationSchemas/updateReport.schema.js";
import { updateRoleSchema } from "../validationSchemas/updateRole.schema.js";
import { updateUserSchema } from "../validationSchemas/updateUser.schema.js";

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

Router.get(
    "/administration/reports",
    authMiddleware,
    permissionMiddleware("can_ban"),
    AdministrationController.getAllReports
)
Router.put(
    "/administration/report/:reportId",
    paramsValidatorMiddleware(idSchema, ["reportId"]),
    authMiddleware,
    bodyValidatorMiddleware(updateReportSchema),
    permissionMiddleware("can_ban"),
    AdministrationController.updateReport
)
Router.delete(
    "/administration/report/:reportId",
    paramsValidatorMiddleware(idSchema, ["reportId"]),
    authMiddleware,
    permissionMiddleware("can_create_roles"),
    AdministrationController.deleteReport
)

Router.get(
    "/administration/users",
    authMiddleware,
    permissionMiddleware("can_ban"),
    AdministrationController.getUsers
)
Router.put(
    "/administration/user/:userId",
    paramsValidatorMiddleware(idSchema, ["userId"]),
    authMiddleware,
    bodyValidatorMiddleware(updateUserSchema),
    permissionMiddleware("can_ban"),
    AdministrationController.updateUser
)
Router.delete(
    "/administration/user/:userId",
    paramsValidatorMiddleware(idSchema, ["userId"]),
    authMiddleware,
    permissionMiddleware("can_create_roles"),
    AdministrationController.deleteUser
)

Router.get(
    "/administration/roles",
    authMiddleware,
    permissionMiddleware("can_ban"),
    AdministrationController.getRoles
)
Router.put(
    "/administration/role/:roleId",
    paramsValidatorMiddleware(idSchema, ["roleId"]),
    authMiddleware,
    bodyValidatorMiddleware(updateRoleSchema),
    permissionMiddleware("can_ban"),
    AdministrationController.updateRole
)
Router.delete(
    "/administration/role/:roleId",
    paramsValidatorMiddleware(idSchema, ["roleId"]),
    authMiddleware,
    permissionMiddleware("can_create_roles"),
    AdministrationController.deleteRole
)

export const AdministrationRouter = Router