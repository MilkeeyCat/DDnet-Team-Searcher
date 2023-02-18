import { DBReview } from "@app/backend/src/services/reviews.service.js"
import { User } from "./User.type.js";

export type Review = {
    text: DBReview["text"];
    rate: DBReview["rate"];
    created_at: DBReview["created_at"];
    author: User;
    reviewedUser: User;
}

export type ReviewAboutUser = Omit<Review, "reviewedUser">