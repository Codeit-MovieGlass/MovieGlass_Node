export const sql = {
  getMovieInfo: `
    SELECT
      *
    FROM Movie
    WHERE movie_id = ?;
  `,
  // 사용자 맞춤 TOP 10 영화 조회 (변경 없음)
  getTop10Movies: `
    SELECT 
      movie_id AS id,
      kmdb_id AS kmdbId,
      movie_name AS movieName,
      production_year AS productionYear,
      production_genre AS productionGenre,
      production_keyword AS productionKeyword,
      production_country AS productionCountry,
      production_image AS productionImage,
      horizontal_image AS horizontalImage,
      trailer_url AS trailerUrl
    FROM Movie
    ORDER BY RAND() 
    LIMIT 10;
  `,


// 검색어 기반 영화 검색 (제목, 인물, 키워드, 장르 포함)
searchMovies: `
  SELECT 
    movie_id, 
    movie_name, 
    production_image,
    production_genre,
    production_keyword
  FROM Movie
  WHERE movie_name LIKE ? 
    OR production_genre LIKE ?
    OR production_keyword LIKE ?
`,

// 첫 번째 검색 결과를 기준으로 추천 영화 조회
recommendMovies: `
  SELECT 
    DISTINCT m.movie_id, 
    m.movie_name, 
    m.production_image 
  FROM Movie m
  WHERE m.production_genre LIKE ?
    OR m.production_keyword LIKE ?
    OR m.movie_name LIKE ?
  ORDER BY RAND()
  LIMIT 5;
`,
// 영화 정보 조회 (장르, 키워드)
getMovieGenreAndKeyword: `
  SELECT 
    production_genre AS genre,
    production_keyword AS keyword
  FROM Movie
  WHERE movie_id = ?;
`,

getUserPreferences: `
  SELECT type, name, weight FROM user_preference_weights
    WHERE user_id = ?
    ORDER BY weight DESC;
`,

  getWeightedRecommendedMovies: `
  SELECT 
    m.movie_id AS id,
    m.kmdb_id AS kmdbId,
    m.movie_name AS movieName,
    m.production_year AS productionYear,
    m.production_genre AS productionGenre,
    m.production_keyword AS productionKeyword,
    m.production_country AS productionCountry,
    m.production_image AS productionImage,
    m.horizontal_image AS horizontalImage,
    m.trailer_url AS trailerUrl,
    IFNULL(AVG(r.rating), 0) AS rating,
    COUNT(r.review_id) AS reviewCount, 
    SUM(upw.weight) AS weightedScore
  FROM Movie m
  LEFT JOIN Review r ON m.movie_id = r.movie_id
  LEFT JOIN user_preference_weights upw ON upw.user_id = ?
    AND (
      m.production_genre LIKE CONCAT('%', upw.name, '%') 
      OR m.production_keyword LIKE CONCAT('%', upw.name, '%')
    )
  GROUP BY m.movie_id
  ORDER BY weightedScore DESC, rating DESC, reviewCount DESC
  LIMIT 10;
  `,


  getMovieInfo: `
    SELECT
      *
    FROM Movie
    WHERE movie_id = ?;
  `,
  
  updateLike: `
    INSERT INTO user_movie (user_id, movie_id, liked, view_count)
    VALUES (?, ?, 1, 0)
    ON DUPLICATE KEY UPDATE liked = IF(liked = 1, 0, 1);
  `,

  //좋아요 확인
  checkLike: `
    SELECT liked
    FROM user_movie
    WHERE user_id = ? AND movie_id = ?;
  `,
  
  updateViewCount: `
    INSERT INTO user_movie (movie_id, user_id, view_count)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE view_count = ?;
  `,

  getUserMovieInfo: `
    SELECT liked, view_count
    FROM user_movie
    WHERE user_id = ? AND movie_id = ?;
  `,
};
