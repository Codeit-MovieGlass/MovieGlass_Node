import { ReviewService } from "./review.service.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

// 리뷰 등록 API
export const postReview = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const { rating, review_comment, view_count } = req.body;
    const user_id = req.userId;

    // 필수 데이터 검증
    if (!rating || !review_comment || !view_count) {
      return res.send(response(status.BAD_REQUEST, {
        success: false,
        message: "모든 필드를 입력해야 합니다."
      }));
    }

    // 리뷰 저장 요청
    const review = await ReviewService.createReview({
      user_id,
      movie_id,
      rating,
      review_comment,
      view_count
    });

    res.send(response(status.SUCCESS, {
      data: review
    }));
  } catch (error) {
    console.error("리뷰 등록 오류:", error);
    res.send(response(status.BAD_REQUEST, {
      success: false,
      message: "리뷰 등록 중 오류가 발생했습니다."
    }));
  }
};
