const queries = {
  // 1. 사용자 프로필 조회
  getUserProfile: `
    SELECT nickname, email, profile_image_url 
    FROM user 
    WHERE user_id = ?
  `,

  // 2. 사용자 프로필 업데이트
  updateUserProfile: `
    UPDATE user 
    SET nickname = ?, profile_image_url = ? 
    WHERE user_id = ?
  `,

  // 3. 캘린더 데이터 조회
  getCalendarData: `
    SELECT watched_date, movie_name, production_image 
    FROM user_movie 
    JOIN Movie ON user_movie.movie_id = Movie.movie_id 
    WHERE user_movie.user_id = ? AND YEAR(watched_date) = ? AND MONTH(watched_date) = ?
  `,

  // 4. 사용자가 남긴 리뷰 조회
  getUserReviews: `
    SELECT review_id, movie_name, rating, review_comment, production_image,
       CAST(spoiler AS UNSIGNED) AS spoiler
    FROM Review
    JOIN Movie ON Review.movie_id = Movie.movie_id 
    WHERE Review.user_id = ?

  `,

  // 5. 사용자가 좋아요한 영화 조회
  getLikedMovies: `
    SELECT movie_name, production_image, production_genre 
    FROM user_movie 
    JOIN Movie ON user_movie.movie_id = Movie.movie_id 
    WHERE user_movie.user_id = ? AND user_movie.liked = 1
  `,
};

export default queries;
