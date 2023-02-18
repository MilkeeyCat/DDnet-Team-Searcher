import { Db } from "./db.service.js";
import { UsersService } from "./users.service.js";
import { Review, ReviewAboutUser } from "@app/shared/types/Review.type.js"
import { QueryResult } from "pg";

export type DBReview = {
    id: number;
    author_id: number;
    reviewed_user_id: number;
    happening_id: number;
    text: string | null;
    created_at: string;
    rate: 1 | 2 | 3 | 4 | 5;
}

type CreateReviewT = {
    authorId: DBReview["author_id"];
    reviewedUserId: DBReview["reviewed_user_id"];
    happeningId: DBReview["happening_id"];
    text: DBReview["text"];
    rate: DBReview["rate"];
}

class Service {
    async createReview({authorId, rate, reviewedUserId, text, happeningId}: CreateReviewT): Promise<boolean> {
        try {
            await Db.query(`INSERT INTO reviews (author_id, reviewed_user_id, text, happening_id, rate) VALUES($1, $2, $3, $4, $5)`, [authorId, reviewedUserId, text, happeningId, rate])
            return true
        } catch(e) {
            console.log(e);
            return false
        }
    }

    async getHappeningReviews(happeningId: number): Promise<Array<Review>> {
        const reviews: Array<Review> = []

        const data = await Db.query<{
            text: DBReview["text"];
            rate: DBReview["rate"];
            created_at: DBReview["created_at"];
            reviewed_user_id: DBReview["reviewed_user_id"];
            author_id: DBReview["author_id"];
        }>(`SELECT text, rate, author_id, reviewed_user_id, created_at FROM reviews WHERE happening_id = $1`, [happeningId])

        for await (const row of data.rows) {
            const author = await UsersService.getUserData(row.author_id, false, false)
            const reviewedUser = await UsersService.getUserData(row.reviewed_user_id, false, false)

            reviews.push({
                text: row.text,
                rate: row.rate,
                created_at: row.created_at,
                author,
                reviewedUser
            })
        }

        return reviews
    }

    async reviewAlreadyExists({authorId, reviewedUserId, happeningId}: {authorId: number, reviewedUserId: number, happeningId: number}): Promise<QueryResult<{id?: number}>> {
        return await Db.query<{id?: number}>("SELECT id::integer FROM reviews WHERE author_id = $1 AND reviewed_user_id = $2 AND happening_id = $3", [authorId, reviewedUserId, happeningId])
    }

    async getReviewsAboutUser(userId: number): Promise<Array<ReviewAboutUser>> {
        const reviews: Array<ReviewAboutUser> = []
        
        const data = await Db.query<{text: string, rate: 1 | 2 | 3 | 4 | 5, author_id: number, created_at: string}>(`SELECT text, rate, author_id, created_at FROM reviews WHERE reviewed_user_id = $1`, [userId]) 
    
        for await (const row of data.rows) {
            const author = await UsersService.getUserData(row.author_id, false, false)

            reviews.push({
                text: row.text,
                rate: row.rate,
                created_at: row.created_at,
                author
            })
        }

        return reviews
    }
}

export const ReviewsService = new Service()