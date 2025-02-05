import { PreferenceModel } from "./preference.model.js";
import { sql } from "../movie/movie.sql.js";

export const PreferenceService = {
  updateUserPreferences: async ({ user_id, movie_id , rating }) => {
    try {
        const { genre, keyword } = await pool.query(sql.getMovieGenreAndKeyword, [movie_id]);
        
        // 장르 가중치 업데이트
        if (genre) {
            await PreferenceModel.updateGenrePreference({ user_id, genre, rating });
        }

        // 키워드 가중치 업데이트
        if (keyword) {
            await PreferenceModel.updateKeywordPreference({ user_id, keyword, rating });
        }
    } catch (error) {
      console.error("사용자 선호도 업데이트 오류:", error);
      throw new Error("사용자 선호도 업데이트 실패");
    }
  }
};
