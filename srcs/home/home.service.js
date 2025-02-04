import { HomeModel } from "./home.model.js";

export const HomeService = {
  getHomeData: async (weather) => {
    try {
      const top10Movies = await HomeModel.getTop10Movies();
      const weatherCurations = await HomeModel.getWeatherCurations(weather);
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
  },


  getEmotionCurations: async (emotion) => {
    try {
      const curations = await HomeModel.getEmotionCurations(emotion);
      return curations;
    } catch (error) {
      console.error("감정 기반 큐레이션 서비스 오류:", error);
      throw new Error("감정 기반 큐레이션 조회 실패");
    }
  },

  searchMovies: async (query) => {
    try {
      // 검색어 기반 영화 검색
      const searchResults = await HomeModel.getSearchResults(query);

      let recommendations = [];
      if (searchResults.length > 0) {
        // 첫 번째 검색 결과 영화 가져오기
        const firstMovie = searchResults[0];
        recommendations = await HomeModel.getRecommendations(firstMovie);
      }

      return { search_results: searchResults, recommendations };
    } catch (error) {
      console.error("영화 검색 서비스 오류:", error);
      throw new Error("영화 검색 서비스 실패");
    }
  },
  
  shuffleCurations: async () => {
    try {
      // 기존 큐레이션을 제외한 랜덤 큐레이션 가져오기
      const shuffledCurations = await HomeModel.getShuffledCurations();
      return shuffledCurations;
    } catch (error) {
      console.error("큐레이션 셔플 서비스 오류:", error);
      throw new Error("큐레이션 셔플 조회 실패");
    }
  }
};



