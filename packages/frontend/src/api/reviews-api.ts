import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { CreateReviewForm } from '../types/CreateReviewForm.type'
import { CreateReviewResponse, GetHappeningReviewsResponse } from "@app/shared/types/api/reviews.type"

export const reviewsApi = createApi({
    reducerPath: 'reviewsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/reviews',
        credentials: 'include',
    }),
    endpoints: (build) => ({
        createReview: build.mutation<CreateReviewResponse, CreateReviewForm>({
            query: (data) => ({
                url: `/create`,
                method: "POST",
                body: data
            })
        }),
        getHappeningReviews: build.query<GetHappeningReviewsResponse, number>({
            query: (happeningId) => `${happeningId}`
        })
    })
})

export const {
    useCreateReviewMutation,
    useGetHappeningReviewsQuery
} = reviewsApi
