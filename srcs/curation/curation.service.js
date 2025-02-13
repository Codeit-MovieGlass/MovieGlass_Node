import { CurationModel } from "./curation.model.js";
import { getWeatherCondition } from "../utils/weather.util.js";

export const CurationService = {

  getEmotionCurations: async (emotion) => {
    try {
      const curations = await CurationModel.getEmotionCurations(emotion);
      return curations;
    } catch (error) {
      console.error("감정 기반 큐레이션 서비스 오류:", error);
      throw new Error(error);
    }
  },
  
  shuffleCurations: async (req) => {
    try {
      const { latitude, longitude } = req.body;
      const weather = null;
      if (latitude) {
        if (!latitude || !longitude) {
          throw new Error("위도와 경도가 필요합니다.");
        }
        weather = await getWeatherCondition(latitude, longitude);
      }
      const shuffledCurations = await CurationModel.getShuffledCurations(req);
      const weatherCurations = await CurationModel.getWeatherCurations(weather);
      shuffledCurations.push(...weatherCurations);
      return shuffledCurations;
    } catch (error) {
      console.error("큐레이션 셔플 서비스 오류:", error);
      throw new Error(error);
    }
  }
};



