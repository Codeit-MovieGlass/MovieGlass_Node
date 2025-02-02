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
    `
  };
  