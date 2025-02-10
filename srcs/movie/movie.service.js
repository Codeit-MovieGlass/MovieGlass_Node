import { MovieModel } from "./movie.model.js";

export const MovieService = {
    getTop10Data: async (req) => {
    try {
      const top10Movies = await MovieModel.getTop10Movies(req);

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
  },

  getMovieInfo: async (movieId) => {
    try {
      const movieInfo = await MovieModel.getMovieInfo(movieId);
      return movieInfo;
    } catch (error) {
      console.error("영화 정보 조회 오류:", error);
      throw new Error("영화 정보 조회 실패");
    }
  },
  getUserMovieInfo: async (user_id, movieId) => {
    try {
      const userMovieInfo = await MovieModel.getUserMovieInfo(user_id, movieId);
      return userMovieInfo;
    } catch (error) {
      console.error("사용자 영화 정보 조회 오류:", error);
      throw new Error("사용자 영화 정보 조회 실패");
    }
  },

  updateLike: async (movie_id, user_id) => {
    try {
      const like = await MovieModel.updateLike(movie_id, user_id);
      return like;
    } catch (error) {
      console.error("좋아요 업데이트 오류:", error);
      throw new Error("좋아요 업데이트 실패");
    }
  },

  updateViewCount: async (movie_id, user_id, view_count) => {
    try {
      const viewCount = await MovieModel.updateViewCount(movie_id, user_id, view_count);
      return viewCount;
    } catch (error) {
      console.error("조회수 업데이트 오류:", error);
      throw new Error("조회수 업데이트 실패");
    }
  }
};



