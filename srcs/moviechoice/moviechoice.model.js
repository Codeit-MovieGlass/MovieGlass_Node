import { pool } from "../../config/db.js";
import { sql } from "./moviechoice.sql.js";

export const MovieChoiceModel = {
  // 특정 장르의 영화 목록 가져오기
  getMoviesByGenres: async (genres) => {
    try {
      const genreArray = genres.split(",").map((g) => `%${g.trim()}%`); // ✅ 장르 배열 변환
      const query = sql.getMoviesByGenres(genreArray.length); // ✅ SQL 동적 생성
      const [movies] = await pool.query(query, genreArray);

      return movies.map((movie) => ({
        movie_id: movie.id,
        kmdb_id: movie.kmdbId,
        title: movie.movieName,
        production_year: movie.productionYear,
        genre: movie.productionGenre,
        country: movie.productionCountry,
        poster_url: movie.productionImage,
        trailer_url: movie.trailerUrl,
        keyword: movie.productionKeyword
      }));
    } catch (error) {
      console.error("장르별 영화 조회 실패:", error);
      return [];
    }
  }
};
export const MovieKeywordModel = {
    // 키워드 기반 영화 검색
    getMoviesByKeyword: async (keyword) => {
      try {
        const [movies] = await pool.query(sql.getMoviesByKeyword, [`%${keyword}%`]);
        return movies.map((movie) => ({
          movie_id: movie.id,
          kmdb_id: movie.kmdbId,
          title: movie.movieName,
          production_year: movie.productionYear,
          genre: movie.productionGenre,
          country: movie.productionCountry,
          poster_url: movie.productionImage,
          trailer_url: movie.trailerUrl,
          keyword: movie.productionKeyword
        }));
      } catch (error) {
        console.error("키워드별 영화 조회 실패:", error);
        return [];
      }
    }
  };
