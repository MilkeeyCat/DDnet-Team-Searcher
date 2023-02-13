export type CreateReviewForm = {
    reviewedUserId: number | null;
    happeningId: number;
    text: string;
    rate: string | null;
}