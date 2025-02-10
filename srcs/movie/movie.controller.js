import { MovieService } from "./movie.service.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

// top10 데이터 가져오기
export const top10Data = async (req, res) => {
  try {
    const top10Data = await MovieService.getTop10Data(req);
    res.send(response(status.SUCCESS, {
      top10Data
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
      searchResults
    }));
  } catch (error) {
    console.error("영화 검색 오류:", error);
    res.send(response(status.BAD_REQUEST, {
      status: "fail",
      message: "영화 검색 중 오류가 발생했습니다."
    }));
  }
};

export const getMovieInfo = async (req, res) => {
  try {
    const { movieId } = req.query; 
    console.log("movieId", movieId);
    if (!movieId) {
      return res.send(response(status.BAD_REQUEST, {
        status: "fail",
        message: "영화 ID(movieId) 값이 필요합니다."
      }));
    }
    const movieInfo = await MovieService.getMovieInfo(movieId);

    res.send(response(status.SUCCESS, {
      movieInfo
    }));
  } catch (error) {
    console.error("영화 정보 조회 오류:", error);
    res.send(response(status.BAD_REQUEST, {
      status: "fail",
      message: "영화 정보 조회 중 오류가 발생했습니다."
    }));
  }
}