import express from 'express'
import { ReviewsController } from '../controllers/reviews.controller.js'

import { authMiddleware } from '../middlewares/auth.middleware.js'
import { bodyValidatorMiddleware } from '../middlewares/bodyValidator.middleware.js'
import { paramsValidatorMiddleware } from '../middlewares/paramsValidator.middleware.js'
import { idSchema } from '../validationSchemas/id.scheme.js'
import { reviewSchema } from '../validationSchemas/review.schema.js'

const Router = express.Router()

Router.post('/reviews/create', authMiddleware, bodyValidatorMiddleware(reviewSchema), ReviewsController.createReview)
Router.get(
    '/reviews/:happeningId',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['happeningId']),
    ReviewsController.getHapenningReviews as any
)

export const ReviewsRouter = Router
