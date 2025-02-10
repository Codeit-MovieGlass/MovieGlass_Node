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

  export const MovieSelectionModel = {
    saveSelectedMovies: async (userId, kmdbIds) => {
      try {
        if (kmdbIds.length < 3) {
          throw new Error("최소 3개의 영화를 선택해야 합니다.");
        }
  
        const values = kmdbIds.map((kmdbId) => [userId, kmdbId]); // ✅ 다중 삽입을 위한 데이터 변환
        const [result] = await pool.query(sql.insertSelectedMovies, [values]);
  
        return result;
      } catch (error) {
        console.error("선택한 영화 저장 실패:", error);
        throw error;
      }
    }
  };
