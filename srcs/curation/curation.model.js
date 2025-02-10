import { pool } from "../../config/db.js";
import { sql } from "./curation.sql.js";

export const CurationModel = {
  getEmotionCurations: async (emotion) => {
    try {
      switch (emotion) {
        case "사랑":
          emotion = 21;
          break;
        case "평온":
          emotion = 22;
          break;
        case "눈물":
          emotion = 23;
          break;
        case "웃음":
          emotion = 24;
          break;
        case "긴장":
          emotion = 25;
          break;
      }
      const [curations] = await pool.query(sql.getEmotionCurations, [emotion]);
      return curations.map((curation) => ({
        curationId: curation.curation_id,
        curationName: curation.curation_name,
        curationType: curation.curation_type,
        movies: curation.movies
      }));
    } catch (error) {
      console.error("감정 기반 큐레이션 조회 실패:", error);
      return [];
    }
  },


  getShuffledCurations: async (req) => {
    try {
      let curations;
      
      // 기존 큐레이션을 제외한 랜덤 큐레이션 가져오기
      if (req.body && req.body.exCuration && req.body.exCuration.length > 0) {
        [curations] = await pool.query(sql.shuffleCurations, [req.body.exCuration]);
      } else {
        [curations] = await pool.query(sql.getTwoCurations);
      }
  
      return curations.map((curation) => ({
        curation_id: curation.curation_id,
        curation_name: curation.curation_name,
        movies: curation.movies
      }));
    } catch (error) {
      console.error("큐레이션 셔플 조회 실패:", error);
      return [];
    }
  },


  getWeatherCurations: async (weather) => {
    try { 
      switch (weather) {
        case "흐림":
          weather = 26;
          break;
        case "맑음":
          weather = 27;
          break;
        case "비":
          weather = 28;
          break;
        case "눈":
          weather = 29;
          break;
      }

      const [curations] = await pool.query(sql.getWeatherCuration, [weather]);
      return curations.map((curation) => ({
        curation_id: curation.curation_id,
        curation_name: curation.curation_name,
        movies: curation.movies
      }));
    } catch (error) {
      console.error("날씨 기반 큐레이션 조회 실패:", error);
      return [];
    }
  }
};
