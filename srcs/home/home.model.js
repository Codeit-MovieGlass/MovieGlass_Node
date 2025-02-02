import { pool } from "../../config/db.js";
import { sql } from "./home.sql.js";

export const HomeModel = {
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

  // 날씨 기반 큐레이션 가져오기
  getWeatherCurations: async (weather) => {
    try {
      const [curations] = await pool.query(sql.getWeatherCurations, [weather]);
      return curations.map((curation) => ({
        curationId: curation.curation_id,
        curationName: curation.curation_name,
        curationDescription: curation.curation_type,
        movies: curation.movies
      }));
    } catch (error) {
      console.error("날씨 큐레이션 조회 실패:", error);
      return [];
    }
  },

  // 랜덤 큐레이션 가져오기 
  getOtherCurations: async () => {
    try {
      const [curations] = await pool.query(sql.getOtherCurations);
      return curations.map((curation) => ({
        curationId: curation.curation_id,
        curationName: curation.curation_name,
        curationDescription: curation.curation_type,
        movies: curation.movies 
      }));
    } catch (error) {
      console.error("기타 큐레이션 조회 실패:", error);
      return [];
    }
  }
};
