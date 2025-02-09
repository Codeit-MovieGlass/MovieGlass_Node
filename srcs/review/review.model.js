import { pool } from "../../config/db.js";
import { sql } from "./review.sql.js";

export const ReviewModel = {
  insertReview: async ({ user_id, movie_id, rating, review_comment, view_count }) => {
    try {
      const [result] = await pool.query(sql.insertReview, [
        user_id,
        movie_id,
        rating,
        review_comment,
        view_count
      ]);
      return { review_id: result.insertId, movie_id, rating, review_comment, view_count };
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
  }
};
