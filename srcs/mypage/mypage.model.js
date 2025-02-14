import { pool } from "../../config/db.js";
import queries from "./mypage.sql.js";

export const fetchProfile = async (userId) => {
  const [result] = await pool.query(queries.getUserProfile, [userId]);
  const user = result[0];

  // ✅ 서버에서 이미지 접근 가능하도록 URL 변환
  return {
    userId: user.user_id,
    email: user.email,
    nickname: user.nickname,
    profileImage: user.profile_image_url
      ? `${process.env.SERVER_URL}${user.profile_image_url}` // 서버 URL + 파일 경로
      : null,
  };
};


export const updateProfileInDB = async (userId, nickname, profileImage) => {
  const query = profileImage 
    ? "UPDATE user SET nickname = ?, profile_image_url = ? WHERE user_id = ?"
    : "UPDATE user SET nickname = ? WHERE user_id = ?";
    
  const params = profileImage ? [nickname, profileImage, userId] : [nickname, userId];

  await pool.query(query, params);
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
