import express from "express"
import { ReviewsController } from "../controllers/reviews.controller.js"

import {authMiddleware} from "../middlewares/auth.middleware.js"

const Router = express.Router()

Router.post("/reviews/create", authMiddleware, ReviewsController.createReview)
Router.get("/reviews/:happeningId", authMiddleware, ReviewsController.getHapenningReviews)

export const ReviewsRouter = Router