import { Db } from "./db.service.js";
import { UsersService } from "./users.service.js";
import { Review } from "@app/shared/types/Review.type.js"

export type DBReview = {
    id: number;
    author_id: number;
    reviewed_user_id: number;
    happening_id: number;
    text: string | null;
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

    async getHappeningReviews(happeningId: string): Promise<Array<Review>> {
        const reviews: Array<Review> = []

        const data = await Db.query<{
            text: DBReview["text"];
            rate: DBReview["rate"];
            reviewed_user_id: DBReview["reviewed_user_id"];
            author_id: DBReview["author_id"];
        }>(`SELECT text, rate, author_id, reviewed_user_id FROM reviews WHERE happening_id = $1`, [happeningId])

        for await (const row of data.rows) {
            const author = await UsersService.getUserData(row.author_id.toString(), false, false)
            const reviewedUser = await UsersService.getUserData(row.reviewed_user_id.toString(), false, false)

            reviews.push({
                text: row.text,
                rate: row.rate,
                author,
                reviewedUser
            })
        }

        return reviews
    }

    async reviewAlreadyExists({authorId, reviewedUserId, happeningId}: {authorId: string, reviewedUserId: number, happeningId: number}) {
        return await Db.query("SELECT id FROM reviews WHERE author_id = $1 AND reviewed_user_id = $2 AND happening_id = $3", [authorId, reviewedUserId, happeningId])

    }
}

export const ReviewsService = new Service()