import { ReviewService } from "./review.service.js";
import { responseData } from "../../config/response.js";
import { PreferenceService } from "../preference/preference.service.js";
import status from "../../config/response.status.js";
import { response } from "../../config/response.js";

// 리뷰 등록 API
export const uploadReview = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const { rating, review_comment, view_count, spoiler } = req.body;
    const user_id = req.userId;
    // 리뷰 저장 요청
    const review = await ReviewService.createReview({
      user_id,
      movie_id,
      rating,
      review_comment,
      view_count,
      spoiler
    });
    
    await PreferenceService.updateUserPreferences({
      user_id: user_id,
      movie_id: review.movie_id,
      ratingDIf: review.rating
    });

    res.send(response(status.SUCCESS, review));
  } catch (error) {
    res.send(responseData({
      success: false,
      message: error.message || "리뷰 등록 중 오류가 발생했습니다."
    }));
  }
};

export const updateReview = async (req, res) => {
  try {
    const { movie_id, review_id } = req.params;
    const { rating, review_comment, view_count } = req.body;
    const user_id = req.userId;
  
    const exRating = await ReviewService.getReview({ review_id });

    const review = await ReviewService.updateReview({
      user_id,
      movie_id,
      review_id,
      rating,
      review_comment,
      view_count
    });
    console.log("review", review);

    await PreferenceService.updateUserPreferences({
      user_id: review.user_id,
      movie_id: review.movie_id,
      ratingDIf: review.rating-exRating.rating
    });

    res.send(response(status.SUCCESS, review));
  } catch (error) {
    console.error("리뷰 수정 오류:", error);
    res.send(responseData(status.BAD_REQUEST, {
      success: false,
      message: "리뷰 수정 중 오류가 발생했습니다."
    }));
  }
}


export const deleteReview = async (req, res) => {
  try {
    const { movie_id, review_id } = req.params;
    const user_id = req.userId;

    const exRating = await ReviewService.getReview({ review_id });

    await ReviewService.deleteReview({ review_id });

    await PreferenceService.updateUserPreferences({
      user_id: user_id,
      movie_id: movie_id,
      ratingDIf: -exRating.rating
    });

    res.send(response(status.SUCCESS, "리뷰 삭제 성공"));
  } catch (error) {
    console.error("리뷰 삭제 오류:", error);
    res.send(response(status.BAD_REQUEST, 
      error.message || "리뷰 삭제 중 오류가 발생했습니다."
    ));
  }
}

export const searchMovieReviews = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const reviews = await ReviewService.getReviewsByMovie({ movie_id });
    console.log("reviews", reviews);
    res.send(response(status.SUCCESS, reviews));
  } catch (error) {
    console.error("리뷰 조회 오류:", error);
    res.send(responseData(status.BAD_REQUEST, "리뷰 조회 중 오류가 발생했습니다."));
  }
}
