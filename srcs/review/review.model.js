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
  }
};
