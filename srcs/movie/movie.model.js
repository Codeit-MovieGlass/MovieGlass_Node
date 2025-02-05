import { pool } from "../../config/db.js";
import { sql } from "./movie.sql.js";

export const MovieModel = {
  // 사용자 맞춤 TOP 10 영화 가져오기
  getTop10Movies: async () => {
    try {
      const [movies] = await pool.query(sql.getTop10Movies);
      return movies;
    } catch (error) {
      console.error("TOP 10 영화 조회 실패:", error);
      return [];
    }
  },


  // 검색어 기반 영화 검색
  getSearchResults: async (query) => {
    try {
      const [movies] = await pool.query(sql.searchMovies, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
      return movies.map((movie) => ({
        movie_id: movie.movie_id,
        title: movie.movie_name,
        poster_url: movie.production_image,
        genre: movie.production_genre,
        keyword: movie.production_keyword
      }));
    } catch (error) {
      console.error("영화 검색 결과 조회 실패:", error);
      return [];
    }
  },

  // 첫 번째 검색 결과를 기준으로 추천 영화 가져오기
  getRecommendations: async (firstMovie) => {
    try {
      const [movies] = await pool.query(sql.recommendMovies, [
        `%${firstMovie.genre}%`,
        `%${firstMovie.keyword}%`,
        `%${firstMovie.title.split(" ")[0]}%` // 제목의 첫 단어로 검색
      ]);
      return movies.map((movie) => ({
        movie_id: movie.movie_id,
        title: movie.movie_name,
        poster_url: movie.production_image
      }));
    } catch (error) {
      console.error("추천 영화 조회 실패:", error);
      return [];
    }
  }
};
