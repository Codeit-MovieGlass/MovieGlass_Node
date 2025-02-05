import { ReviewModel } from "./review.model.js";
import { PreferenceService } from "../preference/preference.service.js";

export const ReviewService = {
  createReview: async (reviewData) => {
    try {
      const review = await ReviewModel.insertReview(reviewData);
      await PreferenceService.updateUserPreferences({
        user_id: reviewData.user_id,
        movie_id: reviewData.movie_id,
        rating: reviewData.rating
      });
      return review;
    } catch (error) {
      console.error("리뷰 생성 서비스 오류:", error);
      throw new Error("리뷰 저장 실패");
    }
  }
};
