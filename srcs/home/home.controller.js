import { HomeService } from "./home.service.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

// 홈 데이터 가져오기
export const getHomeData = async (req, res) => {
  try {
    const weather  = "맑음"; // TODO : 날씨 API 연동 후 수정
    const homeData = await HomeService.getHomeData(weather);

    res.send(response(status.SUCCESS, {
      success: true,
      message: "홈 데이터를 성공적으로 가져왔습니다.",
      data: homeData
    }));
  } catch (error) {
    console.error("홈 데이터 가져오기 오류:", error);
    res.send(response(status.BAD_REQUEST, { success: false, message: "홈 데이터를 가져오는 중 오류 발생" }));
  }
};
export const getEmotionCurations = async (req, res) => {
    try {
      const { emotion } = req.query;
      
      if (!emotion) {
        return res.send(response(status.BAD_REQUEST, { success: false, message: "감정(emotion) 값이 필요합니다." }));
      }
  
      const curations = await HomeService.getEmotionCurations(emotion);
  
      res.send(response(status.SUCCESS, {
        success: true,
        message: "큐레이션 데이터를 성공적으로 가져왔습니다.",
        data: { curations }
      }));
    } catch (error) {
      console.error("이모지 큐레이션 조회 실패:", error);
      res.send(response(status.BAD_REQUEST, { success: false, message: "큐레이션 데이터를 가져오는 중 오류 발생" }));
    }
  };



  export const searchMovies = async (req, res) => {
    try {
      const { query } = req.query;
  
      if (!query) {
        return res.send(response(status.BAD_REQUEST, {
          status: "fail",
          message: "검색어(query) 값이 필요합니다."
        }));
      }
  
      const searchResults = await HomeService.searchMovies(query);
  
      res.send(response(status.SUCCESS, {
        status: "success",
        message: "영화 검색 결과를 성공적으로 가져왔습니다.",
        data: searchResults
      }));
    } catch (error) {
      console.error("영화 검색 오류:", error);
      res.send(response(status.BAD_REQUEST, {
        status: "fail",
        message: "영화 검색 중 오류가 발생했습니다."
      }));
    }
  };