import { pool } from "../../config/db.js";
import { sql } from "./movie.sql.js";

export const MovieModel = {
  // 사용자 맞춤 TOP 10 영화 가져오기
  getTop10Movies: async (req) => {
    try {
      const user_id = req.userId;
      const [preferences] = await pool.query(sql.getUserPreferences, [user_id]);

      const genreWeights = {};
      const keywordWeights = {};

      preferences.forEach((pref) => {
        if (pref.type === "GENRE") genreWeights[pref.name] = pref.weight;
        if (pref.type === "KEYWORD") keywordWeights[pref.name] = pref.weight;
      });

      console.log(`사용자 ${user_id}의 장르 가중치:`, genreWeights);
      console.log(`사용자 ${user_id}의 키워드 가중치:`, keywordWeights);
      const [movies] = await pool.query(sql.getWeightedRecommendedMovies, [user_id, user_id]);

      return movies.map((movie) => ({
        id: movie.id,
        kmdbId: movie.kmdbId,
        movieName: movie.movieName,
        productionYear: movie.productionYear,
        productionGenre: movie.productionGenre ? movie.productionGenre.split(", ").map((g) => g.trim()) : [],
        productionKeyword: movie.productionKeyword ? movie.productionKeyword.split(", ").map((k) => k.trim()) : [],
        productionCountry: movie.productionCountry,
        productionImage: movie.productionImage,
        horizontalImage: movie.horizontalImage,
        trailerUrl: movie.trailerUrl,
        weightedScore: movie.weightedScore
      }));
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
  },


  getMovieGenreAndKeyword: async (movie_id) => {
    try {
      const [rows] = await pool.query(sql.getMovieGenreAndKeyword, [movie_id]);
      return rows.length > 0 ? rows[0] : { genre: null, keyword: null };
    } catch (error) {
      console.error("영화 장르 및 키워드 조회 오류:", error);
      throw new Error("영화 정보 조회 실패");
    }
  },

  getMovieInfo: async (movie_id) => {
    try {
      const [rows] = await pool.query(sql.getMovieInfo, [movie_id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("영화 정보 조회 오류:", error);
      throw new Error("영화 정보 조회 실패");
    }
  },
};
