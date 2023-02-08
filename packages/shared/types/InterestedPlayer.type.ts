import { DBInterestedHappening } from "@app/backend/src/services/happenings.service.js"
import { User } from "./User.type";
 
export interface InterestedPlayer {
    in_team: DBInterestedHappening["in_team"];
    username: User["username"];
    id: User["id"];
    avatar: User["avatar"];
}