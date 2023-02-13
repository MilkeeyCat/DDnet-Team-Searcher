import { APIResponse } from "../APIResponse.type.js"
import { Review } from "@app/shared/types/Review.type.js"
import { CreateReviewRequest } from "../CreateReviewRequest.type.js"

export type CreateReviewResponse = APIResponse<"REVIEW_CREATED_SUCCESFULLY" | "ERROR_OCCURED" | "BAD_DATA" | "REVIEW_ALREADY_EXISTS" | "USER_NOT_EXISTS", 
{field: keyof CreateReviewRequest, data: string} | string>

export type GetHappeningReviewsResponse = APIResponse<"SUCCESS", Array<Review>>