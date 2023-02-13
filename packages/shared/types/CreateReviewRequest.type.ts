import { DBReview } from "@app/backend/src/services/reviews.service.js"

export type CreateReviewRequest = {
    reviewedUserId: DBReview["reviewed_user_id"];
    happeningId: DBReview["happening_id"];
    text: DBReview["text"];
    rate: DBReview["rate"];
}