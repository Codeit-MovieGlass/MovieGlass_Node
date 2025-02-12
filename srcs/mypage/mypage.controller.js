import {
  fetchProfile,
  updateProfileInDB,
  fetchCalendarData,
  fetchUserReviews,
  fetchLikedMovies,
} from "./mypage.model.js";
import { response, errorResponse } from "../../config/response.js";

// 1. 사용자 프로필 조회
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const profile = await fetchProfile(userId);
    if (!profile) {
      return res
        .status(404)
        .json(errorResponse("프로필 정보를 찾을 수 없습니다."));
    }
    res.status(200).json(response(profile));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("서버 오류가 발생했습니다."));
  }
};

// 2. 사용자 프로필 업데이트
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { nickname, profileImage } = req.body;

  try {
    await updateProfileInDB(userId, nickname, profileImage);
    res.status(200).json(response("프로필이 성공적으로 업데이트되었습니다."));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse("프로필 업데이트 중 오류가 발생했습니다."));
  }
};

// 3. 캘린더 데이터 조회 (사용자가 시청한 영화)
export const getCalendarData = async (req, res) => {
  const userId = req.user.id;
  const { year, month } = req.query;

  try {
    const calendarData = await fetchCalendarData(userId, year, month);
    res.status(200).json(response(calendarData));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse("캘린더 데이터를 가져오는 중 오류가 발생했습니다."));
  }
};

// 4. 사용자가 남긴 리뷰 조회
export const getUserReviews = async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await fetchUserReviews(userId);
    res.status(200).json(response(reviews));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse("리뷰 데이터를 가져오는 중 오류가 발생했습니다."));
  }
};

// 5. 사용자가 좋아요한 영화 조회
export const getLikedMovies = async (req, res) => {
  const userId = req.user.id;

  try {
    const likedMovies = await fetchLikedMovies(userId);
    res.status(200).json(response(likedMovies));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse("좋아요한 영화를 가져오는 중 오류가 발생했습니다."));
  }
};
