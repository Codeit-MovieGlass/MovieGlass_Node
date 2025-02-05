import { MovieService } from "./movie.service.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

// 새ㅔ10 데이터 가져오기
export const top10Data = async (req, res) => {
  try {
    const weather  = "맑음"; // TODO : 날씨 API 연동 후 수정
    const top10Data = await MovieService.getTop10Data(weather);

    res.send(response(status.SUCCESS, {
      data: top10Data
    }));
  } catch (error) {
    console.error("Top10 데이터 가져오기 오류:", error);
    res.send(response(status.BAD_REQUEST, { success: false, message: "Top10 데이터를 가져오는 중 오류 발생" }));
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
  
      const searchResults = await MovieService.searchMovies(query);
  
      res.send(response(status.SUCCESS, {
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