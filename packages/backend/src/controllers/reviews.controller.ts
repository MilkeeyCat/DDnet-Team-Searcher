import { ResponseHandler } from "@app/shared/types/ReponseHandler.type";
import { Request } from "express";
import { CreateReviewRequest } from "@app/shared/types/CreateReviewRequest.type.js"
import { CreateReviewResponse, GetHappeningReviewsResponse } from "@app/shared/types/api/reviews.type.js"
import { ReviewsService } from "../services/reviews.service.js";
import { AuthMiddlewareResponse } from "@app/shared/types/AuthMiddlewareResponse.type";
import { HappeningsService } from "../services/happenings.service.js";
import { UsersService } from "../services/users.service.js";

class Controller {
    async createReview(req: Request<{}, {}, CreateReviewRequest>, res: ResponseHandler<CreateReviewResponse, AuthMiddlewareResponse>) {
        const {happeningId, rate, reviewedUserId, text} = req.body

        const review = await ReviewsService.reviewAlreadyExists({
            authorId: res.locals.user.id,
            reviewedUserId: reviewedUserId,
            happeningId})

        if(review.rowCount) {
            res.json({
                status: "REVIEW_ALREADY_EXISTS",
                data: "Review already exists"
            })
            return
        }

        const author = await HappeningsService.isUserInTeam(happeningId, res.locals.user.id)

        if(!author.rows[0]?.in_team) {
            res.json({
                status: "BAD_DATA",
                data: "You're not in team"
            })
            return
        }

        const isReviewedUserExists = await UsersService.isUserExistsById(reviewedUserId)

        if(isReviewedUserExists) {
            const reviewedUser = await HappeningsService.isUserInTeam(happeningId, reviewedUserId)
    
            if(!reviewedUser.rowCount) {
                res.json({
                    status: "BAD_DATA",
                    data: "You're no allowed to review a player who isnt in team"
                })
                return
            }
        } else {
            res.json({
                status: "USER_NOT_EXISTS",
                data: "User you're trying to review doesnt exists"
            })
        }

        const result = await ReviewsService.createReview({
            reviewedUserId,
            happeningId,
            rate,
            text,
            authorId: res.locals.user.id,
        })

        if(result) {
            res.json({
                status: "REVIEW_CREATED_SUCCESFULLY",
                data: "Review was created successfully =]"
            })
            return
        }
        
        res.status(500).json({
            status: "ERROR_OCCURED",
            data: "Couldnt create a review"
        })
    }

    async getHapenningReviews(req: Request<{happeningId: number}>, res: ResponseHandler<GetHappeningReviewsResponse, AuthMiddlewareResponse>) {
        const happening = HappeningsService.findHappeningById(req.params.happeningId)

        if((await happening).rowCount) {
            const reviews = await ReviewsService.getHappeningReviews(req.params.happeningId)
            
            res.json({
                status: "SUCCESS",
                data: reviews
            })
        } else {
            res.status(404).end()
        }
    }
}

export const ReviewsController = new Controller()