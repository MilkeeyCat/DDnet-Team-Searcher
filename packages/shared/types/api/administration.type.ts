import { APIResponse } from "../APIResponse.type.js"
import { DBBan } from "@app/backend/src/services/ban.service.js"

export type AdministrationGetBans = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string | Array<DBBan>>

export type AdministrationUpdateBanInfo = APIResponse<"SUCCESS" | "ERROR_OCCURRED" | "BAD_DATA", string>

export type AdministrationDeleteBan = APIResponse<"SUCCESS" | "ERROR_OCCURRED", string>