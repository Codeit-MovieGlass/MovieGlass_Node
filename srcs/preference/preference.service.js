import { PreferenceModel } from "./preference.model.js";
import { MovieModel } from "../movie/movie.model.js";
export const PreferenceService = {
  updateUserPreferences: async ({ user_id, movie_id , ratingDIf }) => {
    try {        
        const { genre, keyword } = await MovieModel.getMovieGenreAndKeyword(movie_id);
        
        // 장르 가중치 업데이트
        if (genre != undefined) {
          await PreferenceModel.updateGenrePreference({ user_id, genre, ratingDIf });
        }
        // 키워드 가중치 업데이트
        if (keyword != undefined) {
            await PreferenceModel.updateKeywordPreference({ user_id, keyword, ratingDIf });
        }
    } catch (error) {
      console.error("사용자 선호도 업데이트 오류:", error);
      throw new Error("사용자 선호도 업데이트 실패");
    }
  }
};
