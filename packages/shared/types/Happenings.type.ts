import { DBHappening } from "@app/backend/src/services/happenings.service.js"
import { DBUser } from "@app/backend/src/services/users.service.js"

interface MoreInfo {
    username: DBUser["username"];
    avatar: DBUser["avatar"];
    is_interested: 0 | 1;
    interested: number;
    connect_string?: string;
}

export type Run = Omit<DBHappening, "end_at" | "thumbnail"> & MoreInfo

export type Event = DBHappening & MoreInfo