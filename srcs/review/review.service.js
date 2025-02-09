import { ReviewModel } from "./review.model.js";

export const ReviewService = {
  createReview: async (reviewData) => {
    try {
      const review = await ReviewModel.insertReview(reviewData);
      return review;
    } catch (error) {
      console.error("리뷰 생성 서비스 오류:", error);
      throw new Error("리뷰 저장 실패");
    }
  },

  getReview: async ({ review_id }) => {
    try {
      const review = await ReviewModel.selectReview({ review_id });
      return review;
    } catch (error) {
      console.error("리뷰 조회 서비스 오류:", error);
      throw new Error("리뷰 조회 실패");
    }
  },

  updateReview: async (reviewData) => {
    try {
      const review = await ReviewModel.updateReview(reviewData);
      return review;
    } catch (error) {
      console.error("리뷰 수정 서비스 오류:", error);
      throw new Error("리뷰 수정 실패");
    }
  },
};

