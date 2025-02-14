import { MovieChoiceModel, MovieKeywordModel, MovieSelectionModel  } from "./moviechoice.model.js";

export const MovieChoiceService = {
  getMoviesByGenres: async (genres) => {
    try {
      if (!genres) {
        throw new Error("장르 정보가 필요합니다.");
      }
      const movies = await MovieChoiceModel.getMoviesByGenres(genres);
      return { movies };
    } catch (error) {
      console.error("장르별 영화 조회 서비스 오류:", error);
      throw new Error("장르별 영화 조회 실패");
    }
  }
};
export const MovieKeywordService = {
  getMoviesByKeyword: async (keyword) => {
    try {
      if (!keyword) {
        throw new Error("키워드 정보가 필요합니다.");
      }
      const movies = await MovieKeywordModel.getMoviesByKeyword(keyword);
      return { movies };
    } catch (error) {
      console.error("키워드별 영화 조회 서비스 오류:", error);
      throw new Error("키워드별 영화 조회 실패");
    }
  }
};
