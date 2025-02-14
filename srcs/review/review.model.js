import { pool } from "../../config/db.js";
import { sql } from "./review.sql.js";
import status from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";

export const ReviewModel = {
  insertReview: async ({ user_id, movie_id, rating, review_comment, view_count, spoiler }) => {
    try {
      // 리뷰가 이미 존재하는지 확인
      const [existReview] = await pool.query(sql.selectReviewByUser, [user_id, movie_id]);
      if (existReview.length > 0) {
        throw new BaseError({
          isSuccess: false,
          code: status.BAD_REQUEST.code,
          message: "이미 리뷰를 작성했습니다."
        });
      }
      const [user] = await pool.query(sql.selectNicknameByUserId, [user_id]);
      if (user.length === 0) {
        throw new BaseError({
          isSuccess: false,
          code: status.BAD_REQUEST.code,
          message: "해당 사용자의 정보를 찾을 수 없습니다."
        });
      }
      const spoilerValue = spoiler ? 1 : 0;
      const nick_name = user[0].nick_name;
      const [result] = await pool.query(sql.insertReview, [
        user_id,
        movie_id,
        rating,
        review_comment,
        view_count,
        nick_name,
        spoilerValue
      ]);
      return { review_id: result.insertId, movie_id, rating, review_comment, view_count, spoiler };
    } catch (error) {
      console.error("리뷰 저장 오류:", error);
      throw new Error("리뷰 저장 실패");
    }
  },

  selectReview: async ({ review_id }) => {
    try {
      const [review] = await pool.query(sql.selectReview, [review_id]);
      return review[0];
    } catch (error) {
      console.error("리뷰 조회 오류:", error);
      throw new Error("리뷰 조회 실패");
    }
  },

  updateReview: async ({ user_id, movie_id, review_id, rating, review_comment, view_count }) => {
    try {
      await pool.query(sql.updateReview, [rating, review_comment, view_count, review_id]);
      return { user_id, movie_id, review_id, rating, review_comment, view_count };
    } catch (error) {
      console.error("리뷰 수정 오류:", error);
      throw new Error("리뷰 수정 실패");
    }
  },

  deleteReview: async ({ review_id }) => {
    try {
      await pool.query(sql.deleteReview, [review_id]);
    } catch (error) {
      console.error("리뷰 삭제 오류:", error);
      throw new Error("리뷰 삭제 실패");
    }
  },

  selectReviews: async ({ movie_id }) => {
    try {
      const reviews = await pool.query(sql.selectReviews, [movie_id]);
      if (reviews[0].length === 0) {
        throw new BaseError({
          message: "해당 영화의 리뷰가 없습니다."
        });
      }
      console.log("reviews", reviews);
      reviews[0].sort(() => Math.random() - 0.5);
      return reviews[0];
    } catch (error) {
      console.error("리뷰 조회 오류:", error);
      throw new Error("리뷰 조회 실패");
    }
  },

};
