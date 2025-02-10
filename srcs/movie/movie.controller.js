import { MovieService } from "./movie.service.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { PreferenceService } from "../preference/preference.service.js";

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

export const getUserMovieInfo = async (req, res) => {
  try {
    const { movieId } = req.query;
    const user_id = req.userId;
    const userMovieInfo = await MovieService.getUserMovieInfo(user_id, movieId);

    res.send(response(status.SUCCESS, {
      userMovieInfo
    }));
  } catch (error) {
    console.error("사용자 영화 정보 조회 오류:", error);
    res.send(response(status.BAD_REQUEST, {
      status: "fail",
      message: "사용자 영화 정보 조회 중 오류가 발생했습니다."
    }));
  }
}

export const getMovieInfo = async (req, res) => {
  try {
    const { movieId } = req.query; 
    if (!movieId) {
      return res.send(response(status.BAD_REQUEST, {
        status: "fail",
        message: "영화 ID(movieId) 값이 필요합니다."
      }));
    }
    let movieInfo = await MovieService.getMovieInfo(movieId);


    if (movieInfo) {
      movieInfo = {
        ...movieInfo,
        production_genre: movieInfo.production_genre 
          ? movieInfo.production_genre.split(', ').map(g => g.trim()) 
          : [],
        production_keyword: movieInfo.production_keyword 
          ? movieInfo.production_keyword.split(', ').map(k => k.trim()) 
          : [],
        actors: movieInfo.actors 
          ? movieInfo.actors.split(', ').map(a => a.trim()) 
          : []
      };
    }

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
export const updateLike = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const user_id = req.userId;
    const result = await MovieService.updateLike(movie_id, user_id);
    PreferenceService.updateUserPreferences({
      user_id,
      movie_id,
      ratingDIf: result ? 3 : -3,
    });
    res.send(response(status.SUCCESS, {
      success: result
    }));
  } catch (error) {
    console.error("좋아요 업데이트 오류:", error);
    res.send(response(status.BAD_REQUEST, {
      status: "fail",
      message: "좋아요 업데이트 중 오류가 발생했습니다."
    }));
  }
}

export const updateViewCount = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const user_id = req.userId;
    const view_count = req.body.view_count;
    const result = await MovieService.updateViewCount(movie_id, user_id, view_count);


    PreferenceService.updateUserPreferences({
      user_id,
      movie_id,
      ratingDIf: result, // TODO : 이전 조회수와 비교해서 차이 계산
    });
    res.send(response(status.SUCCESS, {
      success: true
    }));
  } catch (error) {
    console.error("조회수 업데이트 오류:", error);
    res.send(response(status.BAD_REQUEST, {
      status: "fail",
      message: "조회수 업데이트 중 오류가 발생했습니다."
    }));
  }
}