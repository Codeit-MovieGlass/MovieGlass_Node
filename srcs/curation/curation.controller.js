import { CurationService } from "./curation.service.js";
import { response } from "../../config/response.js";
import status from "../../config/response.status.js";

export const getEmotionCurations = async (req, res) => {
    try {
      const { emotion } = req.query;
      
      if (!emotion) {
        return res.send(response(status.BAD_REQUEST, "감정(emotion) 값이 필요합니다."));
      }
  
      const curations = await CurationService.getEmotionCurations(emotion);
  
      res.send(response(status.SUCCESS, {
        curations
      }));
    } catch (error) {
      console.error("이모지 큐레이션 조회 실패:", error);
      res.send(response(status.BAD_REQUEST,"큐레이션 데이터를 가져오는 중 오류 발생"));
    }
  };



  export const shuffleCurations = async (req, res) => {
    try {
      const shuffledCurations = await CurationService.shuffleCurations(req);
  
      res.send(response(status.SUCCESS, {
        shuffled_curations: shuffledCurations
      }));
    } catch (error) {
      console.error("큐레이션 셔플 오류:", error);
      res.send(response(status.BAD_REQUEST, error));
    }
  };