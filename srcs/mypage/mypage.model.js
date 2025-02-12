import { pool } from "../../config/db.js"; // Named import로 변경
import queries from "./mypage.sql.js";

// 1. 사용자 프로필 조회
export const fetchProfile = async (userId) => {
  const [result] = await pool.query(queries.getUserProfile, [userId]);
  return result[0]; // 결과는 배열이므로 첫 번째 값을 반환
};

// 2. 사용자 프로필 업데이트
export const updateProfileInDB = async (userId, nickname, profileImage) => {
  await pool.query(queries.updateUserProfile, [nickname, profileImage, userId]);
};

// 3. 캘린더 데이터 조회
export const fetchCalendarData = async (userId, year, month) => {
  const [results] = await pool.query(queries.getCalendarData, [
    userId,
    year,
    month,
  ]);

  // 날짜별로 그룹화하여 데이터 변환
  const calendarData = results.reduce((acc, item) => {
    const date = item.watched_date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      title: item.movie_name,
      poster: item.production_image,
    });
    return acc;
  }, {});

  return { calendar: calendarData };
};

// 4. 사용자가 남긴 리뷰 조회
export const fetchUserReviews = async (userId) => {
  const [reviews] = await pool.query(queries.getUserReviews, [userId]);
  return reviews;
};

// 5. 사용자가 좋아요한 영화 조회
export const fetchLikedMovies = async (userId) => {
  const [likedMovies] = await pool.query(queries.getLikedMovies, [userId]);
  return likedMovies;
};
