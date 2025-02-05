import { CurationModel } from "./curation.model.js";

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
      // 기존 큐레이션을 제외한 랜덤 큐레이션 가져오기
      const shuffledCurations = await CurationModel.getShuffledCurations(req);
      return shuffledCurations;
    } catch (error) {
      console.error("큐레이션 셔플 서비스 오류:", error);
      throw new Error(error);
    }
  }
};



