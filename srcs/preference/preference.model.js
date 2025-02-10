import { pool } from "../../config/db.js";
import { sql } from "./preference.sql.js";
import { parseCommaSeparatedString } from "../utils/toArray.js";

export const PreferenceModel = {
  // 장르 가중치 업데이트
  updateGenrePreference: async ({ user_id, genre, ratingDIf }) => {
    try {
      const genresArray = Array.isArray(genre) ? genre : parseCommaSeparatedString(genre);
      for (const g of genresArray) {
        const [existing] = await pool.query(sql.checkExistingPreference, [user_id, "GENRE", g]);
        if (existing.length > 0) {
          await pool.query(sql.updateExistingPreference, [ratingDIf, user_id, "GENRE", g]);
        } else {
          await pool.query(sql.insertNewPreference, [user_id, "GENRE", g, ratingDIf]);
        }  
      }
    } catch (error) {
      console.error("장르 가중치 업데이트 오류:", error);
      throw new Error("장르 가중치 업데이트 실패");
    }
  },

  // 키워드 가중치 업데이트
  updateKeywordPreference: async ({ user_id, keyword, ratingDIf }) => {
    try {
      const keywordsArray = Array.isArray(keyword) ? keyword : parseCommaSeparatedString(keyword);
      for (const kw of keywordsArray) {
        const [existing] = await pool.query(sql.checkExistingPreference, [user_id, "KEYWORD", kw]);

        if (existing.length > 0) {
          await pool.query(sql.updateExistingPreference, [ratingDIf, user_id, "KEYWORD", kw]);
        } else {
          await pool.query(sql.insertNewPreference, [user_id, "KEYWORD", kw, ratingDIf]);
        }
      }
    } catch (error) {
      console.error("키워드 가중치 업데이트 오류:", error);
      throw new Error("키워드 가중치 업데이트 실패");
    }
  }
};
