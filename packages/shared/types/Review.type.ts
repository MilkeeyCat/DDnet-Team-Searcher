import { DBReview } from "@app/backend/src/services/reviews.service.js"
import { User } from "./User.type.js";

export type Review = {
    text: DBReview["text"];
    rate: DBReview["rate"];
    author: User;
    reviewedUser: User
}