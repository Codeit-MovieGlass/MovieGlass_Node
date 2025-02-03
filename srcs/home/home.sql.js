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
        production_image 
    FROM Movie
    WHERE movie_name LIKE ? 
        OR production_genre LIKE ?
        OR production_keyword LIKE ?
        OR movie_id IN (
            SELECT movie_id FROM MovieCast WHERE actor_name LIKE ?
        );
    `,

    // 추천 영화 조회 (장르, 키워드, 인물 기반)
    recommendMovies: `
    SELECT 
        DISTINCT m.movie_id, 
        m.movie_name, 
        m.production_image 
    FROM Movie m
    JOIN MovieCast mc ON m.movie_id = mc.movie_id
    WHERE m.production_genre LIKE ?
        OR m.production_keyword LIKE ?
        OR mc.actor_name LIKE ?
    ORDER BY RAND()
    LIMIT 5;
    `
};
  