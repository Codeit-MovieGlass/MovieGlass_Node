import { MovieModel } from "./movie.model.js";

export const MovieService = {
    getTop10Data: async (weather) => {
    try {
      const top10Movies = await MovieModel.getTop10Movies();

      return {
        top10Movies
      };
    } catch (error) {
      console.error("홈 서비스 오류:", error);
      throw new Error("홈 데이터 조회 실패");
    }
  },


  searchMovies: async (query) => {
    try {
      // 검색어 기반 영화 검색
      const searchResults = await MovieModel.getSearchResults(query);

      let recommendations = [];
      if (searchResults.length > 0) {
        // 첫 번째 검색 결과 영화 가져오기
        const firstMovie = searchResults[0];
        recommendations = await MovieModel.getRecommendations(firstMovie);
      }

      return { search_results: searchResults, recommendations };
    } catch (error) {
      console.error("영화 검색 서비스 오류:", error);
      throw new Error("영화 검색 서비스 실패");
    }
  }
};



