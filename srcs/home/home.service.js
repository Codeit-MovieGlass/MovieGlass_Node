import { HomeModel } from "./home.model.js";

export const HomeService = {
  getHomeData: async (weather) => {
    try {
      // 사용자 맞춤 TOP 10 영화 가져오기
      const top10Movies = await HomeModel.getTop10Movies();

      // 날씨 기반 큐레이션 가져오기
      const weatherCurations = await HomeModel.getWeatherCurations(weather);

      // 랜덤 큐레이션 가져오기
      const otherCurations = await HomeModel.getOtherCurations();

      return {
        top10Movies,
        weatherCurations,
        otherCurations
      };
    } catch (error) {
      console.error("홈 서비스 오류:", error);
      throw new Error("홈 데이터 조회 실패");
    }
  }
};
