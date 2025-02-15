import { pool } from "../../config/db.js";
import { sql } from "./movie.sql.js";





const addAverageRatingToMovies = async (movies) => {
  if (!movies || movies.length === 0) return;

  for (let movie of movies) {
    const [result] = await pool.query(sql.getAverageRatingByMovieId, [movie.movieId]);
    movie.averageRating = parseFloat(result[0].averageRating) || 0.0;
  }
};

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

      const [movies] = await pool.query(sql.getWeightedRecommendedMovies, [user_id, user_id]);
      const averageRating = await Promise.all(movies.map(async (movie) => {
        const [result] = await pool.query(sql.getAverageRatingByMovieId, [movie.movieId]);
        const rating = parseFloat(result[0].averageRating) || 0.0;
        if (rating === 0.0) {
          const randomRatings = [3, 3.5, 4];
          return randomRatings[Math.floor(Math.random() * randomRatings.length)];
        }
        return rating;
      }));

      await addAverageRatingToMovies(movies);
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
        weightedScore: movie.weightedScore,
        averageRating: movie.averageRating,
      }));
    } catch (error) {
      console.error("TOP 10 영화 조회 실패:", error);
      return [];
    }
  },


  // 검색어 기반 영화 검색
  getSearchResults: async (query) => {
    try {
      const [movies] = await pool.query(sql.searchMovies, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
      return movies.map((movie) => ({
        movie_id: movie.movie_id,
        movie_name: movie.movie_name,
        poster_url: movie.production_image,
        genre: movie.production_genre ? movie.production_genre.split(", ").map((g) => g.trim()) : [],
        keyword: movie.production_keyword ? movie.production_keyword.split(", ").map((k) => k.trim()) : []
        }));
    } catch (error) {
      console.error("영화 검색 결과 조회 실패:", error);
      return [];
    }
  },

  // 첫 번째 검색 결과를 기준으로 추천 영화 가져오기

  getRecommendations: async (firstMovie) => {
    try {
      const genres = firstMovie.genre.map((g) => `%${g.trim()}%`);
      const keywords = firstMovie.keyword.map((k) => `%${k.trim()}%`);
      const [movies] = await pool.query(sql.recommendMovies, [
        `${genres[0]}`,
        `${keywords[0]}`,
        `%${firstMovie.movie_name.split(" ")[0]}%`, // 제목의 첫 단어로 검색
      ]);
      return movies.map((movie) => ({
        movie_id: movie.movie_id,
        movie_name: movie.movie_name,
        poster_url: movie.production_image,
        genre: movie.production_genre ? movie.production_genre.split(", ").map((g) => g.trim()) : [],
        keyword: movie.production_keyword ? movie.production_keyword.split(", ").map((k) => k.trim()) : []
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
      const averageRating = await Promise.all(rows.map(async (movie) => {
        const [result] = await pool.query(sql.getAverageRatingByMovieId, [movie.movieId]);
        const rating = parseFloat(result[0].averageRating) || 0.0;
        if (rating === 0.0) {
          const randomRatings = [3, 3.5, 4];
          return randomRatings[Math.floor(Math.random() * randomRatings.length)];
        }
        return rating;
      }));
      rows.forEach((row, index) => {
        row.averageRating = averageRating[index];
      });

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("영화 정보 조회 오류:", error);
      throw new Error("영화 정보 조회 실패");
    }
  },

  getUserMovieInfo: async (user_id, movieId) => {
    try {
      console.log("사용자 ID:", user_id, "영화 ID:", movieId);
      const [rows] = await pool.query(sql.getUserMovieInfo, [user_id, movieId]);
      console.log("사용자 영화 정보:", rows);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("사용자 영화 정보 조회 오류:", error);
      throw new Error("사용자 영화 정보 조회 실패");
    }
  },

  updateLike: async (movie_id, user_id) => {
    try {
      // 영화 정보가 없으면 에러
      console.log("좋아요 업데이트:", movie_id, user_id);
      const [rows] = await pool.query(sql.updateLike, [user_id, movie_id]);
      const [likes] = await pool.query(sql.checkLike, [user_id, movie_id]);
      console.log("좋아요 정보:", likes);

      return likes[0].liked === 1;
    } catch (error) {
      console.error("좋아요 업데이트 오류:", error);
      throw new Error("좋아요 업데이트 실패");
    }
  },

  updateViewCount: async (movie_id, user_id, view_count) => {
    try {
      const [rows] = await pool.query(sql.updateViewCount, [movie_id, user_id, view_count, view_count]);
      return view_count;
    } catch (error) {
      console.error("조회수 업데이트 오류:", error);
      throw new Error("조회수 업데이트 실패");
    }
  },
};