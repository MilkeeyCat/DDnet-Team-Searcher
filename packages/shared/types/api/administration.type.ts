import { APIResponse } from "../APIResponse.type.js"
import { DBBan } from "@app/backend/src/services/ban.service.js"
import { DBReport } from "@app/backend/src/services/reports.service.js"
import { DBUser } from "@app/backend/src/services/users.service.js"
import { DBRoles } from "@app/backend/src/services/roles.service.js"

export type AdministrationGetBans = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string | Array<DBBan>>

export type AdministrationGetReports = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string | Array<DBReport>>

export type AdministrationGetUsers = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string | Array<DBUser>>

export type AdministrationGetRoles = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string | Array<DBRoles>>

export type AdministrationUpdateBanInfo = APIResponse<"SUCCESS" | "ERROR_OCCURRED" | "BAD_DATA", string>

export type AdministrationUpdateReport = APIResponse<"SUCCESS" | "ERROR_OCCURRED" | "BAD_DATA", string>

export type AdministrationUpdateUser = APIResponse<"SUCCESS" | "ERROR_OCCURRED" | "BAD_DATA", string>

export type AdministrationDeleteBan = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string>

export type AdministrationDeleteReport = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string>

export type AdministrationDeleteUser = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string>