import { pool } from "../../config/db.js";
import { sql } from "./preference.sql.js";

export const PreferenceModel = {
  // 장르 가중치 업데이트
  updateGenrePreference: async ({ user_id, genre, rating }) => {
    try {
      await pool.query(sql.updateGenrePreference, [genre, rating, user_id, genre, rating]);
    } catch (error) {
      console.error("장르 가중치 업데이트 오류:", error);
      throw new Error("장르 가중치 업데이트 실패");
    }
  },

  // 키워드 가중치 업데이트
  updateKeywordPreference: async ({ user_id, keyword, rating }) => {
    try {
      await pool.query(sql.updateKeywordPreference, [keyword, rating, user_id, keyword, rating]);
    } catch (error) {
      console.error("키워드 가중치 업데이트 오류:", error);
      throw new Error("키워드 가중치 업데이트 실패");
    }
  }
};
