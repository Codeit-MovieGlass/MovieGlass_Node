import {
  fetchProfile,
  updateProfileInDB,
  fetchCalendarData,
  fetchUserReviews,
  fetchLikedMovies,
} from "./mypage.model.js";
import { response, errorResponse } from "../../config/response.js";
import { pool } from "../../config/db.js";

const authenticateUser = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("인증 토큰이 필요합니다.");
  }

  const token = authHeader.split(" ")[1]; // "Bearer {token}"에서 {token} 부분만 추출

  // DB에서 해당 토큰을 가진 사용자 조회
  const [user] = await pool.query(
    "SELECT user_id, nickname FROM user WHERE refresh_token = ?",
    [token]
  );

  if (!user || user.length === 0) {
    throw new Error("유효하지 않은 토큰입니다.");
  }

  return { id: user[0].user_id, nickname: user[0].nickname };
};

// 1. 사용자 프로필 조회
export const getProfile = async (req, res) => {
  try {
    req.user = await authenticateUser(req); // ✅ 토큰 검증 후 사용자 정보 설정

    const userId = req.user.id;
    const profile = await fetchProfile(userId);

    if (!profile) {
      return res
        .status(404)
        .json(errorResponse("프로필 정보를 찾을 수 없습니다."));
    }

    res.status(200).json(response(profile));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 2. 사용자 프로필 업데이트
export const updateProfile = async (req, res) => {
  try {
    req.user = await authenticateUser(req);

    const userId = req.user.id;
    const { nickname, profileImage } = req.body;

    await updateProfileInDB(userId, nickname, profileImage);

    res.status(200).json(response("프로필이 성공적으로 업데이트되었습니다."));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 3. 캘린더 데이터 조회
export const getCalendarData = async (req, res) => {
  try {
    req.user = await authenticateUser(req);

    const userId = req.user.id;
    const { year, month } = req.query;
    const calendarData = await fetchCalendarData(userId, year, month);

    res.status(200).json(response(calendarData));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 4. 사용자가 남긴 리뷰 조회
export const getUserReviews = async (req, res) => {
  try {
    req.user = await authenticateUser(req);

    const userId = req.user.id;
    const reviews = await fetchUserReviews(userId);

    res.status(200).json(response(reviews));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};

// 5. 사용자가 좋아요한 영화 조회
export const getLikedMovies = async (req, res) => {
  try {
    req.user = await authenticateUser(req);

    const userId = req.user.id;
    const likedMovies = await fetchLikedMovies(userId);

    res.status(200).json(response(likedMovies));
  } catch (error) {
    console.error(error);
    res.status(401).json(errorResponse(error.message));
  }
};
