export const sql = {
    // 사용자 맞춤 TOP 10 영화 조회 (변경 없음)
    getTop10Movies: `
      SELECT 
        movie_id AS id,
        kmdb_id AS kmdbId,
        movie_name AS movieName,
        production_year AS productionYear,
        production_genre AS productionGenre,
        production_country AS productionCountry,
        production_image AS productionImage,
        horizontal_image AS horizontalImage,
        trailer_url AS trailerUrl
      FROM Movie
      ORDER BY RAND() 
      LIMIT 10;
    `,
  
    // 날씨 기반 큐레이션 조회 
    getWeatherCurations: `
      SELECT 
        c.curation_id,
        c.curation_name,
        c.curation_type,  
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'movieId', m.movie_id,
            'title', m.movie_name,
            'posterUrl', m.production_image
          )
        ) AS movies
      FROM Curation c
      JOIN CurationMovie cm ON c.curation_id = cm.curation_id
      JOIN Movie m ON cm.movie_id = m.movie_id
      WHERE c.curation_type = ? 
      GROUP BY c.curation_id;
    `,
  
    // 랜덤 큐레이션 조회 
    getOtherCurations: `
      SELECT 
        c.curation_id,
        c.curation_name,
        c.curation_type,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'movieId', m.movie_id,
            'title', m.movie_name,
            'posterUrl', m.production_image
          )
        ) AS movies
      FROM Curation c
      JOIN CurationMovie cm ON c.curation_id = cm.curation_id
      JOIN Movie m ON cm.movie_id = m.movie_id
      GROUP BY c.curation_id
      ORDER BY RAND()
      LIMIT 2;
    `,



    getEmotionCurations: `
    SELECT 
        c.curation_id,
        c.curation_name,
        c.curation_type,
        JSON_ARRAYAGG(
        JSON_OBJECT(
            'movieId', m.movie_id,
            'title', m.movie_name,
            'posterUrl', m.production_image
        )
        ) AS movies
    FROM Curation c
    JOIN CurationMovie cm ON c.curation_id = cm.curation_id
    JOIN Movie m ON cm.movie_id = m.movie_id
    WHERE c.curation_type = ?
    GROUP BY c.curation_id;
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

  shuffleCurations: `
    SELECT 
      c.curation_id,
      c.curation_name,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'movie_id', m.movie_id,
          'movie_name', m.movie_name,
          'poster_url', m.production_image
        )
      ) AS movies
    FROM Curation c
    JOIN CurationMovie cm ON c.curation_id = cm.curation_id
    JOIN Movie m ON cm.movie_id = m.movie_id
    GROUP BY c.curation_id
    ORDER BY RAND()
    LIMIT 3;
  `,
};
  