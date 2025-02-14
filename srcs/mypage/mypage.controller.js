import {
  fetchProfile,
  updateProfileInDB,
  fetchCalendarData,
  fetchUserReviews,
  fetchLikedMovies,
} from "./mypage.model.js";
import { responseData, errorResponse } from "../../config/response.js";

import { upload } from "../utils/multer.js";
// 1. 사용자 프로필 조회
export const getProfile = async (req, res) => {
  try {

    const userId = req.userId;
    const profile = await fetchProfile(userId);

    if (!profile) {
      return res
        .status(404)
        .json(errorResponse("프로필 정보를 찾을 수 없습니다."));
    }

    res.status(200).json(responseData(profile));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 2. 사용자 프로필 업데이트
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nickname } = req.body;
    const profileImage = req.file ? `/uploads/profile/${req.file.filename}` : null; // ✅ 업로드된 이미지 경로 저장

    await updateProfileInDB(userId, nickname, profileImage);

    res.status(200).json(responseData("프로필이 성공적으로 업데이트되었습니다."));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 3. 캘린더 데이터 조회
export const getCalendarData = async (req, res) => {
  try {
    const userId = req.userId;
    const { year, month } = req.query;
    const calendarData = await fetchCalendarData(userId, year, month);

    res.status(200).json(responseData(calendarData));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 4. 사용자가 남긴 리뷰 조회
export const getUserReviews = async (req, res) => {
  try {
    // req.user = await authenticateUser(req);

    const userId = req.userId;
    console.log(userId);
    const reviews = await fetchUserReviews(userId);

    res.status(200).json(responseData(reviews));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 5. 사용자가 좋아요한 영화 조회
export const getLikedMovies = async (req, res) => {
  try {
    const userId = req.userId;
    const likedMovies = await fetchLikedMovies(userId);

    res.status(200).json(responseData(likedMovies));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};
